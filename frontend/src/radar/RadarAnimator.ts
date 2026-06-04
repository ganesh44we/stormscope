import { RADAR_ANIMATION_INTERVAL_MS } from '../services/radar/radarTypes'

/**
 * Frame playback timing — isolated from React render cycle.
 */
export class RadarAnimator {
  private timer: ReturnType<typeof setInterval> | null = null
  private intervalMs = RADAR_ANIMATION_INTERVAL_MS

  setIntervalMs(ms: number): void {
    this.intervalMs = Math.max(200, ms)
  }

  start(onTick: () => void): void {
    this.stop()
    this.timer = setInterval(onTick, this.intervalMs)
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  get running(): boolean {
    return this.timer !== null
  }
}
