import * as turf from '@turf/turf'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { RadarFrame } from '../services/radar/radarTypes'
import { ATMOSPHERIC_RADIUS_KM } from '../types/geolocation'

export const RADAR_SOURCE_ID = 'stormscope-radar-source'
export const RADAR_LAYER_ID = 'stormscope-radar-layer'

/**
 * Mapbox source/layer lifecycle for radar raster tiles.
 */
export class RadarLayerManager {
  private attached = false
  private readonly map: MapboxMap

  constructor(map: MapboxMap) {
    this.map = map
  }

  get layerId(): string {
    return RADAR_LAYER_ID
  }

  attach(frame: RadarFrame, paint: Record<string, unknown>): void {
    if (this.attached) {
      this.setFrame(frame)
      return
    }

    this.map.addSource(RADAR_SOURCE_ID, {
      type: 'raster',
      tiles: [frame.tileUrlTemplate],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 12,
    })

    const beforeId = this.map.getLayer('radius-outline')
      ? 'radius-outline'
      : undefined

    this.map.addLayer(
      {
        id: RADAR_LAYER_ID,
        type: 'raster',
        source: RADAR_SOURCE_ID,
        paint,
      },
      beforeId,
    )

    this.attached = true
  }

  setFrame(frame: RadarFrame): void {
    const source = this.map.getSource(RADAR_SOURCE_ID)
    if (source && 'setTiles' in source && typeof source.setTiles === 'function') {
      source.setTiles([frame.tileUrlTemplate])
    }
  }

  /** Constrain panning to the atmospheric analysis zone. */
  setAnalysisBounds(center: [number, number], radiusKm = ATMOSPHERIC_RADIUS_KM): void {
    const circle = turf.circle(center, radiusKm, {
      steps: 64,
      units: 'kilometers',
    })
    const bbox = turf.bbox(circle)
    this.map.setMaxBounds([
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ])
  }

  destroy(): void {
    if (this.map.getLayer(RADAR_LAYER_ID)) {
      this.map.removeLayer(RADAR_LAYER_ID)
    }
    if (this.map.getSource(RADAR_SOURCE_ID)) {
      this.map.removeSource(RADAR_SOURCE_ID)
    }
    this.attached = false
  }
}
