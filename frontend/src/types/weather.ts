import type { RadarFrame, RadarTimeline } from '../services/radar/radarTypes'

export type PrecipitationLevel = 'none' | 'light' | 'moderate' | 'heavy' | 'extreme'
export type StormActivity = 'calm' | 'active' | 'severe'
export type WeatherRuntimeStatus = 'idle' | 'loading' | 'live' | 'error'

export interface RadarAtmosphericState {
  timeline: RadarTimeline | null
  activeFrame: RadarFrame | null
  frameIndex: number
  frameCount: number
  activeTimestamp: number | null
  latestTimestamp: number | null
  precipitationLevel: PrecipitationLevel
  cloudDensity: number
  stormActivity: StormActivity
  lastRefreshAt: number | null
  nextRefreshAt: number | null
}

export interface AtmosphericState {
  status: WeatherRuntimeStatus
  radar: RadarAtmosphericState
  overlays: {
    radarVisible: boolean
  }
  error: string | null
}

export const INITIAL_ATMOSPHERIC_STATE: AtmosphericState = {
  status: 'idle',
  radar: {
    timeline: null,
    activeFrame: null,
    frameIndex: 0,
    frameCount: 0,
    activeTimestamp: null,
    latestTimestamp: null,
    precipitationLevel: 'none',
    cloudDensity: 0,
    stormActivity: 'calm',
    lastRefreshAt: null,
    nextRefreshAt: null,
  },
  overlays: {
    radarVisible: true,
  },
  error: null,
}
