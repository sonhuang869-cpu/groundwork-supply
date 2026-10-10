/**
 * One source of truth. The storefront, the dashboard, the campaign table and
 * the economics screen all read from here, so every number on the site
 * reconciles with every other number.
 *
 * All money is integer pence. Never floats.
 */

export type Art = 'massager' | 'roller' | 'bands' | 'kettlebell' | 'boots' | 'mask' | 'posture' | 'mat'
export type Status = 'live' | 'testing' | 'shortlist'

export type Product = {
  slug: string
  name: string
  short: string
  category: string
  art: Art
  status: Status
  /** Retail price, ex delivery. */
  priceP: number
  compareAtP: number | null
  /** What the unit costs us landed from the supplier. */
  cogsP: number
  /** What it costs us to get it to the customer. */
  shipP: number
  /** Refunds and chargebacks, as a share of orders. */
  refundRate: number
  supplierDays: number
  rating: number
  reviews: number
  colours: string[]
  bullets: string[]
}

/** Payment processing, the default model on the economics screen. */
export const FEE_PCT = 0.02
export const FEE_FIXED_P = 25

export const products: Product[] = [
  {
    slug: 'percussion-massager',
    name: 'Percussion Massager',
    short: 'Six speeds, four heads, two hours a charge.',
    category: 'Recovery',
    art: 'massager',
    status: 'live',
    priceP: 7900, compareAtP: 11900, cogsP: 2300, shipP: 420, refundRate: 0.04,
    supplierDays: 11, rating: 4.7, reviews: 2184,
    colours: ['Graphite', 'Sand', 'Navy'],
    bullets: [
      'Six speeds, 1800 to 3200 percussions a minute',
      'Four heads for calf, back, shoulder and deep tissue',
      'Two hours a charge, USB-C',
      'Quiet enough for a flat with thin walls',
    ],
  },
  {
    slug: 'recovery-boots',
    name: 'Compression Recovery Boots',
    short: 'Four chambers a leg, twenty minute cycle.',
    category: 'Recovery',
    art: 'boots',
    status: 'live',
    priceP: 18900, compareAtP: 24900, cogsP: 7400, shipP: 950, refundRate: 0.06,
    supplierDays: 16, rating: 4.6, reviews: 418,
    colours: ['Graphite'],
    bullets: [
      'Four chambers a leg, inflating ankle upward',
      'Six programmes, twenty to forty minutes',
      'Fits up to a 34 inch inseam',
      'Folds into the supplied bag',
    ],
  },
  {
    slug: 'resistance-band-set',
    name: 'Resistance Band Set',
    short: 'Five bands, 5 to 50 kg, with door anchor.',
    category: 'Strength',
    art: 'bands',
    status: 'live',
    priceP: 2400, compareAtP: 3600, cogsP: 620, shipP: 210, refundRate: 0.02,
    supplierDays: 9, rating: 4.8, reviews: 3691,
    colours: ['Multi'],
    bullets: [
      'Five bands from 5 kg to 50 kg',
      'Door anchor, handles and ankle straps',
      'Natural latex, not rubber blend',
      'Packs into a bag the size of a lunchbox',
    ],
  },
  {
    slug: 'kettlebell-12kg',
    name: 'Cast Kettlebell, 12 kg',
    short: 'Single cast, powder coated, flat base.',
    category: 'Strength',
    art: 'kettlebell',
    status: 'live',
    priceP: 4900, compareAtP: null, cogsP: 2100, shipP: 890, refundRate: 0.03,
    supplierDays: 14, rating: 4.9, reviews: 612,
    colours: ['Black'],
    bullets: [
      'Single cast, no welded handle',
      'Powder coat that holds chalk',
      'Flat base, stands without a rack',
      '35 mm handle, fits two hands',
    ],
  },
  {
    slug: 'foam-roller',
    name: 'Grid Foam Roller',
    short: 'EVA core, 33 cm, three surface zones.',
    category: 'Recovery',
    art: 'roller',
    status: 'live',
    priceP: 3400, compareAtP: 4500, cogsP: 950, shipP: 380, refundRate: 0.02,
    supplierDays: 10, rating: 4.7, reviews: 1507,
    colours: ['Charcoal', 'Sand'],
    bullets: [
      'EVA core that does not flatten',
      'Three surface zones, flat to deep',
      '33 cm, fits in a kit bag',
      'Holds up to 150 kg',
    ],
  },
  {
    slug: 'sleep-mask',
    name: 'Contoured Sleep Mask',
    short: 'Moulded cups, nothing touches the eye.',
    category: 'Sleep',
    art: 'mask',
    status: 'testing',
    priceP: 1900, compareAtP: 2900, cogsP: 480, shipP: 160, refundRate: 0.05,
    supplierDays: 8, rating: 4.5, reviews: 884,
    colours: ['Black', 'Sand'],
    bullets: [
      'Moulded cups, nothing touches the eyelid',
      'Blocks light at the nose bridge',
      'Washable, holds shape',
      'Weighs 48 g',
    ],
  },
  {
    slug: 'posture-band',
    name: 'Posture Support Band',
    short: 'Figure of eight, adjustable, worn under a shirt.',
    category: 'Support',
    art: 'posture',
    status: 'testing',
    priceP: 2900, compareAtP: 4200, cogsP: 840, shipP: 230, refundRate: 0.09,
    supplierDays: 9, rating: 4.2, reviews: 1296,
    colours: ['Black', 'Sand'],
    bullets: [
      'Figure of eight, no waist strap',
      'Adjusts from 28 to 46 inch chest',
      'Flat seams, wearable under a shirt',
      'Breathable backing panel',
    ],
  },
  {
    slug: 'yoga-mat',
    name: 'Cork Yoga Mat',
    short: 'Cork face, rubber base, 4.5 mm.',
    category: 'Studio',
    art: 'mat',
    status: 'shortlist',
    priceP: 4200, compareAtP: 5800, cogsP: 1650, shipP: 640, refundRate: 0.03,
    supplierDays: 13, rating: 4.6, reviews: 207,
    colours: ['Cork'],
    bullets: [
      'Cork face that grips when damp',
      'Natural rubber base, not PVC',
      '4.5 mm, 183 by 61 cm',
      'Comes with a carry strap',
    ],
  },
]

