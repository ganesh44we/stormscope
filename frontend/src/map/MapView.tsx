import { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css'

import './map.css'
import { useGeolocation } from '../hooks/useGeolocation'
import { useRadarEngine } from '../hooks/useRadarEngine'
import { RadarHud } from '../overlays/RadarHud'
import { RadarLegend } from '../overlays/RadarLegend'
import { ATMOSPHERIC_RADIUS_KM } from '../types/geolocation'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

  const [radiusLayersReady, setRadiusLayersReady] = useState(false)
  const [radarTimestamp, setRadarTimestamp] = useState<number | null>(null)
  const [radarFrameIndex, setRadarFrameIndex] = useState(0)
  const [radarFrameCount, setRadarFrameCount] = useState(0)
  const [radarLoading, setRadarLoading] = useState(false)

  const location = useGeolocation()
  const center: [number, number] | null = location
    ? [location.longitude, location.latitude]
    : null

  const handleRadarTimestamp = useCallback(
    (timestamp: number, frameIndex: number, frameCount: number) => {
      setRadarLoading(false)
      setRadarTimestamp(timestamp)
      setRadarFrameIndex(frameIndex)
      setRadarFrameCount(frameCount)
    },
    [],
  )

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [78.4867, 17.385],
      zoom: 6,
      projection: 'globe',
    })

    map.addControl(new mapboxgl.NavigationControl())
    mapRef.current = map
    setMapInstance(map)

    return () => {
      setRadiusLayersReady(false)
      setMapInstance(null)
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!location || !mapRef.current) return

    const map = mapRef.current
    setRadiusLayersReady(false)
    setRadarLoading(true)

    const centerLngLat: [number, number] = [
      location.longitude,
      location.latitude,
    ]

    const applyLocationLayers = () => {
      map.flyTo({
        center: centerLngLat,
        zoom: 7,
        speed: 1.2,
      })

      markerRef.current?.remove()
      markerRef.current = new mapboxgl.Marker({
        color: '#00d4ff',
      })
        .setLngLat(centerLngLat)
        .addTo(map)

      const circle = turf.circle(centerLngLat, ATMOSPHERIC_RADIUS_KM, {
        steps: 128,
        units: 'kilometers',
      })

      const existing = map.getSource('radius-circle')
      if (existing && 'setData' in existing) {
        existing.setData(circle)
      } else {
        map.addSource('radius-circle', {
          type: 'geojson',
          data: circle,
        })

        map.addLayer({
          id: 'radius-fill',
          type: 'fill',
          source: 'radius-circle',
          paint: {
            'fill-color': '#00d4ff',
            'fill-opacity': 0.08,
          },
        })

        map.addLayer({
          id: 'radius-outline',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#00d4ff',
            'line-width': 2,
          },
        })
      }

      setRadiusLayersReady(true)
    }

    if (map.isStyleLoaded()) {
      applyLocationLayers()
    } else {
      map.once('load', applyLocationLayers)
    }
  }, [location])

  useRadarEngine(mapInstance, center, radiusLayersReady, handleRadarTimestamp)

  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return (
      <div className="map-setup">
        <p>
          Missing Mapbox token. Add <code>VITE_MAPBOX_TOKEN</code> to{' '}
          <code>frontend/.env</code> (see <code>.env.example</code>).
        </p>
      </div>
    )
  }

  return (
    <div className="map-viewport">
      <div ref={mapContainer} className="map-container" />
      <RadarHud
        timestamp={radarTimestamp}
        frameIndex={radarFrameIndex}
        frameCount={radarFrameCount}
        loading={radarLoading && radiusLayersReady}
      />
      <RadarLegend />
    </div>
  )
}
