import { motion } from 'framer-motion'
import type { TimelinePoint } from '@/types/geopolitics'
import { format } from 'date-fns'

interface EventTimelineProps {
  points: TimelinePoint[]
}

export function EventTimeline({ points }: EventTimelineProps) {
  return (
    <ol className="relative space-y-0 border-l border-line pl-6">
      {points.map((point, index) => (
        <motion.li
          key={point.event_id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative pb-8"
        >
          <span className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full border border-ink bg-signal shadow-[0_0_12px_rgba(61,214,198,0.7)]" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {format(new Date(point.date), 'MMM d')}
          </p>
          <p className="mt-1 text-sm capitalize text-alert">{point.category}</p>
          <p className="mt-1 text-fog">{point.title}</p>
        </motion.li>
      ))}
    </ol>
  )
}
