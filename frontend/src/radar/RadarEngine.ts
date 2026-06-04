import type { Map as MapboxMap } from 'mapbox-gl'
import { fetchRadarTimeline } from '../services/radar/radarApi'
import type { RadarFrame } from '../services/radar/radarTypes'
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
 * Orchestrates metadata fetch → frame control → layer updates → animation loop.
 * Keeps rendering logic outside React components.
 */
export class RadarEngine {
  private readonly map: MapboxMap
  private readonly layerManager: RadarLayerManager
  private readonly frameController = new RadarFrameController()
  private readonly animator = new RadarAnimator()
  private readonly opacityEngine = new RadarOpacityEngine()
  private stopped = false
  private onTimestamp: RadarTimestampCallback | null = null

  constructor(map: MapboxMap) {
    this.map = map
    this.layerManager = new RadarLayerManager(map)
  }

  async start(
    center: [number, number],
    onTimestamp?: RadarTimestampCallback,
  ): Promise<void> {
    this.stopped = false
    this.onTimestamp = onTimestamp ?? null

    try {
      const timeline = await fetchRadarTimeline()
      if (this.stopped) return

      this.frameController.setTimeline(timeline)
      const initial = this.frameController.current
      if (!initial) return

      const run = () => this.bootstrap(center, initial)
      if (this.map.isStyleLoaded()) {
        run()
      } else {
        this.map.once('load', run)
      }
    } catch (err) {
      console.error('[RadarEngine] Failed to start:', err)
    }
  }

  private bootstrap(center: [number, number], initial: RadarFrame): void {
    if (this.stopped) return

    this.layerManager.setAnalysisBounds(center)
    this.layerManager.attach(initial, this.opacityEngine.getPaintProperties())
    this.opacityEngine.apply(this.map, this.layerManager.layerId)
    this.emitTimestamp(initial, this.frameController.currentIndex)

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
    this.animator.stop()
    this.layerManager.destroy()
    this.onTimestamp = null
  }
}
