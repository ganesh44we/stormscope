import type { AtmosphericState } from '../types/weather'
import './AtmosphericStatus.css'

type AtmosphericStatusProps = {
  state: AtmosphericState
}

export function AtmosphericStatus({ state }: AtmosphericStatusProps) {
  if (state.status !== 'live') return null

  const { precipitationLevel, stormActivity } = state.radar

  return (
    <div className="atmospheric-status" aria-live="polite">
      <span className="atmospheric-status__chip" data-level={precipitationLevel}>
        Precipitation: {precipitationLevel}
      </span>
      <span className="atmospheric-status__chip" data-storm={stormActivity}>
        Storm: {stormActivity}
      </span>
    </div>
  )
}
