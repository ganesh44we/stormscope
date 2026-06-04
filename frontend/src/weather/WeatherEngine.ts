import type { Map as LeafletMap } from 'leaflet'
import { fetchRadarTimeline, RadarApiError } from '../services/radar/radarApi'
import type { RadarTimeline } from '../services/radar/radarTypes'
import type { LngLat } from '../types/map'
import { RadarEngine } from '../radar/RadarEngine'
import { AtmosphericEventBus } from './AtmosphericEventBus'
import { WeatherCacheManager } from './WeatherCacheManager'
import { WeatherStateManager } from './WeatherStateManager'
import { WeatherUpdateScheduler } from './WeatherUpdateScheduler'
import type { PrecipitationLevel } from '../types/weather'

export type WeatherEngineOptions = {
  map: LeafletMap
  center: LngLat
  metadataRefreshMs?: number
}

/**
 * Central atmospheric runtime — orchestrates state, events, cache, scheduler, radar.
 */
export class WeatherEngine {
  readonly bus = new AtmosphericEventBus()
  readonly state = new WeatherStateManager(this.bus)
  private readonly cache = new WeatherCacheManager()
  private readonly scheduler = new WeatherUpdateScheduler()
  private readonly radar: RadarEngine
  private readonly options: WeatherEngineOptions
  private stopped = true
  private lastCycleFrameIndex = -1
  private unsubscribers: Array<() => void> = []

  constructor(options: WeatherEngineOptions) {
    this.options = options
    this.radar = new RadarEngine(options.map)
    this.wireEventSideEffects()
  }

  async start(): Promise<void> {
    this.stopped = false
    await this.refreshMetadata(true)

    this.scheduler.start(
      () => this.refreshMetadata(false),
      this.options.metadataRefreshMs,
    )
  }

  stop(): void {
    this.stopped = true
    this.scheduler.stop()
    this.radar.stop()
    for (const off of this.unsubscribers) off()
    this.unsubscribers = []
    this.bus.clear()
    this.cache.invalidate()
  }

  private wireEventSideEffects(): void {
    const prevLevel: { value: PrecipitationLevel } = { value: 'none' }

    this.unsubscribers.push(
      this.bus.on('radar:frame-changed', ({ frameIndex, frameCount }) => {
        if (frameIndex === 0 && this.lastCycleFrameIndex === frameCount - 1) {
          this.bus.emit('radar:animation-cycle-complete', { frameCount })
        }
        this.lastCycleFrameIndex = frameIndex

        const snap = this.state.snapshot
        if (
          snap.radar.precipitationLevel === 'heavy' ||
          snap.radar.precipitationLevel === 'extreme'
        ) {
          if (prevLevel.value !== snap.radar.precipitationLevel) {
            this.bus.emit('precipitation:heavy-detected', {
              level: snap.radar.precipitationLevel,
            })
            prevLevel.value = snap.radar.precipitationLevel
          }
        }

        if (snap.radar.stormActivity !== 'calm') {
          this.bus.emit('storm:activity-detected', {
            activity: snap.radar.stormActivity,
          })
        }
      }),
    )
  }

  private async refreshMetadata(initial: boolean): Promise<void> {
    if (this.stopped) return

    this.bus.emit('radar:refresh-started', {})
    if (initial) this.state.setLoading()

    let timeline: RadarTimeline | null = initial ? this.cache.get() : null

    try {
      if (!timeline) {
        timeline = await fetchRadarTimeline()
        this.cache.set(timeline)
      }

      if (this.stopped || !timeline) return

      const nextRefreshAt =
        Date.now() + (this.options.metadataRefreshMs ?? 5 * 60 * 1000)

      this.state.setTimeline(timeline, nextRefreshAt)
      this.bus.emit('radar:timeline-received', {
        generated: timeline.generated,
        frameCount: timeline.frames.length,
      })

      const onFrame = (ts: number, index: number, count: number) => {
        const frame = timeline!.frames[index]
        if (frame) this.state.setActiveFrame(frame, index)
        this.bus.emit('radar:frame-changed', {
          timestamp: ts,
          frameIndex: index,
          frameCount: count,
        })
      }

      if (initial) {
        await this.radar.start(this.options.center, timeline, onFrame)
      } else {
        this.radar.refreshTimeline(timeline, onFrame)
      }

      this.bus.emit('radar:refresh-complete', {
        generated: timeline.generated,
        frameCount: timeline.frames.length,
      })
      this.state.setNextRefreshAt(nextRefreshAt)
    } catch (err) {
      const message =
        err instanceof RadarApiError ? err.message : 'Weather refresh failed.'
      this.state.setError(message)
      console.error('[WeatherEngine]', err)
    }
  }
}
