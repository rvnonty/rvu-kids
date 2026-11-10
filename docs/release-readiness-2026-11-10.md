# RVU Kids launch readiness — 2026-11-10

## Decision

**Theme:** Keep the warm, light Storybook Garden design as the default.
The current 96-page printed book uses colorful garden illustrations, sky,
trees and friendly characters. A site-wide dark theme would conflict with
this learning and print identity.

**Release classification:** RELEASE CANDIDATE — NOT YET HUMAN-APPROVED.

## Code changes checked in this audit

- Harmonized the 26 illustrated alphabet cards to render at their final size
  immediately; hydration now reuses the initial map introduction to reduce
  page-layout shifts.
- Letter cards have separate large lesson navigation and listen controls.
- The two reported incorrect words **fish** and **fork** remain disabled.
- The audio manifest now explicitly marks their pronunciation review as a
  blocker instead of claiming unconditional voice approval.
- Audio Cache-Control rules now request revalidation after five minutes,
  where the hosting provider supports _headers.
- Revisions to the optional A/B offline pack invalidate older cached code
  and verify saved files before displaying an offline-ready state.

## Book preview

- Five replacement WebP images were rendered from the supplied
  96-page RVU_BOOk.pdf (dated November 3, 2026), selecting PDF
  pages 1 (cover), 4 (letter A), 5 (practice A), 56 (feelings), 28
  (letter M).
- The images use the five existing filenames and do **not** include
  the full book. They are prepared as an external 5-page ZIP.
- **Binary images have NOT yet been committed to GitHub.**
  Replace only those five files under assets/ before final launch.

## Unmet release sign-off

- [ ] Independently review all 244 x 2 audio mappings for correct American
      pronunciation and verify both fish/fork clips have been re-recorded
      and human-approved.
- [ ] Run `npm test` and `npm run build` on the real repository; check
      GitHub Actions is green. No successful run was verifiable in this audit.
- [ ] Run Lighthouse on main / alphabet / preview and investigate failing
      LCP (<=2.5s) or CLS (<=0.1). Confirm INP (<=200ms) from real-user
      field data rather than deriving it from Lighthouse lab metrics.
- [ ] Test Chrome on Android and Safari on iOS at narrow viewport sizes:
      letter map, audio playback speed, voices, modal focus, drag-to-turn
      and button-based alternatives, parent settings, star album,
      and A/B offline storage.
- [ ] Verify actual production deployment, custom domain HTTPS, image
      responses, cache behavior, WhatsApp order workflow, shipping totals,
      accessibility focus order, and privacy messaging.
- [ ] Commit the five updated preview WebPs from the verified book PDF.

## Do not misstate approval

Static syntax checking and the presence of an MP3 file do not certify its
pronunciation or listening clarity. A successful local/lab performance check
does not certify mobile field performance. A code commit is not proof that
the live production deployment has updated.
