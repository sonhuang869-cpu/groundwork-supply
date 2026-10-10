import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Stat, Badge, SectionHead, ButtonLink } from '../components/ui'
import { RevenueChart } from '../components/Chart'
import { ProductImage } from '../components/ProductImage'
import { bySlug, campaigns, gbp, gbp0, pct, products } from '../lib/catalogue'
import { campaignsFor, modelOf, netProfitP, perfOf, profitPerOrderP, unitEconomics } from '../lib/economics'
import { daily } from '../lib/series'

const priceOf = (s: string) => bySlug(s)!.priceP

export default function Console() {
  const all = perfOf(campaigns, priceOf)
  const rows = products
    .map(p => {
      const perf = perfOf(campaignsFor(p.slug), priceOf)
      const u = unitEconomics(modelOf(p))
      return { p, perf, u, net: netProfitP(p, perf), per: perf.orders ? profitPerOrderP(modelOf(p), perf.cpaP) : 0 }
    })
    .filter(r => r.perf.orders > 0)
    .sort((a, b) => b.perf.revenueP - a.perf.revenueP)

  const net = rows.reduce((a, r) => a + r.net, 0)
  const losers = rows.filter(r => r.net < 0)
  const drag = losers.reduce((a, r) => a + r.net, 0)
  const aovP = all.orders ? Math.round(all.revenueP / all.orders) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Every figure here is derived from the campaign table, so the chart and the rows cannot drift apart.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={gbp0(all.revenueP)} delta={18.4} note={`${all.orders} orders`} />
        <Stat label="Ad spend" value={gbp0(all.spendP)} delta={24.1} good={false} note={`Blended ${all.roas.toFixed(2)}x ROAS`} />
        <Stat label="Average order value" value={gbp(aovP)} delta={3.2} note={`Conversion ${pct(all.cvr, 2)}`} />
        <Stat label="Net profit" value={gbp0(net)} delta={9.6} note="After goods, shipping, fees, refunds and ads" />
      </div>

      {losers.length > 0 && (
        <div className="card border-warn/40 bg-warn-soft p-5">
          <div className="flex gap-3.5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="h3">
                Blended {all.roas.toFixed(2)}x is healthy. {losers.length === 1 ? 'One product inside it is not.' : `${losers.length} products inside it are not.`}
              </h2>
              <p className="mt-1.5 text-sm text-ink-2">
                {losers.map(l => l.p.name).join(' and ')} {losers.length === 1 ? 'runs' : 'run'} at{' '}
                {losers.map(l => `${l.perf.roas.toFixed(2)}x`).join(' and ')}, above the usual 2x rule of thumb, and still
                {losers.length === 1 ? ' loses ' : ' lose '}
                <span className="font-semibold">{gbp(-drag)}</span> across the month. Break-even for{' '}
                {losers.length === 1 ? 'it' : 'them'} is{' '}
                {losers.map(l => `${l.u.breakEvenRoas.toFixed(2)}x`).join(' and ')}, because the margin is thinner.
              </p>
              <div className="mt-3.5">
                <ButtonLink to="/console/products" tone="outline">Open the unit economics</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-5">
        <SectionHead
          title="Revenue against ad spend"
          sub="Both on one scale. Separate axes are how a spend line gets made to look small."
          right={
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 rounded bg-brand" aria-hidden="true" />Revenue</span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-5 rounded" style={{ background: 'repeating-linear-gradient(90deg,#8A5A2B 0 4px,transparent 4px 7px)' }} aria-hidden="true" />
                Ad spend
              </span>
            </div>
          }
        />
        <RevenueChart data={daily} className="mt-5 h-auto w-full" />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line p-5">
          <SectionHead
            title="By product"
            sub="Sorted by revenue. The last column is the one that decides what stays on."
            right={<Link to="/console/campaigns" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">Campaigns<ArrowRight className="size-4" aria-hidden="true" /></Link>}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line bg-bg text-left">
                {['Product', 'Orders', 'Revenue', 'Spend', 'ROAS', 'Break-even', 'Profit / order', 'Net'].map((h, i) => (
                  <th key={h} scope="col" className={`label px-4 py-2.5 font-semibold ${i > 0 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(r => {
                const below = r.perf.roas < r.u.breakEvenRoas
                return (
                  <tr key={r.p.slug} className="hover:bg-bg">
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <Link to={`/console/products?p=${r.p.slug}`} className="flex items-center gap-3 hover:text-brand">
                        <ProductImage product={r.p} size="thumb" className="size-9 shrink-0 rounded-md" />
                        <span className="font-semibold">{r.p.name}</span>
                      </Link>
                    </th>
                    <td className="fig px-4 py-3 text-right">{r.perf.orders}</td>
                    <td className="fig px-4 py-3 text-right">{gbp0(r.perf.revenueP)}</td>
                    <td className="fig px-4 py-3 text-right">{gbp0(r.perf.spendP)}</td>
                    <td className="fig px-4 py-3 text-right font-semibold">{r.perf.roas.toFixed(2)}x</td>
                    <td className="fig px-4 py-3 text-right text-muted">{r.u.breakEvenRoas.toFixed(2)}x</td>
                    <td className={`fig px-4 py-3 text-right font-semibold ${r.per < 0 ? 'text-neg' : 'text-ink'}`}>{gbp(r.per)}</td>
                    <td className="px-4 py-3 text-right">
                      {below
                        ? <Badge tone="neg">{gbp(r.net)}</Badge>
                        : <span className="fig font-semibold text-pos">{gbp0(r.net)}</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
