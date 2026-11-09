# RVU Kids — CDN migration

## What is prepared

The site remains live on GitHub Pages until the owner explicitly cuts over. The separate `wrangler.static.jsonc` deploys `dist/` as **Cloudflare Workers Static Assets**, with no Worker script and no dynamic orders backend. This minimizes code execution and uses CDN static-asset serving. The config has **no custom domain routes**, so testing cannot accidentally take over the live site.

## To activate staging

1. In Cloudflare, create/select your own account and the zone for `rvu-kids.company` (don't switch live DNS yet).
2. In GitHub repository Settings → Secrets and variables → Actions, add `CLOUDFLARE_API_TOKEN` (a scoped Workers deployment token) and `CLOUDFLARE_ACCOUNT_ID`. **Never put secret values in the repository or chat.**
3. Create GitHub Environment named `cloudflare-staging` (optionally require approval).
4. Open Actions → Deploy RVU Kids to Cloudflare staging → Run workflow. It builds, checks static assets, and deploys `rvu-kids-static` to its Cloudflare preview hostname, without changing the public domain.
5. Verify all 101 picture words, all sound formats, 404 status, navigation, WhatsApp handoff and caching on the preview domain.

## Domain cutover (separate owner action)

Only after preview checks and an authorized load test, attach `rvu-kids.company` as a Custom Domain on the Worker. Cloudflare zone activation, ownership verification, DNS changes and potential removal of the existing CNAME require the domain/Cloudflare account owner's permission. Keep the old GitHub Pages configuration until the cutover is verified and documented. 

## Performance validation

GitHub CI includes a bounded **local** functional smoke test. Passing it does **not** establish 10,000 simultaneous visitors. A controlled, provider-approved staging test with cloud analytics, latency/error budgets and regional monitoring is still required before claiming such capacity. WhatsApp message delivery and manual order handling have their own independent capacity limits.
