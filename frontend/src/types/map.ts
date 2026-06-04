/** Geographic coordinate as [longitude, latitude] (GeoJSON / Turf order). */
export type LngLat = [number, number]

/** Convert [lng, lat] to Leaflet [lat, lng]. */
export function toLeafletLatLng([lng, lat]: LngLat): [number, number] {
  return [lat, lng]
}
