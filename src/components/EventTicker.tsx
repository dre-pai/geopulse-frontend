import { motion } from 'framer-motion'
import type { GeoEvent } from '@/types/geopolitics'
import { formatRelative } from '@/lib/utils'

interface EventTickerProps {
  events: GeoEvent[]
}

export function EventTicker({ events }: EventTickerProps) {
  const items = events.length ? events : []

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-line/70 bg-ink/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-2">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-alert">
          Live feed
        </span>
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex w-max gap-8"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {[...items, ...items].map((event, index) => (
              <div key={`${event.id}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                <span className="font-medium text-fog">{event.location_name ?? event.title.split('—')[0]}</span>
                <span className="text-muted">{event.category}</span>
                <span className="font-mono text-xs text-signal">{formatRelative(event.occurred_at)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
