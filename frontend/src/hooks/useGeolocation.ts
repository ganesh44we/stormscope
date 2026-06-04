import { useEffect, useState } from 'react'

export type GeolocationStatus = 'pending' | 'ready' | 'denied' | 'unavailable'

export interface GeoPosition {
  latitude: number
  longitude: number
}

export interface GeolocationResult {
  position: GeoPosition | null
  status: GeolocationStatus
  error: string | null
}

export function useGeolocation(): GeolocationResult {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [status, setStatus] = useState<GeolocationStatus>('pending')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable')
      setError('Geolocation is not supported in this browser.')
      return
    }

    const onSuccess = (position: GeolocationPosition) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      setStatus('ready')
      setError(null)
    }

    const onError = (err: GeolocationPositionError) => {
      const message =
        err.code === err.PERMISSION_DENIED
          ? 'Location permission denied. Enable it in browser settings to center on you.'
          : err.code === err.TIMEOUT
            ? 'Location request timed out.'
            : 'Unable to determine your location.'

      setError(message)
      setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable')
      console.error('Geolocation error:', err)
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15_000,
      maximumAge: 60_000,
    })
  }, [])

  return { position, status, error }
}
