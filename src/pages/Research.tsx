import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { Badge, Button, SectionHead } from '../components/ui'
import { ProductImage } from '../components/ProductImage'
import { bySlug, gbp, pct, products } from '../lib/catalogue'
import { campaignsFor, modelOf, perfOf, unitEconomics, type Model } from '../lib/economics'

const priceOf = (s: string) => bySlug(s)!.priceP

/** Where every pound of the price actually goes. */
function Waterfall({ m, cpaP }: { m: Model; cpaP: number }) {
  const u = unitEconomics(m)
  const refundLossP = m.priceP - u.keptRevenueP
  const profitP = u.contributionP - cpaP
  const parts = [
    { k: 'Goods', v: m.cogsP, c: '#0D1017' },
    { k: 'Shipping', v: m.shipP, c: '#333A45' },
    { k: 'Fees', v: u.feeP, c: '#596273' },
    { k: 'Refunds', v: refundLossP, c: '#8A5A2B' },
    { k: 'Ad spend', v: cpaP, c: '#8E5A52' },
    { k: profitP >= 0 ? 'Profit' : 'Loss', v: Math.abs(profitP), c: profitP >= 0 ? '#0B7A4B' : '#BF2718', loss: profitP < 0 },
  ].filter(p => p.v > 0)
  const total = Math.max(m.priceP, parts.reduce((a, p) => a + p.v, 0))
  // When costs run past the price there is a loss, so the bar is longer than
  // the price. Mark where the price actually ended.
  const priceMark = (m.priceP / total) * 100

  return (
    <div>
      <div className="relative flex h-9 w-full overflow-hidden rounded-lg" role="img"
           aria-label={parts.map(p => `${p.k} ${gbp(p.v)}`).join(', ') + `, out of a ${gbp(m.priceP)} price`}>
        {parts.map(p => (
          <div
            key={p.k}
            style={{
              width: `${(p.v / total) * 100}%`,
              background: p.loss
                ? `repeating-linear-gradient(45deg, ${p.c} 0 5px, #8E1F13 5px 10px)`
                : p.c,
            }}
          />
        ))}
        {priceMark < 99.5 && (
          <span className="absolute top-0 h-full border-l-2 border-dashed border-ink" style={{ left: `${priceMark}%` }} aria-hidden="true" />
        )}
      </div>
      {priceMark < 99.5 && (
        <p className="mt-2 text-xs text-muted">
          The dashed line is the {gbp(m.priceP)} the customer paid. Everything past it is money going out that never came in.
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {parts.map(p => (
          <li key={p.k} className="flex items-center gap-1.5 text-xs">
            <span className="size-2.5 rounded-sm" style={{
              background: p.loss ? `repeating-linear-gradient(45deg, ${p.c} 0 3px, #8E1F13 3px 6px)` : p.c,
            }} aria-hidden="true" />
            <span className="text-muted">{p.k}</span>
            <span className="fig font-semibold">{gbp(p.v)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Money is edited in pounds, because nobody thinks in pence. Stored in pence. */
function MoneyRow({
  label, pence, onPence, id, max = 100000,
}: { label: string; pence: number; onPence: (p: number) => void; id: string; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <label htmlFor={id} className="text-sm text-ink-2">{label}</label>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted" aria-hidden="true">£</span>
        <input id={id} type="number" value={(pence / 100).toFixed(2)} step={0.5} min={0} max={max / 100}
               onChange={e => onPence(Math.max(0, Math.min(max, Math.round((Number(e.target.value) || 0) * 100))))}
               className="fig w-24 rounded-lg border border-field bg-card px-2.5 py-1.5 text-right text-sm focus:border-brand" />
        <span className="w-6 text-xs text-muted" />
      </div>
    </div>
  )
}

function PercentRow({
  label, value, onChange, id, step = 0.1, max = 60,
}: { label: string; value: number; onChange: (v: number) => void; id: string; step?: number; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <label htmlFor={id} className="text-sm text-ink-2">{label}</label>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted" aria-hidden="true"> </span>
        <input id={id} type="number" value={value} step={step} min={0} max={max}
               onChange={e => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
               className="fig w-24 rounded-lg border border-field bg-card px-2.5 py-1.5 text-right text-sm focus:border-brand" />
        <span className="w-6 text-xs text-muted">%</span>
      </div>
    </div>
  )
}

export default function Research() {
  const [params, setParams] = useSearchParams()
  const slug = params.get('p') && bySlug(params.get('p')!) ? params.get('p')! : products[0].slug
  const product = bySlug(slug)!

  const actual = useMemo(() => perfOf(campaignsFor(slug), priceOf), [slug])
  const base = useMemo(() => modelOf(product), [product])

  // Editable copy of the model, in pounds for the inputs, pence underneath.
  const [edit, setEdit] = useState<Record<string, number>>({})
  const [cpaOverride, setCpaOverride] = useState<number | null>(null)

  const key = (f: string) => `${slug}.${f}`
  const get = (f: keyof Model) => edit[key(f)] ?? (base[f] as number)
  const set = (f: keyof Model, v: number) => setEdit(e => ({ ...e, [key(f)]: v }))

  const m: Model = {
    priceP: Math.round(get('priceP')),
    cogsP: Math.round(get('cogsP')),
    shipP: Math.round(get('shipP')),
    feePct: get('feePct'),
    feeFixedP: Math.round(get('feeFixedP')),
    refundRate: get('refundRate'),
  }
  const u = unitEconomics(m)
  const cpaP = cpaOverride ?? (actual.cpaP || Math.round(u.contributionP * 0.6))
  const profitP = u.contributionP - cpaP
  const roasAtCpa = cpaP > 0 ? m.priceP / cpaP : Infinity
  const dirty = Object.keys(edit).some(k => k.startsWith(`${slug}.`)) || cpaOverride !== null

  function reset() {
    setEdit(e => Object.fromEntries(Object.entries(e).filter(([k]) => !k.startsWith(`${slug}.`))))
    setCpaOverride(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Unit economics</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          ROAS cannot tell you whether a product makes money, because break-even ROAS is set by the margin and
          the margin is different for every product. Change any number below and watch where the line moves.
        </p>
      </div>

      <div className="card overflow-x-auto p-2">
        <ul className="flex gap-2">
          {products.map(p => {
            const on = p.slug === slug
            return (
              <li key={p.slug}>
                <button type="button"
                  onClick={() => { setParams({ p: p.slug }); setCpaOverride(null) }}
                  aria-pressed={on}
                  className={`flex w-36 flex-col items-start gap-2 rounded-lg border p-2.5 text-left transition-colors duration-150 ${
                    on ? 'border-brand bg-brand-soft' : 'border-line hover:border-field'}`}>
                  <ProductImage product={p} size="thumb" className="size-10 rounded-md" />
                  <span className="text-xs font-semibold leading-tight">{p.name}</span>
                  <span className="fig text-xs text-muted">{unitEconomics(modelOf(p)).breakEvenRoas.toFixed(2)}x to break even</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="card p-5">
          <SectionHead title="The model" sub="Per order, before tax." right={
            dirty ? <Button tone="ghost" onClick={reset}><RotateCcw className="size-4" aria-hidden="true" />Reset</Button> : undefined
          } />
          <div className="mt-3 divide-y divide-line">
            <MoneyRow id="price" label="Selling price" pence={m.priceP} onPence={v => set('priceP', v)} />
            <MoneyRow id="cogs" label="Cost of goods" pence={m.cogsP} onPence={v => set('cogsP', v)} />
            <MoneyRow id="ship" label="Shipping to customer" pence={m.shipP} onPence={v => set('shipP', v)} />
            <PercentRow id="feepct" label="Payment fee" value={Number((m.feePct * 100).toFixed(2))} onChange={v => set('feePct', v / 100)} max={20} />
            <MoneyRow id="feefix" label="Fee, fixed" pence={m.feeFixedP} onPence={v => set('feeFixedP', v)} max={500} />
            <PercentRow id="refund" label="Refund rate" value={Number((m.refundRate * 100).toFixed(1))} onChange={v => set('refundRate', v / 100)} step={0.5} />
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="cpa" className="text-sm font-semibold">Cost per order</label>
              <span className="fig text-sm font-bold">{gbp(cpaP)}</span>
            </div>
            <input id="cpa" type="range" min={0} max={Math.max(u.contributionP * 2, m.priceP)} step={10}
                   value={cpaP} onChange={e => setCpaOverride(Number(e.target.value))}
                   className="mt-2 w-full accent-[#3B2FD9]" />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>Free</span>
              <span className="fig">Break-even {gbp(u.breakEvenCpaP)}</span>
            </div>
            {actual.orders > 0 && (
              <p className="mt-2 text-xs text-muted">
                Actually paying <span className="fig font-semibold text-ink">{gbp(actual.cpaP)}</span> across {actual.orders} orders this month.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card p-4">
              <p className="label">Contribution</p>
              <p className="fig mt-1 text-2xl font-bold">{gbp(u.contributionP)}</p>
              <p className="mt-0.5 text-xs text-muted">{pct(u.marginPct)} of price, before ads</p>
            </div>
            <div className="card p-4">
              <p className="label">Break-even ROAS</p>
              <p className="fig mt-1 text-2xl font-bold">{u.breakEvenRoas.toFixed(2)}x</p>
              <p className="mt-0.5 text-xs text-muted">Below this it loses money</p>
            </div>
            <div className={`card p-4 ${profitP < 0 ? 'border-neg/40 bg-neg-soft' : 'border-pos/40 bg-pos-soft'}`}>
              <p className="label">Profit an order</p>
              <p className={`fig mt-1 text-2xl font-bold ${profitP < 0 ? 'text-neg' : 'text-pos'}`}>{gbp(profitP)}</p>
              <p className="mt-0.5 text-xs text-muted">At {roasAtCpa === Infinity ? 'no' : `${roasAtCpa.toFixed(2)}x`} ROAS</p>
            </div>
          </div>

          <div className="card p-5">
            <SectionHead title="Where the price goes" sub={`Out of the ${gbp(m.priceP)} a customer pays.`} />
            <div className="mt-5"><Waterfall m={m} cpaP={cpaP} /></div>
          </div>

          <div className="card p-5">
            <SectionHead title="What this means" />
            <div className="mt-3 space-y-2.5 text-sm text-ink-2">
              <p>
                At {gbp(m.priceP)} with {pct(m.refundRate)} refunds, {product.name} keeps{' '}
                <span className="fig font-semibold text-ink">{gbp(u.contributionP)}</span> an order before advertising.
                That is the most you can pay for a customer and still be level.
              </p>
              {profitP < 0 ? (
                <p className="rounded-lg bg-neg-soft px-3.5 py-2.5">
                  Paying <span className="fig font-semibold">{gbp(cpaP)}</span> an order loses{' '}
                  <span className="fig font-semibold">{gbp(-profitP)}</span> every time one sells. The ROAS reads{' '}
                  <span className="fig font-semibold">{roasAtCpa.toFixed(2)}x</span>, which looks respectable and is not.
                </p>
              ) : (
                <p className="rounded-lg bg-pos-soft px-3.5 py-2.5">
                  Paying <span className="fig font-semibold">{gbp(cpaP)}</span> an order leaves{' '}
                  <span className="fig font-semibold">{gbp(profitP)}</span>. You could pay up to{' '}
                  <span className="fig font-semibold">{gbp(u.breakEvenCpaP)}</span> before this stops being worth running.
                </p>
              )}
              {actual.orders > 0 && (
                <p>
                  {actual.roas < u.breakEvenRoas
                    ? <>Live, it is running at <Badge tone="neg">{actual.roas.toFixed(2)}x</Badge> against a break-even of {u.breakEvenRoas.toFixed(2)}x, so every order is costing you money.</>
                    : <>Live, it is running at <Badge tone="pos">{actual.roas.toFixed(2)}x</Badge> against a break-even of {u.breakEvenRoas.toFixed(2)}x, with {gbp(actual.cpaP)} of room to spare.</>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
