const BASE_METADATA_INTERVAL_MS = 5 * 60 * 1000
const HIDDEN_INTERVAL_MS = 15 * 60 * 1000
const MIN_INTERVAL_MS = 60 * 1000

export type ScheduledTask = () => void | Promise<void>

/**
 * Adaptive polling — slows when tab is hidden, prevents timer leaks.
 */
export class WeatherUpdateScheduler {
  private timer: ReturnType<typeof setTimeout> | null = null
  private task: ScheduledTask | null = null
  private running = false
  private onVisibilityChange: (() => void) | null = null

  start(task: ScheduledTask, intervalMs = BASE_METADATA_INTERVAL_MS): void {
    this.stop()
    this.task = task
    this.running = true

    const scheduleNext = (delay: number) => {
      if (!this.running) return
      const clamped = Math.max(MIN_INTERVAL_MS, delay)
      this.timer = setTimeout(async () => {
        if (!this.running || !this.task) return
        try {
          await this.task()
        } catch (err) {
          console.error('[WeatherUpdateScheduler]', err)
        }
        scheduleNext(this.getInterval(intervalMs))
      }, clamped)
    }

    this.onVisibilityChange = () => {
      if (!this.running) return
      if (this.timer) clearTimeout(this.timer)
      scheduleNext(this.getInterval(intervalMs))
    }

    document.addEventListener('visibilitychange', this.onVisibilityChange)
    scheduleNext(0)
  }

  private getInterval(baseMs: number): number {
    return document.hidden ? HIDDEN_INTERVAL_MS : baseMs
  }

  stop(): void {
    this.running = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.onVisibilityChange) {
      document.removeEventListener('visibilitychange', this.onVisibilityChange)
      this.onVisibilityChange = null
    }
    this.task = null
  }
}
