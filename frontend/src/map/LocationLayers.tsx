import { useEffect, useRef } from 'react'
import { Circle, Marker, useMap } from 'react-leaflet'
import type { LngLat } from '../types/map'
import { toLeafletLatLng } from '../types/map'
import { ATMOSPHERIC_RADIUS_KM } from '../types/geolocation'
import { USER_LOCATION_ZOOM } from './mapConstants'
import { userLocationIcon } from './userMarker'

type LocationLayersProps = {
  center: LngLat
  onRadiusReady: () => void
}

/**
 * User marker + 200km atmospheric analysis circle.
 */
export function LocationLayers({ center, onRadiusReady }: LocationLayersProps) {
  const map = useMap()
  const position = toLeafletLatLng(center)
  const radiusMeters = ATMOSPHERIC_RADIUS_KM * 1000
  const readyReported = useRef(false)

  useEffect(() => {
    readyReported.current = false
  }, [center[0], center[1]])

  useEffect(() => {
    map.flyTo(position, USER_LOCATION_ZOOM, { duration: 1.2 })

    const reportReady = () => {
      if (readyReported.current) return
      readyReported.current = true
      onRadiusReady()
    }

    map.once('moveend', reportReady)
    return () => {
      map.off('moveend', reportReady)
    }
  }, [map, center[0], center[1], onRadiusReady, position[0], position[1]])

  return (
    <>
      <Circle
        center={position}
        radius={radiusMeters}
        pathOptions={{
          color: '#00d4ff',
          fillColor: '#00d4ff',
          fillOpacity: 0.08,
          weight: 2,
        }}
      />
      <Marker position={position} icon={userLocationIcon} zIndexOffset={1000} />
    </>
  )
}
