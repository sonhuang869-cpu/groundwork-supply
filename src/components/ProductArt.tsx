import type { Art } from '../lib/catalogue'

/**
 * Products are drawn, not photographed. Eight silhouettes sharing one ground,
 * one stroke weight and one palette, so the grid reads as one brand rather than
 * eight stock photos with different lighting.
 */

const GROUND: Record<Art, string> = {
  massager: '#EDEBFB', boots: '#E8EEF6', bands: '#F6EFE6', kettlebell: '#ECEEF3',
  roller: '#F6EFE6', mask: '#EDEBFB', posture: '#E8EEF6', mat: '#F6EFE6',
}

const BODY = '#2A3140'
const EDGE = '#151A22'
const HI = '#FFFFFF'
const ACC = '#3B2FD9'

function Shape({ art }: { art: Art }) {
  switch (art) {
    case 'massager':
      return (
        <g transform="rotate(-18 100 100)">
          <rect x="88" y="78" width="24" height="76" rx="11" fill={BODY} />
          <rect x="92" y="96" width="16" height="30" rx="7" fill={EDGE} />
          <rect x="95" y="134" width="10" height="3" rx="1.5" fill={ACC} />
          <rect x="82" y="58" width="36" height="24" rx="9" fill={EDGE} />
          <circle cx="100" cy="52" r="17" fill={BODY} />
          <circle cx="100" cy="52" r="9" fill={HI} opacity="0.9" />
        </g>
      )
    case 'boots':
      return (
        <g>
          {[72, 110].map(x => (
            <g key={x}>
              <rect x={x} y="44" width="30" height="112" rx="13" fill={BODY} />
              {[70, 96, 122].map(y => <rect key={y} x={x + 3} y={y} width="24" height="2.5" rx="1.25" fill={EDGE} />)}
              <rect x={x + 6} y="52" width="18" height="10" rx="5" fill={HI} opacity="0.85" />
            </g>
          ))}
          <rect x="96" y="150" width="18" height="7" rx="3.5" fill={ACC} />
        </g>
      )
    case 'bands':
      return (
        <g fill="none" strokeLinecap="round">
          <ellipse cx="100" cy="100" rx="56" ry="26" stroke={BODY} strokeWidth="11" />
          <ellipse cx="100" cy="100" rx="40" ry="18" stroke={EDGE} strokeWidth="9" />
          <ellipse cx="100" cy="100" rx="24" ry="11" stroke={ACC} strokeWidth="7" />
        </g>
      )
    case 'kettlebell':
      return (
        <g>
          <path d="M72 92a28 28 0 0 1 56 0" fill="none" stroke={EDGE} strokeWidth="13" strokeLinecap="round" />
          <path d="M66 110c0-16 15-24 34-24s34 8 34 24c0 26-12 44-34 44s-34-18-34-44z" fill={BODY} />
          <rect x="78" y="148" width="44" height="7" rx="3.5" fill={EDGE} />
          <text x="100" y="128" textAnchor="middle" fill={HI} fontFamily="var(--font-mono)" fontSize="19" fontWeight="600">12</text>
        </g>
      )
    case 'roller':
      return (
        <g>
          <rect x="40" y="74" width="120" height="52" rx="12" fill={BODY} />
          {[62, 82, 102, 122, 142].map(x => <rect key={x} x={x} y="80" width="7" height="40" rx="3.5" fill={EDGE} />)}
          <ellipse cx="40" cy="100" rx="11" ry="26" fill={EDGE} />
          <ellipse cx="160" cy="100" rx="11" ry="26" fill={ACC} />
          <ellipse cx="160" cy="100" rx="5" ry="12" fill={HI} opacity="0.85" />
        </g>
      )
    case 'mask':
      return (
        <g>
          <path d="M48 92c0-16 16-26 52-26s52 10 52 26c0 20-12 36-30 36-10 0-16-6-22-6s-12 6-22 6c-18 0-30-16-30-36z" fill={BODY} />
          <ellipse cx="74" cy="96" rx="15" ry="12" fill={EDGE} />
          <ellipse cx="126" cy="96" rx="15" ry="12" fill={EDGE} />
          <path d="M48 86C30 86 26 96 26 104" fill="none" stroke={ACC} strokeWidth="7" strokeLinecap="round" />
          <path d="M152 86c18 0 22 10 22 18" fill="none" stroke={ACC} strokeWidth="7" strokeLinecap="round" />
        </g>
      )
    case 'posture':
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M70 58c-22 10-26 40-10 58 12 14 36 14 48 0" stroke={BODY} strokeWidth="13" />
          <path d="M130 58c22 10 26 40 10 58-12 14-36 14-48 0" stroke={BODY} strokeWidth="13" />
          <rect x="88" y="104" width="24" height="34" rx="8" fill={EDGE} stroke="none" />
          <path d="M70 58h60" stroke={ACC} strokeWidth="9" />
        </g>
      )
    case 'mat':
      return (
        <g>
          <rect x="52" y="62" width="96" height="76" rx="10" fill={BODY} />
          <ellipse cx="52" cy="100" rx="13" ry="38" fill={EDGE} />
          <ellipse cx="52" cy="100" rx="6" ry="18" fill={ACC} />
          <ellipse cx="148" cy="100" rx="13" ry="38" fill="#4A5467" />
          <path d="M112 72v56" stroke={HI} strokeWidth="3" opacity="0.35" strokeLinecap="round" />
        </g>
      )
  }
}

export function ProductArt({ art, name, className = '' }: { art: Art; name: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${name}, product illustration`}>
      <rect width="200" height="200" rx="14" fill={GROUND[art]} />
      <ellipse cx="100" cy="170" rx="58" ry="9" fill="#0D1017" opacity="0.07" />
      <Shape art={art} />
    </svg>
  )
}
