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
| Studio Mat · Spark Ads | 2.58x | 1.69x | **£16.15** |
| Dumbbell · Broad | 2.28x | 2.10x | **£7.39** |
| Kettlebell · Broad | 2.60x | 2.99x | **-£2.42** |

The kettlebell has the *highest* ROAS of the three and is the only one losing
money. A 16 kg lump of cast iron costs £8.90 to ship, which is what eats the
margin. It clears the usual "keep anything above 2x" rule and still costs
£220.60 over the month. Turning that one campaign off lifts net profit with no
new spend.

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

## Photography

Real product photography, sourced from Unsplash, whose licence permits
commercial use without permission or attribution. Every image was inspected
before selection, then resized and converted to WebP and committed to
`public/shop`, so the store serves its own assets and there is no third party in
the critical path. The whole set is 1.8 MB across 43 files.

Each product has a main shot plus two detail views, generated as subject
anchored zoom crops of the same photograph rather than position crops, because a
top or bottom crop can leave the product out of frame entirely.

Images declare `width` and `height` so nothing reflows while they load, carry
`srcset` at 200, 600 and 1000 px, and fall back to a sized, labelled box if a
file is ever missing.

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
exercises variants, the gallery, the bundle, the basket across a refresh, the
platform filter, sorting, the live economics model, the reset, the landing page
structure, the 404 and the first tab stop.

Images are checked by decoding them, not by looking at the layout: a broken
`<img>` still occupies its box. The sweep asserts every photograph decodes, has
alt text, reserves its space, and is not being squashed out of its own aspect
ratio.

Prototype. Representative brand, products, prices and figures. Photography
from Unsplash under the Unsplash licence.
