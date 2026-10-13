import { useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Star, Check, Truck, RotateCcw, Minus, Plus, Package } from 'lucide-react'
import { ProductImage } from '../components/ProductImage'
import { ProductCard } from './Store'
import { Button, Badge } from '../components/ui'
import { useCart } from '../lib/cart'
import { bySlug, gbp, live } from '../lib/catalogue'
import { movedTo } from '../lib/moved'

/** The cross-sell is a real bundle with a real saving, not a decorative row. */
const BUNDLE_OFF = 0.12

const VIEWS: { key: 'b' | 'c' | undefined; label: string }[] = [
  { key: undefined, label: 'the full product' },
  { key: 'b', label: 'a closer view' },
  { key: 'c', label: 'the detail' },
]

export default function ProductPage() {
  const { slug } = useParams()
  const p = slug ? bySlug(slug) : undefined
  const { add } = useCart()

  const [colour, setColour] = useState(p?.colours[0] ?? '')
  const [view, setView] = useState<'b' | 'c' | undefined>(undefined)
  const [qty, setQty] = useState(1)
  const [withBundle, setWithBundle] = useState(false)
  const [added, setAdded] = useState(false)

  const partner = useMemo(
    () => (p ? live().find(x => x.slug !== p.slug && x.category === p.category) ?? live().find(x => x.slug !== p.slug)! : undefined),
    [p],
  )

  // A link sent before the rename still has to work.
  const moved = movedTo(slug)
  if (!p && moved) return <Navigate to={`/p/${moved}`} replace />
  if (!p) return <Navigate to="/404" replace />

  const off = p.compareAtP ? Math.round((1 - p.priceP / p.compareAtP) * 100) : 0
  const bundleFullP = p.priceP + (partner?.priceP ?? 0)
  const bundleP = Math.round(bundleFullP * (1 - BUNDLE_OFF))
  const bundleSaveP = bundleFullP - bundleP
  const lineP = (withBundle ? bundleP : p.priceP) * qty

  function onAdd() {
    add(p!, colour, qty)
    if (withBundle && partner) add(partner, partner.colours[0], qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-bg">
        <div className="shell flex items-center gap-2 py-3 text-xs text-muted">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="hover:text-ink">{p.category}</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-ink">{p.name}</span>
        </div>
      </nav>

      <div className="shell grid gap-10 py-8 lg:grid-cols-[1.05fr_26rem] lg:gap-14 lg:py-12">
        <div>
          <ProductImage
            product={p}
            size="full"
            priority
            variant={view}
            className="aspect-square w-full rounded-2xl"
          />
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {VIEWS.map(v => (
              <li key={v.key ?? 'main'}>
                <button
                  type="button"
                  onClick={() => setView(v.key)}
                  aria-pressed={view === v.key}
                  className={`block w-full rounded-lg border p-1 transition-colors duration-150 ${
                    view === v.key ? 'border-brand' : 'border-line hover:border-field'}`}
                >
                  <ProductImage
                    product={p}
                    size="thumb"
                    variant={v.key}
                    alt={`${p.name}, ${v.label}`}
                    className="aspect-square w-full rounded-md"
                  />
                  <span className="sr-only">Show {v.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <section className="mt-10" aria-labelledby="spec">
            <h2 id="spec" className="h2">What it is</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {p.bullets.map(b => (
                <li key={b} className="flex gap-2.5 text-sm text-ink-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-pos" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <dl className="mt-7 grid gap-x-8 gap-y-4 border-t border-line pt-5 sm:grid-cols-3">
              <div><dt className="label">Category</dt><dd className="mt-1 text-sm font-medium">{p.category}</dd></div>
              <div><dt className="label">Dispatch</dt><dd className="mt-1 text-sm font-medium">Next working day</dd></div>
              <div><dt className="label">Warranty</dt><dd className="mt-1 text-sm font-medium">Two years</dd></div>
            </dl>
          </section>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Badge tone={p.status === 'live' ? 'pos' : 'warn'}>{p.status === 'live' ? 'Best seller' : 'In testing'}</Badge>
            {off > 0 && <Badge tone="neg">{off}% off</Badge>}
          </div>
          <h1 className="h1 mt-3">{p.name}</h1>

          <p className="mt-3 flex items-center gap-1.5">
            <span className="flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map(i => (
                <Star key={i} className={`size-4 ${i < Math.round(p.rating) ? 'fill-warn text-warn' : 'text-line-strong'}`} />
              ))}
            </span>
            <span className="fig text-sm text-muted">{p.rating.toFixed(1)} from {p.reviews.toLocaleString('en-GB')} reviews</span>
          </p>

          <p className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="fig text-3xl font-extrabold">{gbp(p.priceP)}</span>
            {p.compareAtP && <span className="fig text-base text-muted line-through">{gbp(p.compareAtP)}</span>}
          </p>
          <p className="mt-1.5 text-sm text-ink-2">{p.short}</p>

          {p.colours.length > 1 && (
            <fieldset className="mt-6">
              <legend className="label mb-2">Colour: <span className="text-ink">{colour}</span></legend>
              <div className="flex flex-wrap gap-2">
                {p.colours.map(c => (
                  <button key={c} type="button" onClick={() => setColour(c)} aria-pressed={colour === c}
                    className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                      colour === c ? 'border-brand bg-brand-soft text-brand' : 'border-field hover:border-ink'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6">
            <p className="label mb-2">Quantity</p>
            <div className="inline-flex items-center rounded-lg border border-field">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="grid size-11 place-items-center rounded-l-lg hover:bg-bg">
                <Minus className="size-4" aria-hidden="true" /><span className="sr-only">Fewer</span>
              </button>
              <span className="fig w-12 text-center font-semibold" aria-label={`Quantity ${qty}`}>{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))}
                      className="grid size-11 place-items-center rounded-r-lg hover:bg-bg">
                <Plus className="size-4" aria-hidden="true" /><span className="sr-only">More</span>
              </button>
            </div>
          </div>

          {partner && (
            <div className={`mt-6 rounded-xl border p-4 transition-colors duration-150 ${
              withBundle ? 'border-brand bg-brand-soft' : 'border-line bg-bg'}`}>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={withBundle} onChange={e => setWithBundle(e.target.checked)}
                       className="mt-1 size-4 accent-[#3B2FD9]" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Package className="size-4 shrink-0 text-brand" aria-hidden="true" />
                    Add the {partner.name}
                  </span>
                  <span className="mt-1 block text-xs text-ink-2">
                    Bought together by most buyers. Saves {gbp(bundleSaveP)} against buying them apart.
                  </span>
                  <span className="fig mt-1.5 block text-sm font-semibold">
                    {gbp(bundleP)} <span className="text-muted line-through">{gbp(bundleFullP)}</span>
                  </span>
                </span>
                <ProductImage product={partner} size="thumb" className="size-14 shrink-0 rounded-lg" />
              </label>
            </div>
          )}

          <div className="card mt-6 p-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{withBundle ? 'Bundle' : p.name} × {qty}</dt>
                <dd className="fig font-medium">{gbp(lineP)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="fig font-medium">{lineP >= 5000 ? 'Free' : gbp(395)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-1.5 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="fig font-bold">{gbp(lineP + (lineP >= 5000 ? 0 : 395))}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <Button tone="ink" full onClick={onAdd}>{added ? 'Added to basket' : 'Add to basket'}</Button>
            </div>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2 text-xs text-muted">
                <Truck className="size-3.5" aria-hidden="true" /> Free UK delivery over £50
              </li>
              <li className="flex items-center gap-2 text-xs text-muted">
                <RotateCcw className="size-3.5" aria-hidden="true" /> 30 day returns, unused and boxed
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section aria-labelledby="more" className="border-t border-line bg-bg">
        <div className="shell py-12">
          <h2 id="more" className="h2">Goes with it</h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
            {live().filter(x => x.slug !== p.slug).slice(0, 4).map(x => <ProductCard key={x.slug} slug={x.slug} />)}
          </ul>
        </div>
      </section>
    </>
  )
}
