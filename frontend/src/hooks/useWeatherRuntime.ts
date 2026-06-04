import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import {
  INITIAL_ATMOSPHERIC_STATE,
  type AtmosphericState,
} from '../types/weather'
import type { LngLat } from '../types/map'
import { WeatherEngine } from '../weather/WeatherEngine'

/**
 * Thin React bridge — starts/stops WeatherEngine and mirrors state for UI.
 */
export function useWeatherRuntime(
  map: LeafletMap | null,
  center: LngLat | null,
  radiusLayersReady: boolean,
): AtmosphericState {
  const [snapshot, setSnapshot] = useState<AtmosphericState>(INITIAL_ATMOSPHERIC_STATE)
  const engineRef = useRef<WeatherEngine | null>(null)

  useEffect(() => {
    if (!map || !center || !radiusLayersReady) return

    let cleanup: (() => void) | undefined

    const start = () => {
      const engine = new WeatherEngine({ map, center })
      engineRef.current = engine
      const unsubState = engine.state.subscribe(setSnapshot)
      void engine.start()
      cleanup = () => {
        unsubState()
        engine.stop()
        engineRef.current = null
      }
    }

    map.whenReady(start)

    return () => {
      cleanup?.()
      setSnapshot(INITIAL_ATMOSPHERIC_STATE)
    }
  }, [map, center?.[0], center?.[1], radiusLayersReady])

  return snapshot
}
