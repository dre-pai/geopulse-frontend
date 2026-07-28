import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useUiStore } from '@/store/ui'

const SERIES = [
  { month: 'Mar', Ukraine: 82, Russia: 88, Poland: 41, Germany: 28 },
  { month: 'Apr', Ukraine: 85, Russia: 86, Poland: 44, Germany: 30 },
  { month: 'May', Ukraine: 79, Russia: 84, Poland: 39, Germany: 27 },
  { month: 'Jun', Ukraine: 91, Russia: 90, Poland: 46, Germany: 31 },
  { month: 'Jul', Ukraine: 94, Russia: 87, Poland: 48, Germany: 29 },
]

const PALETTE = ['#3dd6c6', '#f0a35a', '#6aa8ff', '#ef6b6b']

export function ComparePage() {
  const selection = useUiStore((s) => s.compareSelection)
  const toggleCompare = useUiStore((s) => s.toggleCompare)
  const options = ['Ukraine', 'Russia', 'Poland', 'Germany']

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-y-auto px-6 py-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Compare</p>
        <h2 className="mt-2 font-display text-4xl text-fog">Country trajectories</h2>
        <p className="mt-2 text-sm text-muted">
          Compare military event intensity across selected countries.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((name) => {
          const active = selection.includes(name) || selection.length === 0
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleCompare(name)}
              className={
                active
                  ? 'rounded-md border border-signal/40 bg-signal/10 px-3 py-1.5 text-sm text-signal'
                  : 'rounded-md border border-line px-3 py-1.5 text-sm text-muted'
              }
            >
              {name}
            </button>
          )
        })}
      </div>

      <div className="h-96 rounded-lg border border-line bg-panel/70 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SERIES}>
            <CartesianGrid stroke="#243247" />
            <XAxis dataKey="month" stroke="#8fa3bd" />
            <YAxis stroke="#8fa3bd" />
            <Tooltip
              contentStyle={{
                background: '#0d1520',
                border: '1px solid #243247',
                borderRadius: 8,
              }}
            />
            <Legend />
            {options.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={PALETTE[index % PALETTE.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
