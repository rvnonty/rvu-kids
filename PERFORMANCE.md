# Production rollout and 10k-concurrent readiness checklist

1. Deploy `dist/` to Cloudflare Workers Static Assets (or equivalent CDN). Configure Cloudflare DNS/CNAME and TLS after ownership verification.
2. Verify cache behaviour at the CDN edge: HTML ~5 minutes; small illustrations and MP3 ~7 days; purge on release. The provided _headers file does not affect GitHub Pages.
3. Exercise a staged, **authorized test environment** with gradual ramp: 100, 500, 2000, and 10000 browser sessions (a browser session isn't an HTTP request). Observe request spikes, 429/5xx, p95/p99 response time and CDN HIT ratio, plus monthly bandwidth.
4. Use geographically distributed traffic generation if needed; never launch 10k load against the production GitHub Pages hostname without provider approval.
5. Keep WhatsApp order flow separate: a successful static site request does not guarantee that WhatsApp or the receiving device can handle 10k simultaneous customer conversations.
6. Only after the staging test passes should advertising promise that concurrency target. Nothing in this repo can guarantee zero downtime.
