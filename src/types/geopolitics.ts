export type EventCategory =
  | 'military'
  | 'economics'
  | 'diplomacy'
  | 'sanctions'
  | 'elections'
  | 'environment'
  | 'terrorism'
  | 'other'

export interface Country {
  id: number
  iso2: string
  iso3: string
  name: string
  capital?: string | null
  region?: string | null
  subregion?: string | null
  latitude?: number | null
  longitude?: number | null
  population?: number | null
  flag_url?: string | null
  borders?: string[] | null
  currencies?: Record<string, unknown> | null
  languages?: Record<string, string> | null
}

export interface CountryDetail extends Country {
  risk_score?: number | null
  risk_level?: string | null
  events_today: number
}

export interface GeoEvent {
  id: number
  external_id: string
  source: string
  title: string
  summary?: string | null
  category: EventCategory | string
  event_type?: string | null
  actors?: string[] | null
  sentiment?: number | null
  goldstein_scale?: number | null
  latitude?: number | null
  longitude?: number | null
  location_name?: string | null
  source_url?: string | null
  occurred_at: string
  country_id?: number | null
}

export interface RiskScore {
  country_id: number
  score: number
  level: string
  conflict_component: number
  economic_component: number
  diplomatic_component: number
  media_sentiment_component: number
  details?: Record<string, unknown> | null
  computed_at: string
}

export interface TimelinePoint {
  date: string
  category: string
  title: string
  event_id: number
  sentiment?: number | null
}

export interface Stats {
  total_events: number
  total_countries: number
  events_last_24h: number
  top_categories: Array<{ category: string; count: number }>
  hottest_countries: Array<{ country_id: number; name: string; count: number }>
}

export interface RelationshipGraph {
  nodes: Array<{ id: string; label: string; iso2?: string | null }>
  links: Array<{
    source: string
    target: string
    relationship_type: string
    strength: number
  }>
}

export interface SummaryOut {
  country: string
  days: number
  summary: string
  event_count: number
  generated_at: string
  model?: string | null
}

export interface SearchResult {
  query: string
  total: number
  events: GeoEvent[]
  countries: Country[]
}

export const EVENT_CATEGORIES: EventCategory[] = [
  'military',
  'economics',
  'diplomacy',
  'sanctions',
  'elections',
  'environment',
  'terrorism',
]
