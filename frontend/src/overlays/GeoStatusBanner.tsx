import type { GeolocationStatus } from '../hooks/useGeolocation'
import './GeoStatusBanner.css'

type GeoStatusBannerProps = {
  status: GeolocationStatus
  error: string | null
  usingFallback: boolean
}

export function GeoStatusBanner({ status, error, usingFallback }: GeoStatusBannerProps) {
  if (status === 'ready' && !usingFallback) return null

  if (status === 'pending') {
    return (
      <div className="geo-banner geo-banner--pending" role="status">
        Acquiring your location…
      </div>
    )
  }

  return (
    <div className="geo-banner geo-banner--warn" role="alert">
      {error ?? 'Using default map center.'}
      {usingFallback && ' Showing 200km analysis zone at fallback coordinates.'}
    </div>
  )
}
