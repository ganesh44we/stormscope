import {
  RADAR_COLOR_SCHEME,
  RADAR_MAX_ANIMATION_FRAMES,
  RADAR_TILE_OPTIONS,
  RADAR_TILE_SIZE,
  type RadarFrame,
  type RadarTimeline,
  type RainViewerMapsResponse,
} from './radarTypes'

export function buildTileUrlTemplate(host: string, path: string): string {
  const base = host.endsWith('/') ? host.slice(0, -1) : host
  return `${base}${path}/${RADAR_TILE_SIZE}/{z}/{x}/{y}/${RADAR_COLOR_SCHEME}/${RADAR_TILE_OPTIONS}.png`
}

function normalizeFrame(host: string, raw: { time: number; path: string }): RadarFrame {
  return {
    timestamp: raw.time,
    path: raw.path,
    tileUrlTemplate: buildTileUrlTemplate(host, raw.path),
  }
}

/**
 * Converts provider JSON into a sorted timeline for animation playback.
 */
export function parseRadarMapsResponse(data: RainViewerMapsResponse): RadarTimeline {
  const host = data.host
  const combined = [...data.radar.past, ...data.radar.nowcast]
    .map((frame) => normalizeFrame(host, frame))
    .sort((a, b) => a.timestamp - b.timestamp)

  const frames =
    combined.length > RADAR_MAX_ANIMATION_FRAMES
      ? combined.slice(-RADAR_MAX_ANIMATION_FRAMES)
      : combined

  return {
    version: data.version,
    generated: data.generated,
    host,
    frames,
  }
}
