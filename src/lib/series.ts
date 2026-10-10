/**
 * The daily chart must add up to the campaign totals exactly, or the dashboard
 * is telling a different story from the table underneath it. Orders and spend
 * are distributed across the period deterministically and the remainder is
 * handed back to the last day, so the sums reconcile to the penny.
 */

import { campaigns, bySlug, PERIOD } from './catalogue'

export const DAYS = 31
export { PERIOD }

/** Small deterministic generator, so the chart is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function spread(total: number, seed: number, shape: (t: number) => number): number[] {
  const r = rng(seed)
  const weights = Array.from({ length: DAYS }, (_, i) => {
    const t = i / (DAYS - 1)
    return Math.max(0.05, shape(t) * (0.75 + r() * 0.5))
  })
  const sum = weights.reduce((a, w) => a + w, 0)
  const exact = weights.map(w => (w / sum) * total)
  const out = exact.map(Math.floor)
  // Largest remainder. Dumping the whole rounding shortfall on one day would
  // reconcile the total and still draw a spike that never happened.
  let short = total - out.reduce((a, v) => a + v, 0)
  const order = exact
    .map((v, i) => ({ i, rem: v - Math.floor(v) }))
    .sort((a, b) => b.rem - a.rem)
  for (let k = 0; short > 0; k++, short--) out[order[k % order.length].i] += 1
  return out
}

export type Day = { day: number; orders: number; spendP: number; revenueP: number }

/** A gentle ramp with a mid-month dip, which is what a scaling account looks like. */
const SHAPE = (t: number) => 0.6 + t * 0.9 - 0.35 * Math.exp(-(((t - 0.5) / 0.12) ** 2))

export const daily: Day[] = (() => {
  const rows: Day[] = Array.from({ length: DAYS }, (_, i) => ({ day: i + 1, orders: 0, spendP: 0, revenueP: 0 }))
  campaigns.forEach((c, idx) => {
    const price = bySlug(c.productSlug)!.priceP
    const o = spread(c.orders, 1000 + idx * 37, SHAPE)
    const s = spread(c.spendP, 2000 + idx * 53, SHAPE)
    for (let i = 0; i < DAYS; i++) {
      rows[i].orders += o[i]
      rows[i].spendP += s[i]
      rows[i].revenueP += o[i] * price
    }
  })
  return rows
})()

export const totals = daily.reduce(
  (a, d) => ({ orders: a.orders + d.orders, spendP: a.spendP + d.spendP, revenueP: a.revenueP + d.revenueP }),
  { orders: 0, spendP: 0, revenueP: 0 },
)
