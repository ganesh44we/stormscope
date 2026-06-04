import type { Map as LeafletMap } from 'leaflet'
import type { RadarFrame, RadarTimeline } from '../services/radar/radarTypes'
import type { LngLat } from '../types/map'
import { RadarAnimator } from './RadarAnimator'
import { RadarFrameController } from './RadarFrameController'
import { RadarLayerManager } from './RadarLayerManager'
import { RadarOpacityEngine } from './RadarOpacityEngine'

export type RadarTimestampCallback = (
  timestamp: number,
  frameIndex: number,
  frameCount: number,
) => void

/**
 * Leaflet radar rendering — driven by WeatherEngine (no direct API calls).
 */
export class RadarEngine {
  private readonly map: LeafletMap
  private readonly layerManager: RadarLayerManager
  private readonly frameController = new RadarFrameController()
  private readonly animator = new RadarAnimator()
  private readonly opacityEngine = new RadarOpacityEngine()
  private stopped = false
  private bootstrapped = false
  private onTimestamp: RadarTimestampCallback | null = null
  private center: LngLat | null = null

  constructor(map: LeafletMap) {
    this.map = map
    this.layerManager = new RadarLayerManager(map)
  }

  async start(
    center: LngLat,
    timeline: RadarTimeline,
    onTimestamp?: RadarTimestampCallback,
  ): Promise<void> {
    this.stopped = false
    this.center = center
    this.onTimestamp = onTimestamp ?? null
    this.frameController.setTimeline(timeline)

    const initial = this.frameController.current
    if (!initial) return

    this.whenMapReady(() => this.bootstrap(center, initial))
  }

  /** Hot-swap timeline without tearing down the Leaflet layer. */
  refreshTimeline(
    timeline: RadarTimeline,
    onTimestamp?: RadarTimestampCallback,
  ): void {
    if (this.stopped) return
    if (onTimestamp) this.onTimestamp = onTimestamp

    this.frameController.setTimeline(timeline)
    const frame = this.frameController.current
    if (!frame) return

    if (this.bootstrapped) {
      this.layerManager.setFrame(frame)
      this.emitTimestamp(frame, this.frameController.currentIndex)
      if (!this.animator.running) {
        this.startAnimationLoop()
      }
    } else if (this.center) {
      this.whenMapReady(() => this.bootstrap(this.center!, frame))
    }
  }

  private whenMapReady(run: () => void): void {
    this.map.whenReady(run)
  }

  private bootstrap(center: LngLat, initial: RadarFrame): void {
    if (this.stopped) return

    this.layerManager.setAnalysisBounds(center)
    this.layerManager.attach(initial, this.opacityEngine.getOpacity())
    this.bootstrapped = true
    this.emitTimestamp(initial, this.frameController.currentIndex)
    this.startAnimationLoop()
  }

  private startAnimationLoop(): void {
    this.animator.start(() => {
      const frame = this.frameController.advance()
      if (!frame || this.stopped) return
      this.layerManager.setFrame(frame)
      this.emitTimestamp(frame, this.frameController.currentIndex)
    })
  }

  private emitTimestamp(frame: RadarFrame, index: number): void {
    this.onTimestamp?.(
      frame.timestamp,
      index,
      this.frameController.frameCount,
    )
  }

  stop(): void {
    this.stopped = true
    this.bootstrapped = false
    this.animator.stop()
    this.layerManager.destroy()
    this.onTimestamp = null
    this.center = null
  }
}
