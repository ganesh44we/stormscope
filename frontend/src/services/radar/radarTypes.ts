/** Raw RainViewer API shape (provider-specific — do not use in UI). */
export interface RainViewerMapsResponse {
  version: string
  generated: number
  host: string
  radar: {
    past: RainViewerFrameRaw[]
    nowcast: RainViewerFrameRaw[]
  }
}

export interface RainViewerFrameRaw {
  time: number
  path: string
}

/** Normalized internal models — safe for radar engine and UI. */
export interface RadarFrame {
  timestamp: number
  path: string
  tileUrlTemplate: string
}

export interface RadarTimeline {
  version: string
  generated: number
  host: string
  frames: RadarFrame[]
}

/** RainViewer color scheme 2 = TMN intensity (green → yellow → red → purple). */
export const RADAR_COLOR_SCHEME = 2
export const RADAR_TILE_OPTIONS = '1_1'
export const RADAR_TILE_SIZE = 256
export const RADAR_MAX_ANIMATION_FRAMES = 12
export const RADAR_ANIMATION_INTERVAL_MS = 800
export const RADAR_LAYER_OPACITY = 0.85
export const RADAR_FADE_DURATION_MS = 450