export const bySlug = (s: string) => products.find(p => p.slug === s)
export const live = () => products.filter(p => p.status === 'live')

/* ------------------------------------------------------------------ */
/* Campaigns. Orders and revenue here are what the dashboard reports,  */
/* so the store's sales figures and the ad figures cannot drift apart. */

export type Platform = 'meta' | 'tiktok'

export type Campaign = {
  id: string
  name: string
  platform: Platform
  productSlug: string
  state: 'active' | 'learning' | 'paused'
  spendP: number
  impressions: number
  clicks: number
  orders: number
}

export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Massager · Broad · UK',        platform: 'meta',   productSlug: 'percussion-massager', state: 'active',   spendP: 412_600, impressions: 1_842_000, clicks: 31_900, orders: 162 },
  { id: 'c2', name: 'Massager · Retarget 30d',      platform: 'meta',   productSlug: 'percussion-massager', state: 'active',   spendP:  88_400, impressions:   214_000, clicks:  9_100, orders:  71 },
  { id: 'c3', name: 'Massager · Spark Ads',         platform: 'tiktok', productSlug: 'percussion-massager', state: 'active',   spendP: 196_200, impressions: 2_410_000, clicks: 24_600, orders:  64 },
  { id: 'c4', name: 'Bands · Broad · UK',           platform: 'tiktok', productSlug: 'resistance-band-set', state: 'active',   spendP: 143_800, impressions: 3_120_000, clicks: 41_200, orders: 270 },
  { id: 'c5', name: 'Bands · Lookalike 2%',         platform: 'meta',   productSlug: 'resistance-band-set', state: 'active',   spendP:  61_200, impressions:   498_000, clicks: 12_400, orders:  96 },
  { id: 'c6', name: 'Boots · Broad · UK',           platform: 'meta',   productSlug: 'recovery-boots',      state: 'active',   spendP: 388_900, impressions:   742_000, clicks: 14_800, orders:  47 },
  { id: 'c7', name: 'Boots · Retarget 14d',         platform: 'meta',   productSlug: 'recovery-boots',      state: 'learning', spendP:  74_100, impressions:    96_000, clicks:  3_900, orders:  12 },
  { id: 'c8', name: 'Kettlebell · Broad · UK',      platform: 'meta',   productSlug: 'kettlebell-12kg',     state: 'active',   spendP: 171_300, impressions:   612_000, clicks: 11_700, orders:  91 },
  { id: 'c9', name: 'Roller · Broad · UK',          platform: 'tiktok', productSlug: 'foam-roller',         state: 'active',   spendP:  96_400, impressions: 1_380_000, clicks: 18_900, orders: 118 },
  { id: 'c10', name: 'Posture · Creative test v4',  platform: 'tiktok', productSlug: 'posture-band',        state: 'learning', spendP:  58_700, impressions:   910_000, clicks: 13_100, orders:  54 },
  { id: 'c11', name: 'Sleep mask · Broad · UK',     platform: 'meta',   productSlug: 'sleep-mask',          state: 'paused',   spendP:  31_900, impressions:   287_000, clicks:  6_400, orders:  38 },
]

export const PERIOD = '1 to 31 October 2026'

export const gbp = (p: number) =>
  `£${(p / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Whole pounds, for headline figures where pennies are noise. */
export const gbp0 = (p: number) =>
  `£${Math.round(p / 100).toLocaleString('en-GB')}`

export const pct = (n: number, dp = 1) => `${(n * 100).toFixed(dp)}%`
