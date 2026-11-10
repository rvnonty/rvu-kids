# RVU Kids
A bilingual English-learning storefront and static learning site for the Rvu Alphabet Book.

## Published learning assets
- 26 alphabet lessons, 101 curriculum words, 15 Everyday English units and 64 daily sentences.
- All **101** curriculum vocabulary entries have compact SVG thumbnails, touch-to-enlarge, and are organized by the printed book's **facing page pairs**. Letter A is pages **1–2**, B **3–4**, through Z **51–52**. Selecting either page number opens that letter's words.
- 244 lesson clips in **two** American English synthetic voices: 488 MP3 files.
- The site owner approved publishing these clips. They are AI-generated neural voices, **not real human actor recordings**.
- Audio streams are requested only when Listen is clicked; images have lazy-loading, and transitions respect reduced-motion preferences.
- Orders still open WhatsApp; there is no backend checkout or order tracking enabled.

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
