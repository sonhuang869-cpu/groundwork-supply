import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, SectionHead, Stat } from '../components/ui'
import { bySlug, campaigns, gbp, gbp0, pct, type Platform } from '../lib/catalogue'
import { modelOf, perfOf, profitPerOrderP, unitEconomics } from '../lib/economics'

const priceOf = (s: string) => bySlug(s)!.priceP

const PLATFORM: Record<Platform, { name: string; dot: string }> = {
  meta: { name: 'Meta', dot: '#3B2FD9' },
  tiktok: { name: 'TikTok', dot: '#0D1017' },
}

type Filter = 'all' | Platform
type SortKey = 'spendP' | 'roas' | 'cpaP' | 'orders' | 'profit'

export default function Campaigns() {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<SortKey>('spendP')

  const rows = useMemo(() => {
    return campaigns
      .filter(c => filter === 'all' || c.platform === filter)
      .map(c => {
        const p = bySlug(c.productSlug)!
        const perf = perfOf([c], priceOf)
        const u = unitEconomics(modelOf(p))
        const per = perf.orders ? profitPerOrderP(modelOf(p), perf.cpaP) : 0
        return { c, p, perf, u, per, profit: per * perf.orders - 0, below: perf.roas < u.breakEvenRoas }
      })
      .sort((a, b) => {
        if (sort === 'profit') return b.profit - a.profit
        if (sort === 'roas') return b.perf.roas - a.perf.roas
        if (sort === 'cpaP') return a.perf.cpaP - b.perf.cpaP
        if (sort === 'orders') return b.perf.orders - a.perf.orders
        return b.perf.spendP - a.perf.spendP
      })
  }, [filter, sort])

  const shown = useMemo(
    () => perfOf(campaigns.filter(c => filter === 'all' || c.platform === filter), priceOf),
    [filter],
  )
  const belowCount = rows.filter(r => r.below).length

  const SORTS: { k: SortKey; label: string }[] = [
    { k: 'spendP', label: 'Spend' }, { k: 'roas', label: 'ROAS' },
    { k: 'cpaP', label: 'CPA' }, { k: 'orders', label: 'Orders' }, { k: 'profit', label: 'Profit' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Campaigns</h1>
        <p className="mt-1 text-sm text-muted">
          Meta and TikTok in one table, each line judged against its own product's break-even, not one house target.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Spend" value={gbp0(shown.spendP)} note={`${rows.length} campaigns`} />
        <Stat label="Revenue" value={gbp0(shown.revenueP)} note={`${shown.orders} orders`} />
        <Stat label="Blended ROAS" value={`${shown.roas.toFixed(2)}x`} note={`CPA ${gbp(shown.cpaP)}`} />
        <Stat label="Below break-even" value={String(belowCount)} note={belowCount ? 'Losing money per order' : 'All lines clear their margin'} />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-5">
          <SectionHead title="All campaigns" sub="Revenue is orders times price, so it cannot disagree with the store." />
          <div className="flex flex-wrap gap-4">
            <fieldset>
              <legend className="label mb-1.5">Platform</legend>
              <div className="flex gap-1.5">
                {(['all', 'meta', 'tiktok'] as Filter[]).map(f => (
                  <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      filter === f ? 'border-brand bg-brand text-white' : 'border-field hover:border-ink'}`}>
                    {f === 'all' ? 'All' : PLATFORM[f].name}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="label mb-1.5">Sort by</legend>
              <div className="flex flex-wrap gap-1.5">
                {SORTS.map(s => (
                  <button key={s.k} type="button" onClick={() => setSort(s.k)} aria-pressed={sort === s.k}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      sort === s.k ? 'border-ink bg-ink text-white' : 'border-field hover:border-ink'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] text-sm">
            <thead>
              <tr className="border-b border-line bg-bg text-left">
                {['Campaign', 'State', 'Spend', 'Orders', 'CPA', 'Break-even CPA', 'ROAS', 'Profit / order', 'Profit'].map((h, i) => (
                  <th key={h} scope="col" className={`label px-4 py-2.5 font-semibold ${i > 1 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(r => (
                <tr key={r.c.id} className={r.below ? 'bg-neg-soft/40 hover:bg-neg-soft' : 'hover:bg-bg'}>
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="flex items-center gap-2.5">
                      <span className="size-2 shrink-0 rounded-full" style={{ background: PLATFORM[r.c.platform].dot }} aria-hidden="true" />
                      <span>
                        <Link to={`/console/products?p=${r.p.slug}`} className="font-semibold hover:text-brand">{r.c.name}</Link>
                        <span className="block text-xs text-muted">{PLATFORM[r.c.platform].name} · {r.p.name}</span>
                      </span>
                    </span>
                  </th>
                  <td className="px-4 py-3">
                    <Badge tone={r.c.state === 'active' ? 'pos' : r.c.state === 'learning' ? 'warn' : 'neutral'}>
                      {r.c.state}
                    </Badge>
                  </td>
                  <td className="fig px-4 py-3 text-right">{gbp0(r.perf.spendP)}</td>
                  <td className="fig px-4 py-3 text-right">{r.perf.orders}</td>
                  <td className="fig px-4 py-3 text-right">{gbp(r.perf.cpaP)}</td>
                  <td className="fig px-4 py-3 text-right text-muted">{gbp(r.u.breakEvenCpaP)}</td>
                  <td className={`fig px-4 py-3 text-right font-semibold ${r.below ? 'text-neg' : 'text-ink'}`}>{r.perf.roas.toFixed(2)}x</td>
                  <td className={`fig px-4 py-3 text-right ${r.per < 0 ? 'text-neg' : 'text-ink'}`}>{gbp(r.per)}</td>
                  <td className="px-4 py-3 text-right">
                    {r.profit < 0
                      ? <Badge tone="neg">{gbp(r.profit)}</Badge>
                      : <span className="fig font-semibold text-pos">{gbp0(r.profit)}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-line bg-bg px-4 py-3">
          <p className="text-xs text-muted">
            Click through rate across the shown lines is {pct(shown.ctr, 2)} and conversion is {pct(shown.cvr, 2)}.
            Break-even CPA is the contribution each product earns before advertising.
          </p>
        </div>
      </div>
    </div>
  )
}
