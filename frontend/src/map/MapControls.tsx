import { ScaleControl } from 'react-leaflet'

/** Leaflet scale bar for operational map context. */
export function MapControls() {
  return <ScaleControl position="bottomleft" imperial={false} />
}
