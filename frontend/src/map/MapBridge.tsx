import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'

type MapBridgeProps = {
  onMapReady: (map: LeafletMap) => void
  onMapDestroy?: () => void
}

/** Exposes the Leaflet map instance to non-React weather/radar engines. */
export function MapBridge({ onMapReady, onMapDestroy }: MapBridgeProps) {
  const map = useMap()
  const reported = useRef(false)

  useEffect(() => {
    if (!reported.current) {
      reported.current = true
      onMapReady(map)
    }
    return () => {
      reported.current = false
      onMapDestroy?.()
    }
  }, [map, onMapReady, onMapDestroy])

  return null
}
