import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { ProductArt } from '../components/ProductArt'
import { ButtonLink, Badge } from '../components/ui'
import { bySlug, gbp, live, products } from '../lib/catalogue'
import { campaignsFor, perfOf } from '../lib/economics'

const priceOf = (s: string) => bySlug(s)!.priceP

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <p className="flex items-center gap-1.5">
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map(i => (
          <Star key={i} className={`size-3.5 ${i < Math.round(rating) ? 'fill-warn text-warn' : 'text-line-strong'}`} />
        ))}
      </span>
      <span className="fig text-xs text-muted">
        {rating.toFixed(1)} ({reviews.toLocaleString('en-GB')})
      </span>
    </p>
  )
}

export function ProductCard({ slug }: { slug: string }) {
  const p = bySlug(slug)!
  const off = p.compareAtP ? Math.round((1 - p.priceP / p.compareAtP) * 100) : 0
  return (
    <li className="group">
      <Link to={`/p/${p.slug}`} className="block">
        <div className="relative">
          <ProductArt art={p.art} name={p.name} className="w-full rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5" />
          {off > 0 && <span className="absolute left-3 top-3"><Badge tone="neg">{off}% off</Badge></span>}
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-semibold group-hover:text-brand">{p.name}</h3>
          <p className="mt-0.5 text-xs text-muted">{p.short}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="fig text-base font-bold">{gbp(p.priceP)}</span>
            {p.compareAtP && <span className="fig text-xs text-muted line-through">{gbp(p.compareAtP)}</span>}
          </div>
          <div className="mt-1.5"><Stars rating={p.rating} reviews={p.reviews} /></div>
        </div>
      </Link>
    </li>
  )
}

export default function Store() {
  const hero = bySlug('percussion-massager')!
  const perf = perfOf(campaignsFor(hero.slug), priceOf)
  // Four across, so the row fills. The fifth lives in the nav and the footer.
  const sellers = [...live()]
    .sort((a, b) => perfOf(campaignsFor(b.slug), priceOf).orders - perfOf(campaignsFor(a.slug), priceOf).orders)
    .slice(0, 4)

  return (
    <>
      <section className="border-b border-line bg-bg">
        <div className="shell grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Badge tone="brand">Best seller · {perf.orders} sold this month</Badge>
            <h1 className="h1 mt-4">
              Recover harder than<br className="hidden sm:block" /> you train.
            </h1>
            <p className="mt-4 max-w-lg text-base text-ink-2">
              Percussion, compression and mobility kit that does the job of a sports massage, in a flat,
              at ten at night. Shipped from Salford in two to four days.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink to={`/p/${hero.slug}`} tone="ink">Shop the massager</ButtonLink>
              <ButtonLink to={`/lp/${hero.slug}`} tone="outline">See the landing page</ButtonLink>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Stars rating={hero.rating} reviews={hero.reviews} />
              <p className="text-xs text-muted">Over {hero.reviews.toLocaleString('en-GB')} reviews</p>
            </div>
          </div>

          <div className="relative">
            <ProductArt art={hero.art} name={hero.name} className="w-full rounded-2xl" />
            <div className="card absolute -bottom-4 left-4 right-4 flex items-center justify-between gap-4 p-3.5 md:left-auto md:right-6 md:w-64">
              <div>
                <p className="label">This month</p>
                <p className="fig mt-0.5 text-lg font-bold">{perf.orders} orders</p>
              </div>
              <div className="text-right">
                <p className="label">Rating</p>
                <p className="fig mt-0.5 text-lg font-bold">{hero.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="best" className="shell py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="best" className="h2">Best sellers</h2>
            <p className="mt-1 text-sm text-muted">Ranked by orders this month, not by what we want to shift.</p>
          </div>
          <Link to="/console" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
            See how these numbers are made
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-7 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
          {sellers.map(p => <ProductCard key={p.slug} slug={p.slug} />)}
        </ul>
      </section>

      <section aria-labelledby="testing" className="border-t border-line bg-bg">
        <div className="shell py-12 md:py-16">
          <h2 id="testing" className="h2">In testing</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Products running paid traffic but not yet proven. They stay here until the maths says otherwise.
          </p>
          <ul className="mt-7 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
            {products.filter(p => p.status !== 'live').map(p => <ProductCard key={p.slug} slug={p.slug} />)}
          </ul>
        </div>
      </section>
    </>
  )
}
