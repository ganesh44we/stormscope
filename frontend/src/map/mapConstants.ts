import type { LngLat } from '../types/map'

/** OpenStreetMap raster tiles — free, no API key. */
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

export const RAINVIEWER_ATTRIBUTION = 'Radar © RainViewer'

export const DEFAULT_CENTER: LngLat = [78.4867, 17.385]

export const DEFAULT_ZOOM = 6

export const USER_LOCATION_ZOOM = 7
