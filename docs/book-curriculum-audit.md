# RVU Kids — Printed-book to website curriculum audit
Updated: 11 November 2026

## Current correspondence
- The approved reference book contains 96 pages.
- The website presents **26 alphabet lessons with 101 pictured words**; all lesson word texts now match the current printed curriculum and pass `tests/book-curriculum-snapshot.test.mjs`.
- The 244-row audio manifest was regenerated to use the same word and example sentence texts as the curriculum. All 488 paired media paths exist.
- The website also offers 15 Everyday English units containing 64 sentence recordings.
- All 101 vocabulary assets use an SVG card frame with a consistent visual style. Some illustrations are emoji glyphs inside those cards rather than hand-drawn reconstructions of the original printed imagery; visual identity is not the same as pixel-for-pixel book fidelity.

## Changes closed during the audit
Fifteen prior text-to-audio mismatches were corrected: carrot, drum, envelope, engine, fox, igloo, jeep, king, nurse, owl, ox, pencil, rose, strawberry and snake. The old words belonged to an outdated audio map and are no longer substituted into the current curriculum. The previously inconsistent group of 17 image cards was restyled.

## Deliberate differences and remaining checks
The five final printed review/challenge units (printed units 42–46) are not each replicated as separate standalone digital lessons. The website provides its own learning games instead.

A complete visual comparison of every SVG card to the latest print reference remains subject to a manual review. Phonetic accuracy and speaker identity require human listening acceptance (see `docs/audio-review.md`). Do not claim 100% book-image or pronunciation equivalence from automated path checks.

## Regression gate
Run `npm test`, the five-pass GitHub workflow, the 41-lesson browser run, and the responsive site-design workflow after changing curriculum/media. The Lighthouse mobile lab gate currently identifies remaining LCP work on some learning pages; this is reported separately and not concealed.
