import type { MapOptions } from 'mapbox-gl'

/** Fallback center (continental US) before geolocation resolves. */
export const DEFAULT_CENTER: [number, number] = [-98.5795, 39.8283]

export const DEFAULT_ZOOM = 4

/** Dark basemap — high contrast for future radar overlays. */
export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11'

export function getMapboxToken(): string | undefined {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  return typeof token === 'string' && token.trim().length > 0
    ? token.trim()
    : undefined
}

export function createMapOptions(
  container: HTMLElement,
): MapOptions & { container: HTMLElement } {
  return {
    container,
    style: MAP_STYLE,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    pitch: 0,
    bearing: 0,
    antialias: true,
    attributionControl: true,
  }
}
