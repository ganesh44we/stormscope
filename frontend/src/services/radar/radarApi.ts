import { parseRadarMapsResponse } from './radarParser'
import type { RadarTimeline, RainViewerMapsResponse } from './radarTypes'

const RAINVIEWER_MAPS_URL = 'https://api.rainviewer.com/public/weather-maps.json'

export class RadarApiError extends Error {
  override readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'RadarApiError'
    this.cause = cause
  }
}

/**
 * Fetches live radar metadata from RainViewer and returns normalized timeline data.
 */
export async function fetchRadarTimeline(): Promise<RadarTimeline> {
  let response: Response
  try {
    response = await fetch(RAINVIEWER_MAPS_URL)
  } catch (err) {
    throw new RadarApiError('Failed to reach RainViewer API.', err)
  }

  if (!response.ok) {
    throw new RadarApiError(`RainViewer API returned ${response.status}.`)
  }

  let data: RainViewerMapsResponse
  try {
    data = (await response.json()) as RainViewerMapsResponse
  } catch (err) {
    throw new RadarApiError('Invalid RainViewer API response.', err)
  }

  const timeline = parseRadarMapsResponse(data)
  if (timeline.frames.length === 0) {
    throw new RadarApiError('No radar frames available.')
  }

  return timeline
}
