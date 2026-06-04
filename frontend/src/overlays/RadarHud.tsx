import './RadarHud.css'

type RadarHudProps = {
  timestamp: number | null
  frameIndex: number
  frameCount: number
  loading?: boolean
  error?: string | null
  attribution?: string
}

function formatRadarTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RadarHud({
  timestamp,
  frameIndex,
  frameCount,
  loading,
  error,
  attribution,
}: RadarHudProps) {
  return (
    <div className="radar-hud" aria-live="polite">
      <span className="radar-hud__label">Live radar</span>
      {loading && <span className="radar-hud__meta">Syncing atmospheric frames…</span>}
      {error && <span className="radar-hud__error">{error}</span>}
      {!loading && !error && timestamp !== null && (
        <>
          <time className="radar-hud__time" dateTime={new Date(timestamp * 1000).toISOString()}>
            {formatRadarTime(timestamp)}
          </time>
          <span className="radar-hud__meta">
            Frame {frameIndex + 1} / {frameCount}
          </span>
        </>
      )}
      {attribution && <span className="radar-hud__credit">{attribution}</span>}
    </div>
  )
}
