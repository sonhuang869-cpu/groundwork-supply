import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Star, Check, ShieldCheck, Truck, Minus, Plus, Lock } from 'lucide-react'
import { ProductImage } from '../components/ProductImage'
import { Button, Badge } from '../components/ui'
import { useCart } from '../lib/cart'
import { bySlug, gbp } from '../lib/catalogue'
import { movedTo } from '../lib/moved'

/**
 * A landing page, not a product page. No navigation out, one offer, one action,
 * and the proof stacked in the order an unconvinced stranger asks for it.
 */

const PROBLEMS = [
  'Your hands slide forward in downward dog about four minutes in',
  'The cheap mat has gone shiny in two patches and will not grip at all',
  'You have started putting a towel over it, which slides as well',
]

const REASSURANCE = [
  { icon: Truck, text: 'Dispatched next working day' },
  { icon: ShieldCheck, text: 'Two year warranty' },
  { icon: Check, text: '30 day returns' },
]

const FAQ = [
  { q: 'Does it actually grip when I sweat?', a: 'That is the whole point of the closed cell rubber face. Sweat sits on top rather than soaking in, and the grip gets slightly better when damp rather than worse. It is the opposite of a PVC mat.' },
  { q: 'Will it smell of rubber?', a: 'For about three days, yes. Natural rubber does. Leave it unrolled somewhere ventilated and it goes. If it bothers you after a fortnight, send it back.' },
  { q: 'Is 5 mm enough for my knees?', a: 'For most people, on a wooden floor, yes. If you kneel a lot or have sore knees, fold the end over or add a block under the knee rather than buying a thicker mat that then slides.' },
  { q: 'What if it is not for me?', a: 'Send it back within thirty days, unused and in the box, and we refund the order including the delivery you paid.' },
  { q: 'How quickly does it arrive?', a: 'Dispatched the next working day from Salford, with delivery in two to four days across UK mainland.' },
]

