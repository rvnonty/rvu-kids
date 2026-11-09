# RVU Kids
A bilingual English-learning storefront and static learning site for the Rvu Alphabet Book.

## Published learning assets
- 26 alphabet lessons, 101 curriculum words, 15 Everyday English units and 64 daily sentences.
- All **101** alphabet vocabulary entries have individual compact SVG illustrated symbol thumbnails, with accessible labels and touch enlarge.
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
