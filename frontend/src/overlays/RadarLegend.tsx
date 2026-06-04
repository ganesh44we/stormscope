import './RadarLegend.css'

const INTENSITY_STOPS = [
  { label: 'Light', color: '#22c55e' },
  { label: 'Moderate', color: '#eab308' },
  { label: 'Heavy', color: '#ef4444' },
  { label: 'Extreme', color: '#a855f7' },
] as const

export function RadarLegend() {
  return (
    <div className="radar-legend" aria-label="Rain intensity legend">
      <span className="radar-legend__title">Precipitation</span>
      <ul className="radar-legend__list">
        {INTENSITY_STOPS.map((stop) => (
          <li key={stop.label}>
            <span className="radar-legend__swatch" style={{ background: stop.color }} />
            {stop.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
