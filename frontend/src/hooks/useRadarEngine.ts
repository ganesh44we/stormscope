import { useEffect, useRef } from 'react'
import type { RadarTimestampCallback } from '../radar/RadarEngine'
import { RadarEngine } from '../radar/RadarEngine'

/**
 * Attaches the radar overlay engine when map + location + radius layers are ready.
 */
export function useRadarEngine(
  map: mapboxgl.Map | null,
  center: [number, number] | null,
  radiusLayersReady: boolean,
  onTimestamp: RadarTimestampCallback,
): void {
  const engineRef = useRef<RadarEngine | null>(null)
  const onTimestampRef = useRef(onTimestamp)
  onTimestampRef.current = onTimestamp

  useEffect(() => {
    if (!map || !center || !radiusLayersReady) return

    const engine = new RadarEngine(map)
    engineRef.current = engine

    const start = () => {
      void engine.start(center, (...args) => onTimestampRef.current(...args))
    }

    if (map.isStyleLoaded() && map.getLayer('radius-outline')) {
      start()
    } else {
      const onReady = () => {
        if (map.getLayer('radius-outline')) {
          start()
        } else {
          map.once('idle', onReady)
        }
      }
      if (map.isStyleLoaded()) {
        onReady()
      } else {
        map.once('load', onReady)
      }
    }

    return () => {
      engine.stop()
      engineRef.current = null
    }
  }, [map, center?.[0], center?.[1], radiusLayersReady])
}
