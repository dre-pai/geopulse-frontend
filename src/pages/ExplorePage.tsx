import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEMO_EVENTS } from '@/data/demo'
import { useSearch } from '@/hooks/useGeoPulse'
import { formatRelative } from '@/lib/utils'

export function ExplorePage() {
  const [query, setQuery] = useState('South China Sea')
  const search = useSearch(query)
  const events = search.data?.events?.length ? search.data.events : DEMO_EVENTS

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-y-auto px-6 py-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Event explorer</p>
        <h2 className="mt-2 font-display text-4xl text-fog">Search the signal</h2>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Try "South China Sea"'
        className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-fog outline-none ring-signal/40 placeholder:text-muted focus:ring-2"
      />
      <ul className="divide-y divide-line rounded-lg border border-line bg-panel/70">
        {events.map((event) => (
          <li key={event.id} className="flex items-start justify-between gap-4 px-4 py-4">
            <div>
              <p className="text-fog">{event.title}</p>
              <p className="mt-1 text-sm capitalize text-muted">
                {event.category}
                {event.location_name ? ` · ${event.location_name}` : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-signal">{formatRelative(event.occurred_at)}</p>
              {event.country_id ? (
                <Link className="mt-2 block text-xs text-calm hover:underline" to={`/country/${event.country_id}`}>
                  Open country
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
