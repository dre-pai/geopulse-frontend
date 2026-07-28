/** Demo fixtures so the UI is usable before the API/ingestion pipeline is running. */

import type { CountryDetail, GeoEvent, Stats, TimelinePoint } from '@/types/geopolitics'

export const DEMO_STATS: Stats = {
  total_events: 18422,
  total_countries: 195,
  events_last_24h: 1264,
  top_categories: [
    { category: 'diplomacy', count: 312 },
    { category: 'military', count: 287 },
    { category: 'economics', count: 241 },
    { category: 'sanctions', count: 118 },
  ],
  hottest_countries: [
    { country_id: 1, name: 'Ukraine', count: 94 },
    { country_id: 2, name: 'China', count: 71 },
    { country_id: 3, name: 'Iran', count: 63 },
    { country_id: 4, name: 'United States', count: 58 },
  ],
}

export const DEMO_EVENTS: GeoEvent[] = [
  {
    id: 1,
    external_id: 'demo:1',
    source: 'demo',
    title: 'Ukraine — Military Activity',
    category: 'military',
    occurred_at: new Date(Date.now() - 5 * 60_000).toISOString(),
    latitude: 50.45,
    longitude: 30.52,
    location_name: 'Kyiv',
    sentiment: -0.42,
    country_id: 1,
  },
  {
    id: 2,
    external_id: 'demo:2',
    source: 'demo',
    title: 'China — Trade Agreement',
    category: 'economics',
    occurred_at: new Date(Date.now() - 14 * 60_000).toISOString(),
    latitude: 39.9,
    longitude: 116.4,
    location_name: 'Beijing',
    sentiment: 0.28,
    country_id: 2,
  },
  {
    id: 3,
    external_id: 'demo:3',
    source: 'demo',
    title: 'Iran — Sanctions',
    category: 'sanctions',
    occurred_at: new Date(Date.now() - 22 * 60_000).toISOString(),
    latitude: 35.68,
    longitude: 51.38,
    location_name: 'Tehran',
    sentiment: -0.55,
    country_id: 3,
  },
  {
    id: 4,
    external_id: 'demo:4',
    source: 'demo',
    title: 'Germany — EU Defense Coordination',
    category: 'diplomacy',
    occurred_at: new Date(Date.now() - 41 * 60_000).toISOString(),
    latitude: 52.52,
    longitude: 13.4,
    location_name: 'Berlin',
    sentiment: 0.12,
    country_id: 5,
  },
]

export const DEMO_COUNTRY: CountryDetail = {
  id: 5,
  iso2: 'DE',
  iso3: 'DEU',
  name: 'Germany',
  capital: 'Berlin',
  region: 'Europe',
  subregion: 'Western Europe',
  latitude: 51.16,
  longitude: 10.45,
  population: 83240000,
  events_today: 12,
  risk_score: 28,
  risk_level: 'MODERATE',
  borders: ['FRA', 'POL', 'AUT', 'CHE', 'NLD', 'BEL', 'DNK', 'CZE'],
}

export const DEMO_TIMELINE: TimelinePoint[] = [
  {
    date: '2026-07-03T12:00:00Z',
    category: 'elections',
    title: 'Regional election monitoring',
    event_id: 101,
  },
  {
    date: '2026-07-08T12:00:00Z',
    category: 'sanctions',
    title: 'Sanctions alignment talks',
    event_id: 102,
  },
  {
    date: '2026-07-15T12:00:00Z',
    category: 'diplomacy',
    title: 'Diplomatic visit',
    event_id: 103,
  },
  {
    date: '2026-07-22T12:00:00Z',
    category: 'military',
    title: 'Military exercise',
    event_id: 104,
  },
]
