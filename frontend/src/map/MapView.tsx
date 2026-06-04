import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './map.css'

const token = import.meta.env.VITE_MAPBOX_TOKEN
if (token) {
  mapboxgl.accessToken = token
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !token) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [78.4867, 17.385],
      zoom: 7,
      projection: 'globe',
    })

    map.addControl(new mapboxgl.NavigationControl())

    return () => map.remove()
  }, [])

  if (!token) {
    return (
      <div className="map-setup">
        <p>
          Missing Mapbox token. Add <code>VITE_MAPBOX_TOKEN</code> to{' '}
          <code>frontend/.env</code> (see <code>.env.example</code>).
        </p>
      </div>
    )
  }

  return <div ref={mapContainer} className="map-container" />
}
