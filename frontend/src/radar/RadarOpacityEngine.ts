import { RADAR_LAYER_OPACITY } from '../services/radar/radarTypes'

/**
 * Atmospheric blending for Leaflet radar tile opacity.
 */
export class RadarOpacityEngine {
  private opacity = RADAR_LAYER_OPACITY

  setOpacity(value: number): void {
    this.opacity = Math.max(0, Math.min(1, value))
  }

  getOpacity(): number {
    return this.opacity
  }
}
