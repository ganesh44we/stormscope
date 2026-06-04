import type { Map as MapboxMap } from 'mapbox-gl'
import {
  RADAR_FADE_DURATION_MS,
  RADAR_LAYER_OPACITY,
} from '../services/radar/radarTypes'

/**
 * Controls atmospheric blending via Mapbox raster paint properties.
 */
export class RadarOpacityEngine {
  private opacity = RADAR_LAYER_OPACITY
  private fadeDurationMs = RADAR_FADE_DURATION_MS

  setOpacity(value: number): void {
    this.opacity = Math.max(0, Math.min(1, value))
  }

  apply(map: MapboxMap, layerId: string): void {
    if (!map.getLayer(layerId)) return
    map.setPaintProperty(layerId, 'raster-opacity', this.opacity)
    map.setPaintProperty(layerId, 'raster-fade-duration', this.fadeDurationMs)
  }

  getPaintProperties(): {
    'raster-opacity': number
    'raster-fade-duration': number
  } {
    return {
      'raster-opacity': this.opacity,
      'raster-fade-duration': this.fadeDurationMs,
    }
  }
}
