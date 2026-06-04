import { useEffect, useState } from 'react'

interface LocationState {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
      },
    )
  }, [])

  return location
}
