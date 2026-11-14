# RVU Kids hero motion release — 14 November 2026

## Included in source
- Storefront shows the user-confirmed **100-page** edition; revised printed pages beyond the older 96-page curriculum source are **not yet mapped**. Do not invent lesson/page contents without the final PDF.
- Increased the hero artwork size, added animated stars and a gentle order-button emphasis.
- A hero video loader preserves the original static cover until an actual video starts. It checks that the hosted MP4 exists first; the site does not show a broken video if it is absent.
- Video respects pause toggle, hidden tabs, offscreen playback, reduced-motion preference and data-saving mode.
- Preview text no longer mentions printing in Mansoura and no longer includes the previous restricted-preview disclaimer.

## Media deployment
The source clip was supplied in chat, not through GitHub. A loop-safe compressed asset has been prepared separately in the delivered package:
`assets/rvu-hero-loop.mp4` (H.264, 540×960, muted, 9.25s, ~540 KB).
Upload it with exactly this path to the repository or CDN serving the website.
Until the asset is actually present on the host the homepage continues to show the cover poster, by design.

## Audio acceptance
The repository has 244 mapped rows × 2 voices = 488 MP3s. These files have mechanical integrity checks but **not a certified human American-English listening review**. Avoid claiming corrected pronunciation unless each clip is auditioned and replaced as needed. Follow `docs/audio-review.md`.

## Verification
Run `npm test`, check the public hero at mobile/desktop widths, turn on reduced-motion, test slow networks, and verify the uploaded MP4 returns Content-Type video/mp4 with range requests.
