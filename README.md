# Groundwork Supply

A D2C recovery and strength store, plus the operator console behind it.

Built for an e-commerce brief that covers the whole loop: build the store, design
the landing page, research the product, run Meta and TikTok, and cut the CPA. The
interesting part of that loop is the last step, because the number everyone
optimises cannot answer the question everyone is asking.

## The argument

**ROAS cannot tell you whether a product makes money.** Break-even ROAS is set by
the margin, and the margin is different for every product in the catalogue. In
this account break-even ranges from **1.66x to 2.99x**, so a single house target
is guaranteed to be wrong for most of the range.

What that looks like in the campaign table:

| Campaign | ROAS | Break-even | Profit / order |
|---|---|---|---|
| Massager · Spark Ads | 2.58x | 1.69x | **£16.15** |
| Boots · Broad | 2.28x | 2.10x | **£7.39** |
| Kettlebell · Broad | 2.60x | 2.99x | **−£2.42** |

The kettlebell has the *highest* ROAS of the three and is the only one losing
money. It clears the usual "keep anything above 2x" rule and still costs £220.60
over the month. Turning that one campaign off lifts net profit with no new spend.

Blended across the account it reads 3.14x, which looks healthy and hides this
entirely.

## What is in it

**Storefront** `/` and `/p/:slug` — product pages with variants, a quantity
stepper, a real bundle cross-sell that prices the saving, a persistent basket
drawer with a free-delivery threshold, and an order summary that updates as you
change the options.

**Landing page** `/lp/:slug` — a direct-response page, not a product page. No
navigation away from the offer, proof stacked in the order a stranger asks for
it, one action repeated down the page.

**Console** `/console` — revenue against ad spend on one shared scale, and a
per-product table carrying break-even next to actual.

**Campaigns** `/console/campaigns` — Meta and TikTok in one table, filterable and
sortable, each line judged against its own product's break-even CPA rather than a
house target.

**Unit economics** `/console/products` — the model itself. Change the price, the
cost of goods, shipping, fees, refunds or the CPA and watch the break-even move.
The bar shows where every pound of the price goes, with a dashed line marking
what the customer actually paid, so a loss is visible as the bar running past it.

## Running it

```
npm install
npm run dev
```

## Stack

Vite, React, TypeScript, Tailwind v4, React Router. No backend. Money is integer
pence throughout and nothing is stored twice: campaign revenue is derived from
orders times price, and the daily chart is apportioned from the campaign totals
by largest remainder, so the chart, the tables and the store cannot disagree.

## Design notes

No stock photography. The eight products are drawn as vector silhouettes sharing
one ground, one stroke weight and one palette, so the grid reads as one brand.
Figures are set in a monospace with tabular numerals so a column of money lines
up.

## Checks

A data check runs the economics before any UI exists: the arithmetic is verified
against hand-worked figures, the chart is asserted to sum to the campaign totals
*and* to have an honest shape, and the ROAS-versus-profit inversion is asserted
rather than asserted-to-be-true in prose.

A headless sweep then loads nine routes at 390 px and 1440 px and asserts no
horizontal overflow, no console errors, no unlabelled or collapsed artwork, and
contrast measured against each element's composited background. On top of that it
exercises variants, the bundle, the basket across a refresh, the platform filter,
sorting, the live economics model, the reset, the landing page structure, the 404
and the first tab stop.

Prototype. Representative brand, products, prices and figures.
