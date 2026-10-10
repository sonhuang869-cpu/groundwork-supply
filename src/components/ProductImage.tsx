import { useState } from 'react'
import type { Product } from '../lib/catalogue'

type Size = 'thumb' | 'card' | 'full'

/** Served from /public/shop, so there is no third party in the critical path. */
const SRC: Record<Size, (b: string) => string> = {
  thumb: b => `/shop/${b}-200.webp`,
  card: b => `/shop/${b}-600.webp`,
  full: b => `/shop/${b}.webp`,
}

const SIZES: Record<Size, string> = {
  thumb: '80px',
  card: '(min-width: 1024px) 300px, (min-width: 640px) 45vw, 45vw',
  full: '(min-width: 1024px) 620px, 92vw',
}

export function ProductImage({
  product, size = 'card', variant, className = '', alt, priority,
}: {
  product: Product
  size?: Size
  /** '', 'b' or 'c': the main shot or one of the two detail views. */
  variant?: 'b' | 'c'
  className?: string
  alt?: string
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const base = variant ? `${product.img}-${variant}` : product.img

  // A missing file must still leave a sized, labelled box rather than a gap.
  if (failed) {
    return (
      <div
        className={`grid place-items-center bg-bg text-center text-xs font-semibold text-muted ${className}`}
        style={{ aspectRatio: '1 / 1' }}
        role="img"
        aria-label={alt ?? `${product.name}, image unavailable`}
      >
        {product.name}
      </div>
    )
  }

  const src = variant ? `/shop/${base}.webp` : SRC[size](base)
  const srcSet = variant
    ? undefined
    : `/shop/${base}-200.webp 200w, /shop/${base}-600.webp 600w, /shop/${base}.webp 1000w`

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? SIZES[size] : undefined}
      width={1000}
      height={1000}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      alt={alt ?? `${product.name}, ${product.short.replace(/\.$/, '').toLowerCase()}`}
      className={`bg-bg object-cover ${className}`}
    />
  )
}

/** Wide brand photography: the storefront hero and section imagery. */
export function Scene({
  name, alt, className = '', priority,
}: { name: 'hero-rack' | 'hero-room' | 'lifestyle-mats'; alt: string; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`bg-bg ${className}`} role="img" aria-label={alt} />
  return (
    <img
      src={`/shop/${name}.webp`}
      width={1600}
      height={1100}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      alt={alt}
      className={`bg-bg object-cover ${className}`}
    />
  )
}
