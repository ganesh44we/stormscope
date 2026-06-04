import * as turf from '@turf/turf'
import L from 'leaflet'
import type { RadarFrame } from '../services/radar/radarTypes'
import type { LngLat } from '../types/map'
import { toLeafletLatLng } from '../types/map'
import { ATMOSPHERIC_RADIUS_KM } from '../types/geolocation'

export const RADAR_LAYER_ID = 'stormscope-radar-layer'
export const RADAR_PANE_NAME = 'stormscope-radar-pane'

/**
 * Leaflet tile layer lifecycle for RainViewer radar frames.
 */
export class RadarLayerManager {
  private attached = false
  private layer: L.TileLayer | null = null
  private readonly map: L.Map

  constructor(map: L.Map) {
    this.map = map
    this.ensureRadarPane()
  }

  private ensureRadarPane(): void {
    if (this.map.getPane(RADAR_PANE_NAME)) return
    const pane = this.map.createPane(RADAR_PANE_NAME)
    pane.style.zIndex = '450'
    pane.style.pointerEvents = 'none'
  }

  get layerId(): string {
    return RADAR_LAYER_ID
  }

  attach(frame: RadarFrame, opacity: number): void {
    if (this.attached && this.layer) {
      this.setFrame(frame)
      this.layer.setOpacity(opacity)
      return
    }

    this.layer = L.tileLayer(frame.tileUrlTemplate, {
      opacity,
      maxZoom: 12,
      tileSize: 256,
      pane: RADAR_PANE_NAME,
      crossOrigin: 'anonymous',
    })
    this.layer.addTo(this.map)
    this.attached = true
  }

  setFrame(frame: RadarFrame): void {
    if (!this.layer) return
    this.layer.setUrl(frame.tileUrlTemplate)
  }

  setOpacity(opacity: number): void {
    this.layer?.setOpacity(opacity)
  }

  /** Constrain panning to the atmospheric analysis zone. */
  setAnalysisBounds(center: LngLat, radiusKm = ATMOSPHERIC_RADIUS_KM): void {
    const circle = turf.circle(center, radiusKm, {
      steps: 64,
      units: 'kilometers',
    })
    const bbox = turf.bbox(circle)
    const bounds = L.latLngBounds(
      toLeafletLatLng([bbox[0], bbox[1]]),
      toLeafletLatLng([bbox[2], bbox[3]]),
    )
    this.map.setMaxBounds(bounds)
  }

  destroy(): void {
    if (this.layer) {
      this.map.removeLayer(this.layer)
      this.layer = null
    }
    this.map.setMaxBounds(false as unknown as L.LatLngBoundsExpression)
    this.attached = false
  }
}
