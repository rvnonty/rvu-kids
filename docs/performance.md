# RVU Kids — performance budgets and verification

## Acceptance targets

| Metric | Good threshold | Where to verify |
| --- | --- | --- |
| Largest Contentful Paint | <= 2.5 seconds | Lighthouse lab + CrUX field |
| Interaction to Next Paint | <= 200 ms | CrUX / Search Console field |
| Cumulative Layout Shift | <= 0.1 | Lighthouse lab + CrUX field |

Use the 75th percentile of real page views, split between mobile and desktop.
A passing local lab run is not proof of field performance.

## Running the performance audit

Use GitHub Actions > "Performance and accessibility (manual)" > Run workflow.
It builds the static site, serves it locally, and runs Lighthouse on home,
alphabet and preview. It uploads JSON reports and checks LCP and CLS budgets
using scripts/check-vitals.mjs.

INP is not audited by Lighthouse in this job. Use PageSpeed Insights real-user
data or the Search Console Core Web Vitals report for INP when there is
enough traffic. If field data is unavailable, perform repeated real-device
tests without inventing a score.

## Image checks

- Exactly five selected preview WebP pages
- Each reserves a 900:1273 aspect ratio
- Lightweight decorative thumbnails are drawn behind real images while loading
- Scroll-test Android Chrome and iOS Safari, and inspect all load errors
- Avoid lazy loading any above-the-fold LCP image
- Do not expose the entire book or additional preview pages

## Offline packs

Only lessons A and B can optionally be saved by a parent, not the whole book.
The pack includes necessary pages, scripts, matching word illustrations and
the existing prerecorded audio (independent phonetic review still pending). Fish and Fork are excluded.
Test real-device offline behavior before treating it as verified.
