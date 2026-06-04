import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { createMapOptions, getMapboxToken } from './mapConfig'
import './MapView.css'

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const token = getMapboxToken()

  useEffect(() => {
    if (!token) {
      setMapError(
        'Missing Mapbox token. Add GitHub Actions secret VITE_MAPBOX_ACCESS_TOKEN (public pk. token), then re-run the deploy workflow.',
      )
      return
    }

    const container = containerRef.current
    if (!container || mapRef.current) return

    mapboxgl.accessToken = token

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map(createMapOptions(container))
    } catch (err) {
      setMapError(
        err instanceof Error ? err.message : 'Failed to initialize Mapbox GL.',
      )
      return
    }

    mapRef.current = map
    setMapError(null)

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right',
    )
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left')

    map.on('load', () => {
      map.resize()
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [token])

  return (
    <div className="map-view" data-testid="map-view">
      <div ref={containerRef} className="map-view__canvas" role="application" aria-label="Stormscope weather map" />
      {mapError && (
        <div className="map-view__banner" role="alert">
          <p>{mapError}</p>
          <p>
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create a Mapbox access token
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
