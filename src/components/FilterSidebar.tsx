import { EVENT_CATEGORIES, type EventCategory } from '@/types/geopolitics'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/categories'
import { useUiStore } from '@/store/ui'
import { cn } from '@/lib/utils'

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
          const color = CATEGORY_COLORS[category as EventCategory]
          return (
            <li key={category}>
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition',
                  active
                    ? 'border-line bg-panel-elevated text-fog'
                    : 'border-transparent text-muted hover:border-line hover:bg-panel-elevated',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: active ? color : 'var(--color-line)',
                      boxShadow: active ? `0 0 10px ${color}` : undefined,
                    }}
                  />
                  {CATEGORY_LABELS[category]}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
