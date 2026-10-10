import { Link } from 'react-router-dom'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

type Tone = 'brand' | 'ink' | 'outline' | 'ghost'
const TONES: Record<Tone, string> = {
  brand: 'bg-brand text-white hover:bg-ink',
  ink: 'bg-ink text-white hover:bg-brand',
  outline: 'border border-field text-ink hover:border-ink hover:bg-bg',
  ghost: 'text-ink hover:bg-bg',
}
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ' +
  'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55'

export function Button({
  children, tone = 'brand', full, ...rest
}: { children: ReactNode; tone?: Tone; full?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} className={`${BASE} ${TONES[tone]} ${full ? 'w-full' : ''}`}>{children}</button>
}

export function ButtonLink({
  to, children, tone = 'brand', full,
}: { to: string; children: ReactNode; tone?: Tone; full?: boolean }) {
  return <Link to={to} className={`${BASE} ${TONES[tone]} ${full ? 'w-full' : ''}`}>{children}</Link>
}

type BadgeTone = 'brand' | 'pos' | 'neg' | 'warn' | 'neutral'
const BADGE: Record<BadgeTone, string> = {
  brand: 'bg-brand-soft text-brand',
  pos: 'bg-pos-soft text-pos',
  neg: 'bg-neg-soft text-neg',
  warn: 'bg-warn-soft text-warn',
  neutral: 'bg-bg text-muted',
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${BADGE[tone]}`}>
      {children}
    </span>
  )
}

/** A signed change. Green up is not automatically good, so the caller decides. */
export function Delta({ value, good }: { value: number; good?: boolean }) {
  const up = value >= 0
  const positive = good === undefined ? up : good
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={`fig inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-pos' : 'text-neg'}`}>
      <Icon className="size-3.5" aria-hidden="true" />
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export function Stat({
  label, value, delta, good, note,
}: { label: string; value: string; delta?: number; good?: boolean; note?: string }) {
  return (
    <div className="card p-4 md:p-5">
      <p className="label">{label}</p>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <p className="fig text-2xl font-bold text-ink md:text-[1.75rem]">{value}</p>
        {delta !== undefined && <Delta value={delta} good={good} />}
      </div>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </div>
  )
}

export function SectionHead({
  title, sub, right, id,
}: { title: string; sub?: string; right?: ReactNode; id?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="h2">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  )
}
