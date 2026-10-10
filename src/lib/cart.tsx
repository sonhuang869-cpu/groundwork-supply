import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { bySlug, type Product } from './catalogue'

const KEY = 'groundwork.cart'

export type Line = { slug: string; colour: string; qty: number }

function load(): Line[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Drop anything that no longer matches a real product or colour.
    return parsed.flatMap(l => {
      if (!l || typeof l !== 'object') return []
      const { slug, colour, qty } = l as Line
      const p = typeof slug === 'string' ? bySlug(slug) : undefined
      if (!p || !p.colours.includes(colour)) return []
      const n = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)))
      return [{ slug, colour, qty: n }]
    })
  } catch {
    return []
  }
}

const save = (l: Line[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(l)) } catch { /* private mode */ }
}

type Ctx = {
  lines: Line[]
  open: boolean
  setOpen: (v: boolean) => void
  add: (p: Product, colour: string, qty: number) => void
  setQty: (slug: string, colour: string, qty: number) => void
  remove: (slug: string, colour: string) => void
  count: number
  subtotalP: number
}

const CartCtx = createContext<Ctx | null>(null)

/** Free delivery over this, which is what makes the cross-sell worth showing. */
export const FREE_SHIP_P = 5000
export const SHIP_P = 395

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => setLines(load()), [])



  const add = useCallback((p: Product, colour: string, qty: number) => {
    setLines(prev => {
      const i = prev.findIndex(l => l.slug === p.slug && l.colour === colour)
      const next = i >= 0
        ? prev.map((l, j) => (j === i ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
        : [...prev, { slug: p.slug, colour, qty }]
      save(next)
      return next
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((slug: string, colour: string, qty: number) => {
    setLines(prev => {
      const next = qty <= 0
        ? prev.filter(l => !(l.slug === slug && l.colour === colour))
        : prev.map(l => (l.slug === slug && l.colour === colour ? { ...l, qty: Math.min(99, qty) } : l))
      save(next)
      return next
    })
  }, [])

  const remove = useCallback((slug: string, colour: string) => setQty(slug, colour, 0), [setQty])

  const count = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines])
  const subtotalP = useMemo(
    () => lines.reduce((a, l) => a + (bySlug(l.slug)?.priceP ?? 0) * l.qty, 0),
    [lines],
  )

  const value = useMemo(
    () => ({ lines, open, setOpen, add, setQty, remove, count, subtotalP }),
    [lines, open, add, setQty, remove, count, subtotalP],
  )
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}

