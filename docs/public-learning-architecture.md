# RVU Kids — Public Learning Architecture

## Core policy

- **No child account or login:** every visitor sees the same static catalog of
  26 alphabet lessons and 15 Everyday English situations.
- **No saved child progress:** do not store lesson visits, completion status,
  star albums, scores, history, student identifiers or user profiles in
  localStorage, cookies, IndexedDB, sessionStorage or a backend service.
- **No shared classroom state:** game correctness, current question and the
  next button exist only in the JavaScript memory of the open page. Refreshing
  a lesson starts a fresh activity.
- **No barriers:** children can open any lesson at any time. The A–Z map
  shows all 26 destinations without locks, counts or completion colors.
- **Public parent guide:** `/parents/#parent-guide` explains how to use
  the lessons, shows information about the book and points to the ordering
  route; it does not display student data.
- **Optional device preferences:** voice, pronunciation speed and reduced
  motion are saved only in the current browser, never associated with a
  student or synchronized with other visitors. The optional A/B offline pack
  caches only approved static learning assets after a parent opts in.
- **Existing data cleanup:** obsolete localStorage keys
  `rvu-story-progress-v1` and `rvu-star-album-enabled` are deleted on
  learning and parent-guide visits. The retired `/learn/stickers/` URL
  redirects to the open learning hub and is omitted from the sitemap.
- **Separate purchase flow:** parent order messages may include the
  purchaser's data; these are not child profiles. Production order handling
  remains a separate, explicitly enabled backend feature.

## Isolation versus traffic capacity

The product contains no database operations in the lesson routes and no
shared visitor progress state. Its images, CSS, JavaScript and prerecorded
audio are static public assets. A visitor's answer cannot alter the catalog,
pictures, recordings or lessons another visitor sees.

`tests/public-stateless.test.mjs` simulates **1,000 independent browser
contexts** with separate storage and verifies that opening lessons does not
write student progress. The full suite also checks navigation, curriculum
assets and sound mapping.

**This is not a load test.** Confirm actual concurrent visitor capacity
using the production hosting/CDN, origin cache configuration and realistic
bandwidth monitoring before guaranteeing simultaneous capacity.

## Acceptance checks

1. Visit a lesson in a fresh private browser session; no login or progress
   prompts appear.
2. Answer a question correctly and open another browser/device; the second
   visitor sees the same unlocked lessons.
3. Inspect localStorage and cookies: no child completion keys or student
   identifiers are created.
4. Confirm parent guide shows generic educational instructions and only
   local playback/motion controls.
5. Confirm previously saved progress keys disappear after visiting the
   updated public learning site.
6. Test on Android Chrome and iOS Safari, including reduced motion and
   keyboard/button-only navigation.
7. Run `npm test` plus production CI. Do not interpret source tests as
   phonetic sign-off or proof of live Web Vitals.

## Known independent release gates

The printed-book vocabulary mismatches, emoji-backed SVG art, human review
of Fish and Fork voice recordings, and production browser performance checks
remain separate issues in `docs/book-curriculum-audit.md` and
`docs/audio-review.md`.
