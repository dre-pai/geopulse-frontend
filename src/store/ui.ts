import { create } from 'zustand'
import type { EventCategory } from '@/types/geopolitics'

interface UiState {
  activeCategories: EventCategory[]
  selectedCountryIso2: string | null
  searchQuery: string
  compareSelection: string[]
  setCategories: (categories: EventCategory[]) => void
  toggleCategory: (category: EventCategory) => void
  selectCountry: (iso2: string | null) => void
  setSearchQuery: (query: string) => void
  toggleCompare: (iso2: string) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  activeCategories: [
    'military',
    'economics',
    'diplomacy',
    'sanctions',
    'elections',
    'environment',
    'terrorism',
    'other',
  ],
  selectedCountryIso2: null,
  searchQuery: '',
  compareSelection: [],
  setCategories: (categories) => set({ activeCategories: categories }),
  toggleCategory: (category) => {
    const current = get().activeCategories
    if (current.includes(category)) {
      set({ activeCategories: current.filter((c) => c !== category) })
    } else {
      set({ activeCategories: [...current, category] })
    }
  },
  selectCountry: (iso2) => set({ selectedCountryIso2: iso2 }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleCompare: (iso2) => {
    const current = get().compareSelection
    if (current.includes(iso2)) {
      set({ compareSelection: current.filter((c) => c !== iso2) })
      return
    }
    if (current.length >= 4) return
    set({ compareSelection: [...current, iso2] })
  },
}))
