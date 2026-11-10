# RVU Kids — full source and asset integrity review (2026-11-10)

> **Historical audit:** This document describes the previous implementation and is not the current student-data policy. Current RVU Kids is public and does **not** save student progress, completion status, stars or accounts. See [Public Learning Architecture](public-learning-architecture.md).


## Verified CI and merge
- Audit PR: https://github.com/rvnonty/rvu-kids/pull/13
- Successful PR CI run: https://github.com/rvnonty/rvu-kids/actions/runs/42842157454
- Result: **96 tests passed, 0 failed**, including production build and regression checks.
- Improvements merged to `main`: commit `7fca5aeed68c889882f4f9b75eca1f861bbdb0a4`.
- Root cause of the original 17 failing tests: build ran after tests, stale test expectations for removed emoji/book pages, blanket voice approval assumption, and incomplete test DOM mocks. Fixed without claiming phonetic approval.

## Inventory covered
| Area | Results |
| --- | --- |
| Alphabet routes | All 26 static lesson pages exist and load shared scripts |
| Everyday English routes | All 15 static lesson pages exist |
| Vocabulary assets | All 101 referenced SVG paths exist, but **98 are emoji wrappers** and 3 are actual vector drawings |
| Audio assets | All 244 manifest rows have female and male files (488 files); path, basic header and nonempty size checks passed |
| Preview images | All five required WebP files exist, use supported headers, and the preview still shows exactly five pages |
| Site HTML references | Static script, image and stylesheet paths checked by regression suite |
| Build | Produces `dist` before test execution; removes explanatory CSS/activity module block comments in shipped bundle |
| Parent mode | Local progress, voice rate, optional stars, motion and offline A/B controls retained |
| Backend | `server/worker.mjs` reviewed: orders disabled by default, input validation, Origin check, D1 idempotency and hashed IP rate-limiting present |
| Design | Keep light cream/forest-green Storybook Garden theme, not dark mode |

## Unresolved release blockers
1. **Printed-book fidelity:** 15 mismatched vocabulary positions across 12 letter lessons. Details: [book-curriculum-audit.md](book-curriculum-audit.md). The snapshot test documents this discrepancy, so green CI is **not** content approval.
2. **Illustration quality:** 98 word SVG files still embed operating-system emoji rather than book-matched illustrations. Green file-integrity tests verify file presence, not visual correctness.
3. **Human American-English listening review:** Fish and Fork remain blocked; both voice versions and all affected recordings need documented review. Manifest status is `partially-reviewed-not-final`.
4. **Updated printed-book preview:** five replacement WebPs derived from the supplied revised PDF are prepared separately, **not yet committed** to GitHub. No complete book PDF should be published.
5. **Real-device and production QA:** current tool access could not validate the live website; Android/iOS interactions, spoken audio, keyboard navigation, cache/offline behavior, WhatsApp order path and actual Lighthouse/CrUX field numbers remain unverified.

## Additional content coverage
Printed book includes review/challenge units 42–46 (PDF pages 86–95), while the digital curriculum has 26 letters and 15 Everyday English lessons for units 1–41. These five review units are not mirrored as separate digital activities. This can be an enhancement without exposing printed pages.

## Release recommendation
**RELEASE CANDIDATE / CONTENT APPROVAL BLOCKED.** Do not describe it as fully final or book-identical yet. The engineering regression suite is green, but content, picture identity, human pronunciation signoff and production-browser measurement are separate gates. Make those fixes and rerun CI plus real-device QA before unconditional launch approval.
