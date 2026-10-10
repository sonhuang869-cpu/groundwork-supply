/**
 * The arithmetic the whole demo rests on.
 *
 * ROAS is the number everyone optimises and it cannot, on its own, tell you
 * whether a product makes money. Break-even ROAS is set by the margin, and the
 * margin is different for every product. A 4x product on thin margin can lose
 * to a 2.4x product on a fat one.
 */

import { FEE_FIXED_P, FEE_PCT, campaigns, type Campaign, type Product } from './catalogue'

export type Model = {
  priceP: number
  cogsP: number
  shipP: number
  feePct: number
  feeFixedP: number
  refundRate: number
}

export const modelOf = (p: Product): Model => ({
  priceP: p.priceP,
  cogsP: p.cogsP,
  shipP: p.shipP,
  feePct: FEE_PCT,
  feeFixedP: FEE_FIXED_P,
  refundRate: p.refundRate,
})

export type Unit = {
  /** Revenue actually kept, after refunds. */
  keptRevenueP: number
  feeP: number
  /** Everything except advertising. */
  contributionP: number
  /** The most we can pay to acquire an order and still break even. */
  breakEvenCpaP: number
  /** The ROAS below which this product loses money. */
  breakEvenRoas: number
  marginPct: number
}

/**
 * We ship the goods and pay the processing fee on every order, including the
 * ones later refunded, but we only keep revenue on the ones we do not refund.
 */
export function unitEconomics(m: Model): Unit {
  const keptRevenueP = Math.round(m.priceP * (1 - m.refundRate))
  const feeP = Math.round(m.priceP * m.feePct) + m.feeFixedP
  const contributionP = keptRevenueP - m.cogsP - m.shipP - feeP
  return {
    keptRevenueP,
    feeP,
    contributionP,
    breakEvenCpaP: contributionP,
    // Spending exactly the contribution on ads is break-even, so the
    // break-even ROAS is price divided by that contribution.
    breakEvenRoas: contributionP > 0 ? m.priceP / contributionP : Infinity,
    marginPct: m.priceP > 0 ? contributionP / m.priceP : 0,
  }
}

/** What an order is worth once the real cost of acquiring it is paid. */
export function profitPerOrderP(m: Model, cpaP: number) {
  return unitEconomics(m).contributionP - cpaP
}

/* ------------------------------------------------------------------ */

export type Perf = {
  spendP: number
  impressions: number
  clicks: number
  orders: number
  revenueP: number
  roas: number
  cpaP: number
  cpcP: number
  ctr: number
  cvr: number
}

const EMPTY: Perf = {
  spendP: 0, impressions: 0, clicks: 0, orders: 0, revenueP: 0,
  roas: 0, cpaP: 0, cpcP: 0, ctr: 0, cvr: 0,
}

/** Revenue is derived from orders and price, never stored separately. */
export function perfOf(rows: Campaign[], priceOf: (slug: string) => number): Perf {
  if (!rows.length) return EMPTY
  const spendP = rows.reduce((a, c) => a + c.spendP, 0)
  const impressions = rows.reduce((a, c) => a + c.impressions, 0)
  const clicks = rows.reduce((a, c) => a + c.clicks, 0)
  const orders = rows.reduce((a, c) => a + c.orders, 0)
  const revenueP = rows.reduce((a, c) => a + c.orders * priceOf(c.productSlug), 0)
  return {
    spendP, impressions, clicks, orders, revenueP,
    roas: spendP ? revenueP / spendP : 0,
    cpaP: orders ? Math.round(spendP / orders) : 0,
    cpcP: clicks ? Math.round(spendP / clicks) : 0,
    ctr: impressions ? clicks / impressions : 0,
    cvr: clicks ? orders / clicks : 0,
  }
}

export const campaignsFor = (slug: string) => campaigns.filter(c => c.productSlug === slug)

/** Contribution after advertising, for a product, across its campaigns. */
export function netProfitP(p: Product, perf: Perf) {
  const contribution = unitEconomics(modelOf(p)).contributionP
  return perf.orders * contribution - perf.spendP
}
