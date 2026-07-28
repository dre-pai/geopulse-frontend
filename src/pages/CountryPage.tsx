import { useParams } from 'react-router-dom'
import { AllianceGraph } from '@/components/AllianceGraph'
import { EventTimeline } from '@/components/EventTimeline'
import { RiskPanel } from '@/components/RiskPanel'
import { DEMO_COUNTRY, DEMO_TIMELINE } from '@/data/demo'
import { useCountry, useRelationships, useSummarize, useTimeline } from '@/hooks/useGeoPulse'

export function CountryPage() {
  const { countryRef = 'DE' } = useParams()
  const countryQuery = useCountry(countryRef)
  const timelineQuery = useTimeline(countryRef)
  const relationshipsQuery = useRelationships(countryRef)
  const summarize = useSummarize()

  const country = countryQuery.data ?? DEMO_COUNTRY
  const timeline = timelineQuery.data?.length ? timelineQuery.data : DEMO_TIMELINE
  const graph = relationshipsQuery.data ?? {
    nodes: [
      { id: '1', label: country.name, iso2: country.iso2 },
      { id: '2', label: 'France', iso2: 'FR' },
      { id: '3', label: 'Poland', iso2: 'PL' },
      { id: '4', label: 'United States', iso2: 'US' },
    ],
    links: [
      { source: '1', target: '2', relationship_type: 'alliance', strength: 0.9 },
      { source: '1', target: '3', relationship_type: 'border', strength: 0.6 },
      { source: '1', target: '4', relationship_type: 'alliance', strength: 0.8 },
    ],
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 overflow-y-auto px-6 py-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Country dashboard
          </p>
          <h2 className="mt-2 font-display text-5xl text-fog">{country.name}</h2>
          <p className="mt-3 max-w-xl text-muted">
            Capital {country.capital ?? '—'} · Population{' '}
            {country.population?.toLocaleString() ?? '—'} · {country.events_today} events today
          </p>
          <button
            type="button"
            className="mt-6 rounded-md border border-signal/40 bg-signal/10 px-4 py-2 text-sm text-signal transition hover:bg-signal/20"
            onClick={() =>
              summarize.mutate({
                iso2: country.iso2,
                days: 30,
              })
            }
          >
            Summarize last 30 days
          </button>
          {summarize.data ? (
            <p className="mt-4 rounded-lg border border-line bg-panel/70 p-4 text-sm leading-relaxed text-fog">
              {summarize.data.summary}
            </p>
          ) : null}
        </div>
        <RiskPanel score={country.risk_score} level={country.risk_level} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel/70 p-5">
          <h3 className="font-display text-2xl text-fog">Timeline</h3>
          <div className="mt-5">
            <EventTimeline points={timeline} />
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-2xl text-fog">Relationship map</h3>
          <AllianceGraph graph={graph} />
        </div>
      </section>
    </div>
  )
}
