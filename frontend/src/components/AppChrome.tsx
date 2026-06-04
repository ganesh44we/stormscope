import './AppChrome.css'

export function AppChrome() {
  return (
    <header className="app-chrome">
      <div className="app-chrome__brand">
        <span className="app-chrome__logo" aria-hidden>
          ◉
        </span>
        <span className="app-chrome__title">StormScope</span>
      </div>
      <span className="app-chrome__tag">Atmospheric intelligence</span>
    </header>
  )
}
