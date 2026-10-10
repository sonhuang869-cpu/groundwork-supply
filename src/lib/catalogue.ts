/**
 * One source of truth. The storefront, the dashboard, the campaign table and
 * the economics screen all read from here, so every number on the site
 * reconciles with every other number.
 *
 * All money is integer pence. Never floats.
 */

export type Status = 'live' | 'testing' | 'shortlist'

export type Product = {
  slug: string
  name: string
  short: string
  category: string
  /** Base name of the photograph in /public/shop. */
  img: string
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
    slug: 'studio-yoga-mat',
    name: 'Studio Mat, 5 mm',
    short: 'Natural rubber, 5 mm, grips when it is wet.',
    category: 'Studio',
    img: 'studio-yoga-mat',
    status: 'live',
    priceP: 7900, compareAtP: 11900, cogsP: 2300, shipP: 420, refundRate: 0.04,
    supplierDays: 11, rating: 4.7, reviews: 2184,
    colours: ['Clay', 'Forest'],
    bullets: [
      'Natural rubber, not PVC, so it grips when damp',
      '5 mm, 183 by 66 cm, heavier than a travel mat',
      'Closed cell face, sweat does not soak in',
      'Comes with a carry strap',
    ],
  },
  {
    slug: 'adjustable-dumbbell',
    name: 'Adjustable Dumbbell, 20 kg',
    short: 'One handle, plates from 2.5 to 20 kg.',
    category: 'Strength',
    img: 'adjustable-dumbbell',
    status: 'live',
    priceP: 18900, compareAtP: 24900, cogsP: 7400, shipP: 950, refundRate: 0.06,
    supplierDays: 16, rating: 4.6, reviews: 418,
    colours: ['Black'],
    bullets: [
      'Plates from 2.5 kg to 20 kg on one handle',
      'Knurled chrome bar, 30 mm',
      'Spin collars, no spanner needed',
      'Replaces nine fixed dumbbells in a flat',
    ],
  },
  {
    slug: 'resistance-band-set',
    name: 'Resistance Band Set',
    short: 'Five tubes, 5 to 50 kg, handles and anchor.',
    category: 'Strength',
    img: 'resistance-band-set',
    status: 'live',
    priceP: 2400, compareAtP: 3600, cogsP: 620, shipP: 210, refundRate: 0.02,
    supplierDays: 9, rating: 4.8, reviews: 3691,
    colours: ['Standard set'],
    bullets: [
      'Five tubes from 5 kg to 50 kg, stackable',
      'Door anchor, padded handles and ankle straps',
      'Natural latex, not rubber blend',
      'Packs into a bag the size of a lunchbox',
    ],
  },
  {
    slug: 'cast-kettlebell',
    name: 'Cast Kettlebell, 16 kg',
    short: 'Single cast, powder coated, flat base.',
    category: 'Strength',
    img: 'cast-kettlebell',
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
    slug: 'insulated-bottle',
    name: 'Insulated Bottle, 750 ml',
    short: 'Double wall steel, cold for 24 hours.',
    category: 'Everyday',
    img: 'insulated-bottle',
    status: 'live',
    priceP: 3400, compareAtP: 4500, cogsP: 950, shipP: 380, refundRate: 0.02,
    supplierDays: 10, rating: 4.7, reviews: 1507,
    colours: ['Coral', 'Mint', 'Lilac'],
    bullets: [
      'Double wall steel, cold 24 hours or hot 12',
      '750 ml, fits a standard bottle cage',
      'Powder coat that does not chip in a kit bag',
      'Wide mouth, takes ice cubes',
    ],
  },
  {
    slug: 'sleep-mask',
    name: 'Silk Sleep Mask',
    short: 'Mulberry silk, blocks light at the nose.',
    category: 'Recovery',
    img: 'sleep-mask',
    status: 'testing',
    priceP: 1900, compareAtP: 2900, cogsP: 480, shipP: 160, refundRate: 0.05,
    supplierDays: 8, rating: 4.5, reviews: 884,
    colours: ['Blush'],
    bullets: [
      'Mulberry silk, both faces',
      'Shaped nose bridge, blocks light from below',
      'Adjustable band that does not tangle hair',
      'Weighs 32 g',
    ],
  },
  {
    slug: 'weighted-jump-rope',
    name: 'Weighted Jump Rope',
    short: 'Removable 150 g weights in each handle.',
    category: 'Conditioning',
    img: 'weighted-jump-rope',
    status: 'testing',
    priceP: 2900, compareAtP: 4200, cogsP: 840, shipP: 230, refundRate: 0.09,
    supplierDays: 9, rating: 4.2, reviews: 1296,
    colours: ['Amber'],
    bullets: [
      'Removable 150 g weight in each handle',
      'Cuts to length, 3 m of coated cable',
      'Sealed bearings, no kinking',
      'Handles stay dry in the hand',
    ],
  },
  {
    slug: 'cork-yoga-blocks',
    name: 'Cork Block Pair',
    short: 'Two blocks, solid cork, 23 by 15 by 7.5 cm.',
    category: 'Studio',
    img: 'cork-yoga-blocks',
    status: 'shortlist',
    priceP: 4200, compareAtP: 5800, cogsP: 1650, shipP: 640, refundRate: 0.03,
    supplierDays: 13, rating: 4.6, reviews: 207,
    colours: ['Cork'],
    bullets: [
      'Solid cork, not foam, so they take weight',
      'Two blocks, 23 by 15 by 7.5 cm each',
      'Rounded edges, comfortable under a palm',
      'Grips on a mat without sliding',
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
  { id: 'c1', name: 'Studio Mat · Broad · UK',        platform: 'meta',   productSlug: 'studio-yoga-mat', state: 'active',   spendP: 412_600, impressions: 1_842_000, clicks: 31_900, orders: 162 },
  { id: 'c2', name: 'Studio Mat · Retarget 30d',      platform: 'meta',   productSlug: 'studio-yoga-mat', state: 'active',   spendP:  88_400, impressions:   214_000, clicks:  9_100, orders:  71 },
  { id: 'c3', name: 'Studio Mat · Spark Ads',         platform: 'tiktok', productSlug: 'studio-yoga-mat', state: 'active',   spendP: 196_200, impressions: 2_410_000, clicks: 24_600, orders:  64 },
  { id: 'c4', name: 'Bands · Broad · UK',           platform: 'tiktok', productSlug: 'resistance-band-set', state: 'active',   spendP: 143_800, impressions: 3_120_000, clicks: 41_200, orders: 270 },
  { id: 'c5', name: 'Bands · Lookalike 2%',         platform: 'meta',   productSlug: 'resistance-band-set', state: 'active',   spendP:  61_200, impressions:   498_000, clicks: 12_400, orders:  96 },
  { id: 'c6', name: 'Dumbbell · Broad · UK',           platform: 'meta',   productSlug: 'adjustable-dumbbell',      state: 'active',   spendP: 388_900, impressions:   742_000, clicks: 14_800, orders:  47 },
  { id: 'c7', name: 'Dumbbell · Retarget 14d',         platform: 'meta',   productSlug: 'adjustable-dumbbell',      state: 'learning', spendP:  74_100, impressions:    96_000, clicks:  3_900, orders:  12 },
  { id: 'c8', name: 'Kettlebell · Broad · UK',      platform: 'meta',   productSlug: 'cast-kettlebell',     state: 'active',   spendP: 171_300, impressions:   612_000, clicks: 11_700, orders:  91 },
  { id: 'c9', name: 'Bottle · Broad · UK',          platform: 'tiktok', productSlug: 'insulated-bottle',         state: 'active',   spendP:  96_400, impressions: 1_380_000, clicks: 18_900, orders: 118 },
  { id: 'c10', name: 'Jump rope · Creative test v4',  platform: 'tiktok', productSlug: 'weighted-jump-rope',        state: 'learning', spendP:  58_700, impressions:   910_000, clicks: 13_100, orders:  54 },
  { id: 'c11', name: 'Sleep mask · Broad · UK',     platform: 'meta',   productSlug: 'sleep-mask',          state: 'paused',   spendP:  31_900, impressions:   287_000, clicks:  6_400, orders:  38 },
]

export const PERIOD = '1 to 31 October 2026'

export const gbp = (p: number) =>
  `£${(p / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Whole pounds, for headline figures where pennies are noise. */
export const gbp0 = (p: number) =>
  `£${Math.round(p / 100).toLocaleString('en-GB')}`

export const pct = (n: number, dp = 1) => `${(n * 100).toFixed(dp)}%`
