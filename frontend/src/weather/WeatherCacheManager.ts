import type { RadarTimeline } from '../services/radar/radarTypes'

const DEFAULT_TTL_MS = 2 * 60 * 1000

interface CacheEntry {
  timeline: RadarTimeline
  storedAt: number
}

/**
 * In-memory radar metadata cache (Redis-ready interface later).
 */
export class WeatherCacheManager {
  private entry: CacheEntry | null = null
  private readonly ttlMs: number

  constructor(ttlMs = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs
  }

  get(): RadarTimeline | null {
    if (!this.entry) return null
    if (Date.now() - this.entry.storedAt > this.ttlMs) {
      this.entry = null
      return null
    }
    return this.entry.timeline
  }

  set(timeline: RadarTimeline): void {
    this.entry = { timeline, storedAt: Date.now() }
  }

  invalidate(): void {
    this.entry = null
  }

  get isFresh(): boolean {
    return this.get() !== null
  }
}
