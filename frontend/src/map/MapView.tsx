import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import './map.css'
import { AppChrome } from '../components/AppChrome'
import { useGeolocation } from '../hooks/useGeolocation'
import { useWeatherRuntime } from '../hooks/useWeatherRuntime'
import { AtmosphericStatus } from '../overlays/AtmosphericStatus'
import { GeoStatusBanner } from '../overlays/GeoStatusBanner'
import { RadarHud } from '../overlays/RadarHud'
import { RadarLegend } from '../overlays/RadarLegend'
import type { LngLat } from '../types/map'
import { toLeafletLatLng } from '../types/map'
import { LocationLayers } from './LocationLayers'
import { MapBridge } from './MapBridge'
import { MapControls } from './MapControls'
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  RAINVIEWER_ATTRIBUTION,
} from './mapConstants'

export default function MapView() {
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null)
  const [radiusLayersReady, setRadiusLayersReady] = useState(false)

  const { position, status: geoStatus, error: geoError } = useGeolocation()

  const usingFallback = geoStatus === 'denied' || geoStatus === 'unavailable'

  const center: LngLat | null = useMemo(() => {
    if (position) return [position.longitude, position.latitude]
    if (usingFallback) return DEFAULT_CENTER
    return null
  }, [position, usingFallback])

  const weather = useWeatherRuntime(mapInstance, center, radiusLayersReady)

  const handleMapReady = useCallback((map: LeafletMap) => {
    setMapInstance(map)
  }, [])

  const handleMapDestroy = useCallback(() => {
    setMapInstance(null)
    setRadiusLayersReady(false)
  }, [])

  const handleRadiusReady = useCallback(() => {
    setRadiusLayersReady(true)
  }, [])

  useEffect(() => {
    setRadiusLayersReady(false)
  }, [center?.[0], center?.[1]])

  const { radar, status, error } = weather
  const defaultCenter = toLeafletLatLng(DEFAULT_CENTER)
  const showAnalysisZone = center !== null

  return (
    <div className="map-viewport">
      <AppChrome />
      <GeoStatusBanner
        status={geoStatus}
        error={geoError}
        usingFallback={usingFallback}
      />
      <MapContainer
        className="map-container"
        center={defaultCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        zoomControl
        attributionControl
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <MapControls />
        <MapBridge onMapReady={handleMapReady} onMapDestroy={handleMapDestroy} />
        {showAnalysisZone && (
          <LocationLayers center={center} onRadiusReady={handleRadiusReady} />
        )}
      </MapContainer>
      <RadarHud
        timestamp={radar.activeTimestamp}
        frameIndex={radar.frameIndex}
        frameCount={radar.frameCount}
        loading={status === 'loading' || geoStatus === 'pending'}
        error={error}
        attribution={RAINVIEWER_ATTRIBUTION}
      />
      <AtmosphericStatus state={weather} />
      <RadarLegend />
    </div>
  )
}
