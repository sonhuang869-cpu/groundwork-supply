import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Truck, RotateCcw, ShieldCheck, Minus, Plus, Trash2, Gauge } from 'lucide-react'
import { useCart, FREE_SHIP_P, SHIP_P } from '../lib/cart'
import { bySlug, gbp, live } from '../lib/catalogue'
import { ProductImage } from './ProductImage'
import { Button, ButtonLink } from './ui'

function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill={dark ? '#FFFFFF' : '#0D1017'} />
        <path d="M7 21.5L13 14l4.5 5L25 9.5" fill="none" stroke="#3B2FD9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="25" cy="9.5" r="2.6" fill={dark ? '#0D1017' : '#FFFFFF'} />
      </svg>
      <span className={`text-[0.9375rem] font-extrabold tracking-[-0.02em] ${dark ? 'text-white' : 'text-ink'}`}>
        Groundwork
      </span>
    </span>
  )
}

const PROMISES = [
  { icon: Truck, title: 'Free delivery over £50', body: 'UK mainland, 2 to 4 days' },
  { icon: RotateCcw, title: '30 day returns', body: 'Unused, in the box' },
  { icon: ShieldCheck, title: 'Two year warranty', body: 'On motors and electronics' },
]

function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, subtotalP, count } = useCart()
  const shipP = subtotalP >= FREE_SHIP_P || subtotalP === 0 ? 0 : SHIP_P
  const toFree = FREE_SHIP_P - subtotalP

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close basket" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/45" />
      <div role="dialog" aria-modal="true" aria-label="Your basket"
           className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="h3">Your basket ({count})</h2>
          <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg hover:bg-bg">
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-9 text-muted" aria-hidden="true" />
            <p className="text-sm text-muted">Nothing in here yet.</p>
            <Button tone="outline" onClick={() => setOpen(false)}>Keep looking</Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map(l => {
                const p = bySlug(l.slug)!
                return (
                  <li key={`${l.slug}-${l.colour}`} className="flex gap-3.5 py-4">
                    <ProductImage product={p} size="thumb" className="size-16 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link to={`/p/${p.slug}`} onClick={() => setOpen(false)} className="block truncate text-sm font-semibold hover:text-brand">
                            {p.name}
                          </Link>
                          <p className="text-xs text-muted">{l.colour}</p>
                        </div>
                        <p className="fig shrink-0 text-sm font-semibold">{gbp(p.priceP * l.qty)}</p>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-line-strong">
                          <button type="button" onClick={() => setQty(l.slug, l.colour, l.qty - 1)}
                                  className="grid size-8 place-items-center rounded-l-lg hover:bg-bg">
                            <Minus className="size-3.5" aria-hidden="true" />
                            <span className="sr-only">Fewer {p.name}</span>
                          </button>
                          <span className="fig w-8 text-center text-sm" aria-label={`Quantity ${l.qty}`}>{l.qty}</span>
                          <button type="button" onClick={() => setQty(l.slug, l.colour, l.qty + 1)}
                                  className="grid size-8 place-items-center rounded-r-lg hover:bg-bg">
                            <Plus className="size-3.5" aria-hidden="true" />
                            <span className="sr-only">More {p.name}</span>
                          </button>
                        </div>
                        <button type="button" onClick={() => remove(l.slug, l.colour)}
                                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-bg hover:text-neg">
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Remove {p.name}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-line px-5 py-4">
              {toFree > 0 && (
                <p className="mb-3 rounded-lg bg-brand-soft px-3 py-2 text-xs font-medium text-brand">
                  Add {gbp(toFree)} more for free delivery.
                </p>
              )}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="fig font-medium">{gbp(subtotalP)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="fig font-medium">{shipP === 0 ? 'Free' : gbp(shipP)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-1.5 text-base">
                  <dt className="font-bold">Total</dt><dd className="fig font-bold">{gbp(subtotalP + shipP)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <Button tone="ink" full onClick={() => setOpen(false)}>Checkout</Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted">Prototype, so checkout is not connected.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [nav, setNav] = useState(false)
  const { count, setOpen } = useCart()
  const { pathname } = useLocation()

  useEffect(() => { setNav(false); window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-card">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white">
        Skip to content
      </a>

      <p className="bg-ink py-2 text-center text-xs font-medium text-white">
        Free UK delivery over £50 · 30 day returns
      </p>

      <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-7">
            <Link to="/" aria-label="Groundwork, home"><Logo /></Link>
            <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
              {live().slice(0, 4).map(p => (
                <NavLink key={p.slug} to={`/p/${p.slug}`}
                  className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand' : 'text-ink-2 hover:text-ink'}`}>
                  {p.name.split(',')[0]}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <Link to="/console" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-bg hover:text-ink sm:inline-flex">
              <Gauge className="size-4" aria-hidden="true" />
              Console
            </Link>
            <button type="button" onClick={() => setOpen(true)}
                    className="relative grid size-10 place-items-center rounded-lg hover:bg-bg">
              <ShoppingBag className="size-5" aria-hidden="true" />
              <span className="sr-only">Open basket, {count} items</span>
              {count > 0 && (
                <span className="fig absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button type="button" onClick={() => setNav(v => !v)} aria-expanded={nav} aria-controls="store-nav"
                    className="grid size-10 place-items-center rounded-lg hover:bg-bg md:hidden">
              {nav ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
              <span className="sr-only">{nav ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </div>

        {nav && (
          <nav id="store-nav" aria-label="Primary, mobile" className="border-t border-line md:hidden">
            <div className="shell py-2">
              {live().map(p => (
                <NavLink key={p.slug} to={`/p/${p.slug}`}
                  className={({ isActive }) => `block border-b border-line py-3 text-sm font-medium ${isActive ? 'text-brand' : 'text-ink'}`}>
                  {p.name}
                </NavLink>
              ))}
              <Link to="/console" className="block py-3 text-sm font-semibold text-muted">Operator console</Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">{children}</main>

      <section aria-label="Delivery and returns" className="border-y border-line bg-bg">
        <div className="shell grid gap-5 py-8 sm:grid-cols-3">
          {PROMISES.map(p => (
            <div key={p.title} className="flex items-start gap-3">
              <p.icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-dark text-white">
        <div className="shell grid gap-8 py-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-3 max-w-xs text-sm text-line-strong">
              Recovery and strength equipment, shipped from a unit in Salford.
            </p>
          </div>
          <nav aria-label="Footer, shop">
            <p className="label text-line-strong">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              {live().map(p => (
                <li key={p.slug}><Link to={`/p/${p.slug}`} className="text-line-strong hover:text-white">{p.name}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer, behind the store">
            <p className="label text-line-strong">Behind the store</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/console" className="text-line-strong hover:text-white">Operator console</Link></li>
              <li><Link to="/console/campaigns" className="text-line-strong hover:text-white">Campaigns</Link></li>
              <li><Link to="/console/products" className="text-line-strong hover:text-white">Unit economics</Link></li>
              <li><Link to="/lp/studio-yoga-mat" className="text-line-strong hover:text-white">Example landing page</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-ink-2">
          <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-xs text-line-strong">Prototype. Representative brand, products, prices and figures.</p>
            <ButtonLink to="/console" tone="ghost">
              <span className="text-white">Open the console</span>
            </ButtonLink>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  )
}
