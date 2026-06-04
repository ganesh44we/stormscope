import L from 'leaflet'

/** Cyan dot marker for live user position. */
export const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})
