# RVU Kids

Bilingual Arabic/English storefront for **Rvu Alphabet Book**, 96 pages, ages 3–6. Price: **200 EGP per copy**, plus verified shipping. Printed on demand in Mit Ghamr, Egypt.

## Learning hub (21 September 2026)

The deployed GitHub Pages branch now includes:

- `/learn/` — Learning Hub linking A–Z and 15 separate Everyday English units.
- `/learn/alphabet/a/` through `/learn/alphabet/z/` — 26 stable lesson URLs populated from the approved 96-page curriculum.
- `/learn/sentences/` and 15 individual sentence lessons, including Phase 1.2 curriculum corrections.
- `/preview/` — a strict five-physical-page preview (cover plus four selected actual pages), with an accessible zoom viewer.
- `/books/alphabet/` — dedicated product page, retaining 200 EGP + shipping.
- `/learn/qr-map.json` — 41 stable QR destinations paired with physical PDF page numbers.
- `/learn/audio-manifest.json` — production checklist for 244 expected recordings (26 letter names + 26 letter sounds + 101 words + 27 alphabet sentences + 64 Everyday English sentences).
- `tests/learning.test.mjs` and GitHub Actions checks for content counts, 41 direct links and the five-page preview cap.

**Outstanding:** 244 reviewed audio files are **not present in the repository**. The manifest contains null audio assets deliberately; no device voice or nonfunctional audio buttons are passed off as approved American pronunciation. Existing printed PDF has **not** been altered or embedded with QR codes; mapping and downloadable QR images are separate preparation assets. All 41 lessons render approved text. Where an exact artwork cutout is not available, small word pictograms are memory cues; they are not claimed to be images from the workbook.

**Orders:** The static GitHub Pages frontend is a public preview. Backend source exists but has no provisioned private database or enabled order API; the public form remains disabled until a tested private integration is approved. Do not report checkout/payment success or collect customer information through an unsecured workaround.

## Current state

Storefront and Learning Hub source are implemented and the GitHub Pages build is deployed to the configured domain. Private database provisioning and live order activation remain pending. GitHub Pages deployment success does not independently establish that DNS and HTTPS are reachable in every browser.

The proposed deployment is Cloudflare Workers with static assets and a private D1 database. **This alternative requires the owner's approval before deployment.** GitHub Pages is not the production host: its published limits prohibit sites primarily facilitating commercial transactions. See https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits .

## Local build and checks

Use Node.js 24 or later.

```sh
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Static-only preview deliberately disables order submission when `/api/config` is unavailable. It never simulates a successful order.

## Production setup after hosting approval

1. Build `dist/`. Deploy only that directory as static assets, plus `server/worker.mjs` as the Worker.
2. Create a dedicated private D1 database for RVU Kids, apply `server/schema.sql`, and bind it to the Worker as `DB`. Add the real D1 identifier to deployment configuration once issued. Never invent identifiers.
3. Generate a private random `RATE_LIMIT_SECRET` in the hosting provider's secret store. Never commit it.
4. Confirm the owner can privately inspect and process orders in the D1 dashboard, and agree a routine for checking incoming requests. There are no email or WhatsApp notifications yet.
5. Populate `shipping_rates` only with owner-confirmed rates. The table is empty by default. Rates apply per order; if fees depend on quantity, weight or address, leave that governorate disabled and quote manually. Never use zero for an unknown price.
6. Set `ORDERS_ENABLED` to `true` only after private storage and real submission have been verified. Keep it `false` for any public preview.
7. Connect `rvu-kids.company` and `www` to the approved hosting provider using its issued DNS values. Preserve all unrelated DNS records. Verify valid HTTPS on both, a canonical redirect, and then add the canonical URL/sitemap metadata.
8. Run a clearly labeled synthetic test, verify its saved record privately, then remove only that synthetic record. Verify customer form errors and mobile/desktop rendering before launch.

## Order operations

New orders are always `pending_review`. Review delivery details; privately communicate the shipping quote, final total and payment destination. Use `awaiting_payment` while waiting. Only a human who verifies actual receipt of funds may record `payment_verified_at`, `payment_verified_by`, and change the order to `paid_verified`. Printing and shipping follow that step. A screenshot alone is not payment verification.

The public API has no order-list or order-detail endpoint, no payment verification endpoint, and never returns customer personal data. Order creation uses prepared SQL, server-calculated prices, same-origin JSON requests, size/field limits, consent validation, rate limiting, and idempotent retries. Database constraints prevent fulfillment states without a verification record. Restrict database/admin access to the owner; never export customer records into this repository.

## Content and privacy

Only selected previews from the supplied book are included; the complete saleable PDF is not published. Audio playback is explicitly not promised until reviewed assets are uploaded; the QR link mapping is prepared but QR codes have not been embedded in the physical PDF. Physical paper, size and binding have not been invented. No bank account details, transfer screenshots, customer records or API keys belong in source control. No analytics trackers or customer local-storage persistence are used. Google Fonts is an external font resource.

Design and book artwork belong to RVU Kids/their respective rights holders. No redistribution license is granted by this repository.
