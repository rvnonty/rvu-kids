# RVU Kids
A bilingual English-learning storefront and static learning site for the Rvu Alphabet Book.

## Published learning assets
- 26 alphabet lessons, 101 curriculum words, 15 Everyday English units and 64 daily sentences.
- All **101** curriculum vocabulary entries have compact SVG thumbnails, touch-to-enlarge, and are organized by the printed book's **facing page pairs**. Letter A is pages **1–2**, B **3–4**, through Z **51–52**. Selecting either page number opens that letter's words.
- 244 lesson clips in **two** American English synthetic voices: 488 MP3 files.
- The site owner approved publishing these clips. They are AI-generated neural voices, **not real human actor recordings**.
- Audio streams are requested only when Listen is clicked; images have lazy-loading, and transitions respect reduced-motion preferences.
- Orders open the official phone-number click-to-chat link (recipient +201012809358, displayed as WhatsApp with Ramez); there is no backend checkout or order tracking enabled.

## Deploy and scale
Run `npm run build && npm test`. The built static output is `dist/`.
GitHub Pages serves the current domain, but it has usage limits and this repo's `_headers` is not applied by GitHub Pages.
For traffic spikes, deploy the static build through Cloudflare Workers Static Assets / Pages and configure caching and DNS; do not claim 10,000 simultaneous users are guaranteed until a staging load test has been completed and passed. Dynamic orders/API require separate load testing.

## Cache and media
The `_headers` file is a configuration template for hosts that support it. Static media: seven-day edge cache, version before longer immutable caching; HTML: shorter TTL. SVG and MP3 are served as independent static assets. Avoid preloading all audio.

## American-English pronunciation QA

The existing 244 x 2 public recordings were synthesized using neural TTS, not recorded by human actors. Reports of `fish` sounding like `vish` and unnecessary trailing vowels mean they are **not guaranteed accurate or human-natural**. The `pronunciation-audit.yml` workflow uses independent speech recognition to screen the 101 word tracks in both voices and produces candidate F-word phonetic replacements as downloadable review files. ASR success alone is NOT sufficient to approve a take; human review is required before replacing any production audio. Genuine human speech needs licensed recordings by American-English voice actors.

## Beyond-the-book activities

All 26 alphabet lessons and 15 Everyday English units now include four opt-in mini-games:
- Alphabet: picture-word recognition, listening choice, building words, and ordering sentences.
- Everyday English: new situational prompts, listening choice, missing words, and ordering sentences.
- Correct answers receive brief celebratory shapes and positive bilingual feedback; mistakes invite retries with no timers, tracking, scores or required progression.
- All animation honors prefers-reduced-motion. The game scripts and stylesheet load only on lesson pages.
- Existing American-English synthetic voice recordings remain subject to the separate pronunciation audit.

## Storybook Adventure learning experience (November 2026)

The learning pages now share a calmer visual system: forest green, warm cream,
sunny yellow, soft mint, peach and sky blue, with restrained paper surfaces.
The homepage links to the A–Z Storybook World.

- All **26 alphabet stops** use existing curriculum letter routes and
  illustrated SVG vocabulary assets. A responsive dotted route connects stops
  instead of using unrelated emoji artwork.
- The **original characters from the book cover** introduce lessons, explain
  practice, and give supportive feedback after game answers. Character motion
  is subtle and respects reduced-motion preferences.
- The site remembers **visited** and explicitly **completed** stations
  separately in on-device localStorage (key: rvu-story-progress-v1).
  Visiting a page never automatically marks a lesson as completed.
  No personal child data is collected for these on-device milestones.
- Each lesson has a manual completion button and a next-station link.
  The alphabet map shows a completed count and resumes at the next
  unfinished letter.
- Existing audio files, voice choices, and saved playback speed remain.
  Storybook enhancements load from /learn/storybook.mjs after original
  lesson rendering. If unavailable, the existing letter grid still works.
- Game scenes reuse cover character artwork, while celebrations use
  gentle CSS shapes rather than platform-dependent emojis.

Run npm run build && npm test before deployment. Regression tests for
storybook controls live in tests/storybook-adventure.test.mjs.
Live-browser mobile, audio, and caching checks remain necessary on host.

## Living Book Garden styling (November 2026)

- Each of the **26 alphabet lessons** has its own carefully selected garden
  palette, with scenery matched to the vocabulary theme (orchard, pond, sky,
  woodland, moonlight, ocean, etc.). These are **illustration-inspired themes**,
  not exact color samples from a revised print-ready book.
- Everyday English lessons share the same storybook world, but use coordinated
  speech-bubble headings and themed scene details to distinguish them from
  letter lessons.
- Vocabulary appears on a paper-like living landscape with illustrated
  objects, flowers, soft shadows, movement on tap/hover, swaying foliage,
  drifting clouds, water ripples and a subtly animated character. Motion is
  paused when scenery is offscreen, where IntersectionObserver is supported,
  and reduced-motion preferences are respected.
- Mobile styling avoids heavy blur and continuous animations in the sticker
  album. Animations use mostly transforms and opacity.
- **Full book spreads or full PDF are never published.** The preview retains
  exactly five individually selected images: cover, letter A, A practice,
  feelings, and letter M. Full-page images formerly embedded in lessons
  were removed; interactive vocabulary SVGs remain.
- **Important:** Those five preview image files have **not** been replaced
  because a verified copy of the newly revised book was not available to this
  change. Update only those exact five existing preview assets after receiving
  the final source and confirming page selection, without publishing any
  additional book pages.

Regression checks: tests/garden-identity.test.mjs, with npm test.

## Quality and reliability gate (November 2026)

- **Pronunciation:** Fish and Fork remain disabled pending actual US-English
  listening review in both voice recordings. Existing files 037.mp3 and
  040.mp3 have not been silently replaced or approved. See
  [audio review](docs/audio-review.md).
- **Image preview:** keeps exactly five book pages. Fixed image aspect ratios
  and light illustrated placeholders improve lazy loading and make missing
  images apparent during real scrolling.
- **Alphabet:** 26 larger picture-led stops with separate, accessible
  "Listen" actions. Audio plays only through the existing approved word
  pipeline, using the saved playback rate. Any unreviewed clip stays disabled.
- **Performance:** manual GitHub Actions Lighthouse audit for storefront,
  alphabet and preview. LCP target 2.5s and CLS target 0.1 are checked
  by scripts/check-vitals.mjs. INP target 200ms requires field data
  (CrUX / Search Console) and must not be inferred from Lighthouse lab tests.
  See [performance verification](docs/performance.md).
- **Limited offline lessons:** parents can explicitly save or remove beginner
  lessons A/B, with their existing voice clips and word illustrations. No
  automatic full-book download, no caching of Fish/Fork, and no silent
  pre-download. Real-device offline testing remains required.
- **Access and motion:** reduced-motion preferences are respected and the
  alphabet audio actions are separate from navigation links, reachable by
  keyboard and touch.

These changes have source-level checks and regression tests; browser field
performance and phonetic quality are not certified by automated source checks.
