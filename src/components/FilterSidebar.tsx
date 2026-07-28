import { EVENT_CATEGORIES, type EventCategory } from '@/types/geopolitics'
import { useUiStore } from '@/store/ui'
import { cn } from '@/lib/utils'

const LABELS: Record<EventCategory, string> = {
  military: 'Military',
  economics: 'Economics',
  diplomacy: 'Diplomacy',
  sanctions: 'Sanctions',
  elections: 'Elections',
  environment: 'Environment',
  terrorism: 'Terrorism',
  other: 'Other',
}

export function FilterSidebar() {
  const activeCategories = useUiStore((s) => s.activeCategories)
  const toggleCategory = useUiStore((s) => s.toggleCategory)

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-6 border-r border-line/80 bg-panel/70 p-5 backdrop-blur-md">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Filters</p>
        <h2 className="mt-2 font-display text-2xl text-fog">Signal layers</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {EVENT_CATEGORIES.map((category) => {
          const active = activeCategories.includes(category)
          return (
            <li key={category}>
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition',
                  active
                    ? 'border-signal/40 bg-signal/10 text-fog'
                    : 'border-transparent text-muted hover:border-line hover:bg-panel-elevated',
                )}
              >
                <span>{LABELS[category]}</span>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    active ? 'bg-signal shadow-[0_0_10px_rgba(61,214,198,0.8)]' : 'bg-line',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
