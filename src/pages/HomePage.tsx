import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FilterSidebar } from '@/components/FilterSidebar'
import { EventTicker } from '@/components/EventTicker'
import { GlobeMap } from '@/components/GlobeMap'
import { DEMO_EVENTS, DEMO_STATS } from '@/data/demo'
import { useStats, useTrendingEvents } from '@/hooks/useGeoPulse'
import { useUiStore } from '@/store/ui'

export function HomePage() {
  const trending = useTrendingEvents()
  const stats = useStats()
  const selectCountry = useUiStore((s) => s.selectCountry)

  const events = trending.data?.length ? trending.data : DEMO_EVENTS
  const board = stats.data ?? DEMO_STATS

  const pulseCountries = useMemo(
    () => board.hottest_countries.slice(0, 4),
    [board.hottest_countries],
  )

  return (
    <>
      <FilterSidebar />
      <section className="relative min-h-0 flex-1 overflow-hidden">
        <GlobeMap
          events={events}
          onSelectCountry={(hint) => {
            if (!hint) return
            selectCountry(hint)
          }}
        />

        <div className="pointer-events-none absolute left-6 top-6 z-10 max-w-md">
          <div className="pointer-events-auto rounded-xl border border-line/80 bg-panel/75 p-5 shadow-2xl backdrop-blur-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Live theater
            </p>
            <h2 className="mt-2 font-display text-4xl leading-none text-fog">
              The world, pulsing in real time.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {board.events_last_24h.toLocaleString()} events in the last 24 hours across{' '}
              {board.total_countries} countries.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {pulseCountries.map((country) => (
                <li key={country.country_id}>
                  <Link
                    to={`/country/${encodeURIComponent(country.name)}`}
                    className="block rounded-md border border-line bg-ink/40 px-3 py-2 text-sm hover:border-signal/40"
                  >
                    <span className="text-fog">{country.name}</span>
                    <span className="mt-1 block font-mono text-xs text-alert">
                      {country.count} events
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <EventTicker events={events} />
      </section>
    </>
  )
}
