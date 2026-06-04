import type { RadarFrame, RadarTimeline } from '../services/radar/radarTypes'

/**
 * Tracks active frame index and timestamp synchronization for playback.
 */
export class RadarFrameController {
  private frames: RadarFrame[] = []
  private index = 0

  setTimeline(timeline: RadarTimeline): void {
    this.frames = timeline.frames
    this.index = Math.max(0, this.frames.length - 1)
  }

  get frameCount(): number {
    return this.frames.length
  }

  get current(): RadarFrame | null {
    return this.frames[this.index] ?? null
  }

  get currentIndex(): number {
    return this.index
  }

  /** Advance to next frame; loops to start at end of sequence. */
  advance(): RadarFrame | null {
    if (this.frames.length === 0) return null
    this.index = (this.index + 1) % this.frames.length
    return this.current
  }

  setFrame(index: number): RadarFrame | null {
    if (this.frames.length === 0) return null
    this.index = Math.max(0, Math.min(index, this.frames.length - 1))
    return this.current
  }
}
