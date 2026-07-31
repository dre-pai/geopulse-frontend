import type {
  Country,
  CountryDetail,
  GeoEvent,
  RelationshipGraph,
  RiskScore,
  SearchResult,
  Stats,
  SummaryOut,
  TimelinePoint,
} from '@/types/geopolitics'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  countries: (params?: { q?: string; region?: string }) => {
    const search = new URLSearchParams()
    if (params?.q) search.set('q', params.q)
    if (params?.region) search.set('region', params.region)
    const qs = search.toString()
    return request<Country[]>(`/countries${qs ? `?${qs}` : ''}`)
  },
  country: (ref: string) => request<CountryDetail>(`/countries/${ref}`),
  events: (params?: {
    country?: string
    category?: string
    q?: string
    limit?: number
    hours?: number
  }) => {
    const search = new URLSearchParams()
    if (params?.country) search.set('country', params.country)
    if (params?.category) search.set('category', params.category)
    if (params?.q) search.set('q', params.q)
    if (params?.limit) search.set('limit', String(params.limit))
    if (params?.hours) search.set('hours', String(params.hours))
    const qs = search.toString()
    return request<GeoEvent[]>(`/events${qs ? `?${qs}` : ''}`)
  },
  trending: () => request<GeoEvent[]>('/events/trending'),
  risk: () => request<RiskScore[]>('/risk'),
  timeline: (params?: { country?: string; days?: number }) => {
    const search = new URLSearchParams()
    if (params?.country) search.set('country', params.country)
    if (params?.days) search.set('days', String(params.days))
    const qs = search.toString()
    return request<TimelinePoint[]>(`/timeline${qs ? `?${qs}` : ''}`)
  },
  stats: () => request<Stats>('/stats'),
  search: (q: string) => request<SearchResult>(`/search?q=${encodeURIComponent(q)}`),
  relationships: (ref: string) => request<RelationshipGraph>(`/relationships/${ref}`),
  summarize: (body: { country_id?: number; iso2?: string; days?: number }) =>
    request<SummaryOut>('/summarize', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
