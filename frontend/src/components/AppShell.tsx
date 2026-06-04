import type { ReactNode } from 'react'
import './AppShell.css'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__brand">Stormscope</span>
        <span className="app-shell__phase">Phase 1 — Map foundation</span>
      </header>
      <main className="app-shell__main">{children}</main>
    </div>
  )
}
