import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Globe' },
  { to: '/explore', label: 'Explorer' },
  { to: '/compare', label: 'Compare' },
]

export function AppShell() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="z-30 flex items-center justify-between border-b border-line/80 bg-ink/70 px-6 py-4 backdrop-blur-md">
        <div className="flex items-baseline gap-4">
          <h1 className="font-display text-3xl tracking-tight text-fog">GeoPulse</h1>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-muted sm:block">
            Geopolitical intelligence
          </p>
        </div>
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm transition',
                  isActive ? 'bg-panel-elevated text-signal' : 'text-muted hover:text-fog',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="relative flex min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
