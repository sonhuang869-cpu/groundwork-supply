import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Megaphone, Calculator, Store, Menu, X, CalendarDays } from 'lucide-react'
import { PERIOD } from '../lib/catalogue'

const NAV = [
  { to: '/console', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/console/campaigns', end: false, label: 'Campaigns', icon: Megaphone },
  { to: '/console/products', end: false, label: 'Unit economics', icon: Calculator },
]

export function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  const nav = (
    <ul className="space-y-1">
      {NAV.map(n => (
        <li key={n.to}>
          <NavLink to={n.to} end={n.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive ? 'bg-brand-soft text-brand' : 'text-ink-2 hover:bg-bg hover:text-ink'
              }`}>
            <n.icon className="size-4.5 shrink-0" aria-hidden="true" />
            {n.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="min-h-dvh bg-bg">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white">
        Skip to content
      </a>

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Sidebar */}
        <div className="hidden border-r border-line bg-card lg:flex lg:h-dvh lg:flex-col lg:sticky lg:top-0">
          <div className="border-b border-line px-5 py-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
                <rect width="32" height="32" rx="7" fill="#0D1017" />
                <path d="M7 21.5L13 14l4.5 5L25 9.5" fill="none" stroke="#3B2FD9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="25" cy="9.5" r="2.6" fill="#FFFFFF" />
              </svg>
              <span className="text-[0.9375rem] font-extrabold tracking-[-0.02em]">Groundwork</span>
            </Link>
          </div>
          <nav aria-label="Console" className="flex-1 px-3 py-4">{nav}</nav>
          <div className="border-t border-line p-3">
            <Link to="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-bg hover:text-ink">
              <Store className="size-4.5" aria-hidden="true" />
              View the storefront
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b border-line bg-card">
            <div className="flex h-15 items-center justify-between gap-3 px-4 py-3 md:px-7">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="console-nav"
                        className="grid size-9 place-items-center rounded-lg hover:bg-bg lg:hidden">
                  {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
                  <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                </button>
                <div>
                  <p className="text-sm font-bold leading-tight">Groundwork Supply</p>
                  <p className="text-xs leading-tight text-muted">Shopify · GBP</p>
                </div>
              </div>
              <p className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-2">
                <CalendarDays className="size-4 text-muted" aria-hidden="true" />
                <span className="hidden sm:inline">{PERIOD}</span>
                <span className="sm:hidden">Oct 2026</span>
              </p>
            </div>
            {open && (
              <nav id="console-nav" aria-label="Console, mobile" className="border-t border-line px-3 py-3 lg:hidden">
                {nav}
                <Link to="/" className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-bg">
                  <Store className="size-4.5" aria-hidden="true" />
                  View the storefront
                </Link>
              </nav>
            )}
          </header>

          <main id="main" className="px-4 py-6 md:px-7 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
