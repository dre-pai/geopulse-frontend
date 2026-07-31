import type { ExpressionSpecification } from 'maplibre-gl'
import type { EventCategory } from '@/types/geopolitics'

/** Shared palette for map markers, filters, and ticker chips.
 *  Hues are spaced so neighboring categories stay easy to tell apart on the dark map.
 */
export const CATEGORY_COLORS: Record<EventCategory, string> = {
  military: '#FF8C42',
  economics: '#2EC4B6',
  diplomacy: '#4C8BF5',
  sanctions: '#F7C948',
  elections: '#B794F6',
  environment: '#3DDC97',
  terrorism: '#F04343',
  other: '#94A3B8',
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  military: 'Military',
  economics: 'Economics',
  diplomacy: 'Diplomacy',
  sanctions: 'Sanctions',
  elections: 'Elections',
  environment: 'Environment',
  terrorism: 'Terrorism',
  other: 'Other',
}

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category as EventCategory] ?? CATEGORY_COLORS.other
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category as EventCategory] ?? category
}

/** MapLibre `match` expression for circle paint. */
export function categoryColorMatch(fallback = CATEGORY_COLORS.other): ExpressionSpecification {
  return [
    'match',
    ['get', 'category'],
    'military',
    CATEGORY_COLORS.military,
    'economics',
    CATEGORY_COLORS.economics,
    'diplomacy',
    CATEGORY_COLORS.diplomacy,
    'sanctions',
    CATEGORY_COLORS.sanctions,
    'elections',
    CATEGORY_COLORS.elections,
    'environment',
    CATEGORY_COLORS.environment,
    'terrorism',
    CATEGORY_COLORS.terrorism,
    'other',
    CATEGORY_COLORS.other,
    fallback,
  ]
}
