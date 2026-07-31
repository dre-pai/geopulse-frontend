import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FilterSidebar } from '@/components/FilterSidebar'
import { EventTicker } from '@/components/EventTicker'
import { GlobeMap } from '@/components/GlobeMap'
import { DEMO_EVENTS, DEMO_STATS } from '@/data/demo'
import { useEvents, useStats, useTrendingEvents } from '@/hooks/useGeoPulse'
import { useUiStore } from '@/store/ui'

const EMPTY_STATS = {
  total_events: 0,
  total_countries: 0,
  events_last_24h: 0,
  top_categories: [],
  hottest_countries: [],
}

export function HomePage() {
  const trending = useTrendingEvents()
  const mapEvents = useEvents({ limit: 400, hours: 24 })
  const stats = useStats()
  const selectCountry = useUiStore((s) => s.selectCountry)

  const apiOffline = Boolean(mapEvents.isError || stats.isError)
  const loading = mapEvents.isLoading || stats.isLoading
  const liveEvents = mapEvents.data?.length
    ? mapEvents.data
    : trending.data?.length
      ? trending.data
      : apiOffline
        ? DEMO_EVENTS
        : []
  const tickerEvents = trending.data?.length ? trending.data : liveEvents
  const events = liveEvents
  const board = stats.data ?? (apiOffline ? DEMO_STATS : EMPTY_STATS)
  const ingesting = !apiOffline && !loading && board.total_events === 0

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
              {loading
                ? 'Loading live signals…'
                : ingesting
                  ? 'Pulling the latest GDELT signals… the live map will fill in shortly.'
                  : `${board.events_last_24h.toLocaleString()} events in the last 24 hours across ${board.total_countries} countries.`}
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {pulseCountries.map((country) => (
                <li key={country.country_id}>
                  <Link
                    to={`/country/${country.country_id}`}
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

        <EventTicker events={tickerEvents} />
      </section>
    </>
  )
}
