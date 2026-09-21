# RVU Kids

Bilingual Arabic/English storefront for **Rvu Alphabet Book**, 96 pages, ages 3–6. Price: **200 EGP per copy**, plus verified shipping. Printed on demand in Mit Ghamr, Egypt.

## Learning hub (21 September 2026)

The deployed GitHub Pages branch now includes:

- `/learn/` — Learning Hub linking A–Z and 15 separate Everyday English units.
- `/learn/alphabet/a/` through `/learn/alphabet/z/` — 26 stable lesson URLs populated from the approved 96-page curriculum.
- `/learn/sentences/` and 15 individual sentence lessons, including Phase 1.2 curriculum corrections.
- `/preview/` — a strict five-physical-page preview (cover plus four selected actual pages), with an accessible zoom viewer.
- `/books/alphabet/` — dedicated product page, retaining 200 EGP + shipping.
- `/learn/qr-map.json` — 41 stable QR destinations, with child-facing `printedPages` (A 1–2, M 25–26, Feelings 53–54) and separate `pdfPages` for the three PDF-only front-matter pages.
- `/learn/audio-manifest.json` — production checklist for 244 expected recordings (26 letter names + 26 letter sounds + 101 words + 27 alphabet sentences + 64 Everyday English sentences).
- `tests/learning.test.mjs` and GitHub Actions checks for content counts, 41 direct links and the five-page preview cap.

**Outstanding:** 244 reviewed audio files are **not present in the repository**. The manifest contains null audio assets deliberately; no device voice or nonfunctional audio buttons are passed off as approved American pronunciation. Existing printed PDF has **not** been altered or embedded with QR codes; mapping and downloadable QR images are separate preparation assets. All 41 lessons render approved text. Where an exact artwork cutout is not available, small word pictograms are memory cues; they are not claimed to be images from the workbook.

**Orders:** The active public form opens WhatsApp username `@n2nty` with an order message drafted from the visitor's input. The visitor must review it and press Send in WhatsApp. The site never reports an order received or payment verified. Payment choices are InstaPay and Vodafone Cash only. Shipping and the final total are confirmed privately before payment. No customer data is submitted to this GitHub Pages frontend or stored in the repository.

## Current state

Storefront and Learning Hub are deployed at the configured domain. Direct WhatsApp ordering is enabled; the independent private-order API and database remain disabled. GitHub Pages build success should be complemented with browser verification of the live WhatsApp handoff.

The public website currently deploys via GitHub Pages on `rvu-kids.company`. The Cloudflare Worker and D1 files are a separate, unconnected proposal for private order processing; do not migrate the domain or enable order submission without the owner's approval and end-to-end testing.

## QA review of the current release

- The public preview shows **exactly five unique physical pages**: cover, letter A teaching page, letter A practice, Feelings, and letter M teaching page. The old review image was removed from public assets.
- All 26 alphabet lessons, all 15 Everyday English units, and the `/learn/alphabet/` index have stable direct URLs.
- Arabic/English switching is shared across the storefront and learning routes, including explicit `?lang=` URLs.
- The mini visual word check only appears when at least two illustrated visual clues exist; it never substitutes for the locked workbook exercises.
- CI builds `dist`, checks JavaScript syntax, verifies curriculum counts, checks site navigation and checks preview files.
- Search-index basics include `sitemap.xml` with the main sections and 41 lessons.
- Letter M preview uses the approved replacement high-resolution artwork (1086 × 1448 native pixels); the five-page preview limit remains unchanged.
- Approved American English audio recordings and inserting the QR codes in the print-ready PDF remain separate pending work. The public site clearly labels the audio feature as coming soon.

## Local build and checks

Use Node.js 24 or later.

```sh
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Static storefront uses WhatsApp instead of the disabled `/api/config` and `/api/orders` backend. Completing the form only constructs a message: the customer sends it explicitly from WhatsApp. This frontend never simulates a completed order or verified payment.

## Optional private-order-service setup (only after explicit approval)

1. Build `dist/`. Deploy only that directory as static assets, plus `server/worker.mjs` as the Worker.
2. Create a dedicated private D1 database for RVU Kids, apply `server/schema.sql`, and bind it to the Worker as `DB`. Add the real D1 identifier to deployment configuration once issued. Never invent identifiers.
3. Generate a private random `RATE_LIMIT_SECRET` in the hosting provider's secret store. Never commit it.
4. Confirm the owner can privately inspect and process orders in the D1 dashboard, and agree a routine for checking incoming requests. There are no email or WhatsApp notifications yet.
5. Populate `shipping_rates` only with owner-confirmed rates. The table is empty by default. Rates apply per order; if fees depend on quantity, weight or address, leave that governorate disabled and quote manually. Never use zero for an unknown price.
6. Set `ORDERS_ENABLED` to `true` only after private storage and real submission have been verified. Keep it `false` for any public preview.
7. Preserve the live GitHub Pages custom domain and DNS. This Worker deployment is not enabled by these repository files; a private-order service requires a separately approved secure integration and a verified endpoint. Never change DNS as an incidental test.
8. Run a clearly labeled synthetic test, verify its saved record privately, then remove only that synthetic record. Verify customer form errors and mobile/desktop rendering before launch.

## Order operations

New orders are always `pending_review`. Review delivery details; privately communicate the shipping quote, final total and payment destination. Use `awaiting_payment` while waiting. Only a human who verifies actual receipt of funds may record `payment_verified_at`, `payment_verified_by`, and change the order to `paid_verified`. Printing and shipping follow that step. A screenshot alone is not payment verification.

The public API has no order-list or order-detail endpoint, no payment verification endpoint, and never returns customer personal data. Order creation uses prepared SQL, server-calculated prices, same-origin JSON requests, size/field limits, consent validation, rate limiting, and idempotent retries. Database constraints prevent fulfillment states without a verification record. Restrict database/admin access to the owner; never export customer records into this repository.

## Content and privacy

Only five selected physical preview pages from the supplied book are included; the complete saleable PDF is not published. Reviewed American English audio is described as a planned feature, not active playback. The QR link map distinguishes printed page numbers from PDF physical indices; QR codes have not been embedded in the physical PDF. Physical paper, size and binding have not been invented. No bank account details, transfer screenshots, customer records or API keys belong in source control. No analytics trackers or customer local-storage persistence are used. Google Fonts is an external font resource.

Design and book artwork belong to RVU Kids/their respective rights holders. No redistribution license is granted by this repository.
