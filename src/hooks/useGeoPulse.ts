import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useCountries(q?: string) {
  return useQuery({
    queryKey: ['countries', q ?? ''],
    queryFn: () => api.countries({ q }),
  })
}

export function useCountry(ref: string) {
  return useQuery({
    queryKey: ['country', ref],
    queryFn: () => api.country(ref),
    enabled: Boolean(ref),
  })
}

export function useEvents(params?: { country?: string; category?: string; q?: string }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => api.events(params),
  })
}

export function useTrendingEvents() {
  return useQuery({
    queryKey: ['events', 'trending'],
    queryFn: () => api.trending(),
    refetchInterval: 60_000,
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.stats(),
    refetchInterval: 60_000,
  })
}

export function useTimeline(country?: string) {
  return useQuery({
    queryKey: ['timeline', country ?? 'all'],
    queryFn: () => api.timeline({ country, days: 30 }),
  })
}

export function useRiskScores() {
  return useQuery({
    queryKey: ['risk'],
    queryFn: () => api.risk(),
  })
}

export function useRelationships(ref: string) {
  return useQuery({
    queryKey: ['relationships', ref],
    queryFn: () => api.relationships(ref),
    enabled: Boolean(ref),
  })
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ['search', q],
    queryFn: () => api.search(q),
    enabled: q.trim().length >= 2,
  })
}

export function useSummarize() {
  return useMutation({
    mutationFn: api.summarize,
  })
}
