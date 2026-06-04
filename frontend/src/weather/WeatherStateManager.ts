import {
  INITIAL_ATMOSPHERIC_STATE,
  type AtmosphericState,
  type PrecipitationLevel,
  type StormActivity,
} from '../types/weather'
import type { RadarFrame, RadarTimeline } from '../services/radar/radarTypes'
import type { AtmosphericEventBus } from './AtmosphericEventBus'
import type { RadarAtmosphericState } from '../types/weather'

type StateListener = (state: AtmosphericState) => void

type StatePatch = {
  status?: AtmosphericState['status']
  error?: string | null
  radar?: Partial<RadarAtmosphericState>
  overlays?: Partial<AtmosphericState['overlays']>
}

function inferPrecipitation(frameCount: number, frameIndex: number): PrecipitationLevel {
  if (frameCount === 0) return 'none'
  const recency = frameIndex / Math.max(1, frameCount - 1)
  if (recency < 0.4) return 'light'
  if (recency < 0.7) return 'moderate'
  if (recency < 0.9) return 'heavy'
  return 'extreme'
}

function inferStormActivity(level: PrecipitationLevel): StormActivity {
  if (level === 'heavy' || level === 'extreme') return 'severe'
  if (level === 'moderate') return 'active'
  return 'calm'
}

/**
 * Single source of truth for live atmospheric state.
 */
export class WeatherStateManager {
  private state: AtmosphericState = { ...INITIAL_ATMOSPHERIC_STATE }
  private listeners = new Set<StateListener>()

  private readonly bus: AtmosphericEventBus

  constructor(bus: AtmosphericEventBus) {
    this.bus = bus
  }

  get snapshot(): AtmosphericState {
    return this.state
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  private commit(patch: StatePatch): void {
    this.state = {
      ...this.state,
      ...patch,
      radar: { ...this.state.radar, ...(patch.radar ?? {}) },
      overlays: { ...this.state.overlays, ...(patch.overlays ?? {}) },
    }
    for (const listener of this.listeners) {
      listener(this.state)
    }
    this.bus.emit('weather:state-changed', { state: this.state })
  }

  setLoading(): void {
    this.commit({ status: 'loading', error: null })
  }

  setError(message: string): void {
    this.commit({ status: 'error', error: message })
  }

  setTimeline(timeline: RadarTimeline, nextRefreshAt: number): void {
    const latest = timeline.frames.at(-1) ?? null
    this.commit({
      status: 'live',
      error: null,
      radar: {
        timeline,
        frameCount: timeline.frames.length,
        latestTimestamp: latest?.timestamp ?? null,
        lastRefreshAt: Date.now(),
        nextRefreshAt,
        cloudDensity: Math.min(1, timeline.frames.length / 12),
      },
    })
  }

  setActiveFrame(frame: RadarFrame, frameIndex: number): void {
    const frameCount = this.state.radar.frameCount
    const precipitationLevel = inferPrecipitation(frameCount, frameIndex)
    const stormActivity = inferStormActivity(precipitationLevel)

    this.commit({
      status: 'live',
      radar: {
        activeFrame: frame,
        frameIndex,
        activeTimestamp: frame.timestamp,
        precipitationLevel,
        stormActivity,
      },
    })
  }

  setNextRefreshAt(nextRefreshAt: number): void {
    this.commit({
      radar: { nextRefreshAt },
    })
  }
}
