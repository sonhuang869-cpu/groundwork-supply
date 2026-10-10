import { useId } from 'react'
import type { Day } from '../lib/series'
import { gbp0 } from '../lib/catalogue'

type Key = 'revenueP' | 'spendP'

/**
 * Revenue against ad spend, drawn directly so the two series share one scale.
 * Plotting them on separate axes is the usual way these charts flatter spend.
 */
export function RevenueChart({ data, className = '' }: { data: Day[]; className?: string }) {
  const id = useId()
  const W = 760, H = 240, PAD_L = 54, PAD_B = 26, PAD_T = 12, PAD_R = 34
  const peak = Math.max(...data.map(d => Math.max(d.revenueP, d.spendP)))
  // Round the top of the scale up to something a person would choose, so the
  // axis reads £1,500 rather than £1,427.
  const step = Math.pow(10, Math.floor(Math.log10(peak / 4)))
  const max = Math.ceil((peak * 1.1) / step) * step
  const x = (i: number) => PAD_L + (i / (data.length - 1)) * (W - PAD_L - PAD_R)
  const y = (v: number) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B)
  const path = (k: Key) => data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d[k]).toFixed(1)}`).join(' ')
  const area = `${path('revenueP')} L${x(data.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => max * t)

  const totalRev = data.reduce((a, d) => a + d.revenueP, 0)
  const totalSpend = data.reduce((a, d) => a + d.spendP, 0)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Daily revenue against ad spend over ${data.length} days. Revenue totals ${gbp0(totalRev)} and ad spend totals ${gbp0(totalSpend)}, both on the same scale.`}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B2FD9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#3B2FD9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map(t => (
        <g key={t}>
          <line x1={PAD_L} y1={y(t)} x2={W - PAD_R} y2={y(t)} stroke="#E6E8EE" strokeWidth="1" />
          <text x={PAD_L - 8} y={y(t) + 4} textAnchor="end" fill="#596273" fontSize="10" fontFamily="var(--font-mono)">
            {gbp0(t)}
          </text>
        </g>
      ))}

      <path d={area} fill={`url(#${id}-fill)`} />
      <path d={path('revenueP')} fill="none" stroke="#3B2FD9" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
      <path d={path('spendP')} fill="none" stroke="#8A5A2B" strokeWidth="2" strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round" />

      {[0, 7, 14, 21, 30].map(i => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fill="#596273" fontSize="10" fontFamily="var(--font-mono)">
          {i + 1} Oct
        </text>
      ))}
    </svg>
  )
}
