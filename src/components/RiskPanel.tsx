import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn, riskTone } from '@/lib/utils'

interface RiskPanelProps {
  score?: number | null
  level?: string | null
  components?: {
    conflict: number
    economic: number
    diplomatic: number
    media: number
  }
}

export function RiskPanel({ score, level, components }: RiskPanelProps) {
  const data = [
    { name: 'Conflict', value: components?.conflict ?? 40 },
    { name: 'Economic', value: components?.economic ?? 25 },
    { name: 'Diplomatic', value: components?.diplomatic ?? 20 },
    { name: 'Media', value: components?.media ?? 15 },
  ]

  return (
    <div className="rounded-lg border border-line bg-panel/80 p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Country risk</p>
      <div className="mt-3 flex items-end gap-4">
        <span className="font-display text-6xl text-fog">{score ?? '—'}</span>
        <span className={cn('mb-2 font-mono text-sm tracking-widest', riskTone(level))}>
          {level ?? 'UNKNOWN'}
        </span>
      </div>
      <div className="mt-6 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#243247" vertical={false} />
            <XAxis dataKey="name" stroke="#8fa3bd" tickLine={false} axisLine={false} />
            <YAxis stroke="#8fa3bd" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#0d1520',
                border: '1px solid #243247',
                borderRadius: 8,
              }}
            />
            <Bar dataKey="value" fill="#3dd6c6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