export default function Landing() {
  const { slug } = useParams()
  const p = slug ? bySlug(slug) : undefined
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [open, setOpen] = useState<string | null>(FAQ[0].q)

  // A link sent before the rename still has to work.
  const moved = movedTo(slug)
  if (!p && moved) return <Navigate to={`/lp/${moved}`} replace />
  if (!p) return <Navigate to="/404" replace />
  const off = p.compareAtP ? Math.round((1 - p.priceP / p.compareAtP) * 100) : 0

  const Buy = ({ full }: { full?: boolean }) => (
    <Button tone="ink" full={full} onClick={() => add(p, p.colours[0], qty)}>
      Add to basket · {gbp(p.priceP * qty)}
    </Button>
  )

  return (
    <div className="min-h-dvh bg-card">
      <a href="#offer" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white">
        Skip to the offer
      </a>

      <header className="border-b border-line">
        <div className="shell flex h-14 items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="#0D1017" />
              <path d="M7 21.5L13 14l4.5 5L25 9.5" fill="none" stroke="#3B2FD9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-extrabold tracking-[-0.02em]">Groundwork</span>
          </Link>
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <Lock className="size-3.5" aria-hidden="true" /> Secure checkout
          </p>
        </div>
      </header>

      {/* Offer */}
      <section id="offer" className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="flex flex-wrap items-center gap-2">
            {off > 0 && <Badge tone="neg">{off}% off today</Badge>}
            <Badge tone="pos">Free UK delivery</Badge>
          </div>
          <h1 className="h1 mt-4">
            The mat that grips<br className="hidden sm:block" /> harder when you sweat.
          </h1>
          <p className="mt-4 text-base text-ink-2">{p.short} {p.bullets[0]}.</p>

          <p className="mt-5 flex items-center gap-2">
            <span className="flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map(i => <Star key={i} className={`size-4 ${i < Math.round(p.rating) ? 'fill-warn text-warn' : 'text-line-strong'}`} />)}
            </span>
            <span className="fig text-sm font-semibold">{p.rating.toFixed(1)}</span>
            <span className="text-sm text-muted">from {p.reviews.toLocaleString('en-GB')} reviews</span>
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="fig text-4xl font-extrabold">{gbp(p.priceP)}</span>
            {p.compareAtP && <span className="fig text-lg text-muted line-through">{gbp(p.compareAtP)}</span>}
            {p.compareAtP && <span className="fig text-sm font-semibold text-pos">Save {gbp(p.compareAtP - p.priceP)}</span>}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-field">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="grid size-11 place-items-center rounded-l-lg hover:bg-bg">
                <Minus className="size-4" aria-hidden="true" /><span className="sr-only">Fewer</span>
              </button>
              <span className="fig w-10 text-center font-semibold" aria-label={`Quantity ${qty}`}>{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} className="grid size-11 place-items-center rounded-r-lg hover:bg-bg">
                <Plus className="size-4" aria-hidden="true" /><span className="sr-only">More</span>
              </button>
            </div>
            <Buy />
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {REASSURANCE.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5 text-xs text-muted">
                <Icon className="size-3.5 text-pos" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <ProductImage product={p} size="full" priority className="aspect-square w-full rounded-2xl" />
        </div>
      </section>

      {/* Problem */}
      <section aria-labelledby="problem" className="border-y border-line bg-bg">
        <div className="shell py-12 md:py-14">
          <h2 id="problem" className="h2 max-w-lg">If you practise more than twice a week, you already know the problem.</h2>
          <ul className="mt-7 grid gap-5 md:grid-cols-3">
            {PROBLEMS.map((t, i) => (
              <li key={t} className="card p-5">
                <span className="fig text-sm font-bold text-brand">0{i + 1}</span>
                <p className="mt-2 text-sm text-ink-2">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What it does */}
      <section aria-labelledby="does" className="shell py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <ProductImage product={p} size="full" variant="b" alt={`${p.name}, close up`} className="aspect-square w-full rounded-2xl" />
          <div>
            <h2 id="does" className="h2">What you actually get</h2>
            <ul className="mt-5 space-y-3">
              {p.bullets.map(b => (
                <li key={b} className="flex gap-3 text-sm text-ink-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-pos" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-7 max-w-xs"><Buy full /></div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section aria-labelledby="proof" className="border-y border-line bg-bg">
        <div className="shell py-12 md:py-14">
          <h2 id="proof" className="h2">What buyers say</h2>
          <ul className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              { w: 'Third mat in two years and the first one I have not had to put a towel on. It is heavier than I expected, which turns out to be the point.', n: 'Aisha K.', c: 'Verified buyer' },
              { w: 'It did smell for the first few days exactly as the page said it would. Then it stopped. I appreciated being told rather than finding out.', n: 'Tom R.', c: 'Verified buyer' },
              { w: 'I teach four classes a week on it. Eight months in, no shiny patches where my hands go, which is where every other mat has died.', n: 'Marc D.', c: 'Verified buyer' },
            ].map(t => (
              <li key={t.n} className="card p-5">
                <span className="flex" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map(i => <Star key={i} className="size-3.5 fill-warn text-warn" />)}
                </span>
                <blockquote className="mt-3 text-sm text-ink-2">“{t.w}”</blockquote>
                <p className="mt-3 text-xs font-semibold">{t.n} <span className="font-normal text-muted">· {t.c}</span></p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="shell py-12 md:py-14">
        <h2 id="faq" className="h2">Before you buy</h2>
        <dl className="mt-6 max-w-2xl border-t border-line">
          {FAQ.map(f => {
            const on = open === f.q
            return (
              <div key={f.q} className="border-b border-line">
                <dt>
                  <button type="button" onClick={() => setOpen(on ? null : f.q)} aria-expanded={on}
                          className="flex w-full items-center justify-between gap-6 py-4 text-left">
                    <span className="text-sm font-semibold">{f.q}</span>
                    {on ? <Minus className="size-4 shrink-0 text-brand" aria-hidden="true" /> : <Plus className="size-4 shrink-0 text-muted" aria-hidden="true" />}
                  </button>
                </dt>
                {on && <dd className="pb-4 pr-8 text-sm text-ink-2">{f.a}</dd>}
              </div>
            )
          })}
        </dl>
      </section>

      {/* Close */}
      <section className="bg-dark">
        <div className="shell grid gap-6 py-12 text-white md:grid-cols-[1.3fr_1fr] md:items-center md:py-16">
          <div>
            <h2 className="h2">{gbp(p.priceP)} today, free delivery, thirty days to change your mind.</h2>
            <p className="mt-3 text-sm text-line-strong">
              If it does not earn its place in the first month, send it back and we refund the delivery too.
            </p>
          </div>
          <div className="md:justify-self-end"><Buy /></div>
        </div>
      </section>

      <footer className="border-t border-line py-6">
        <div className="shell flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">Prototype. Representative brand, product, prices and reviews.</p>
          <Link to="/" className="text-xs font-semibold text-brand hover:underline">Back to the store</Link>
        </div>
      </footer>
    </div>
  )
}
