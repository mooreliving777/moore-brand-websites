# Wix Headless motion — Source integration staging, November 13, 2026

Twelve published Wix editorless sites were read as source snapshots and integrated into this draft GitHub branch. **No Wix upload or live release has occurred.**

## City Web Design Pros
Source: https://headless-iwdkpgxkiaj-mooreliving777-140e.wix-site-host.com/
Staged source: `integrations/wix-sites/city-web/` — 4 HTML pages, both original stylesheets, both JS navigation scripts, favicon, plus motion.css/motion.mjs.
Added body brand scope, hero and lower-section motion data attributes, CTA hover attributes, and local motion asset references. Preserved original markup, outbound service links and site.js files.

## The Harsh Truth Clothing Line
Source: https://headless-nmqhlbobszt-mooreliving777-140e.wix-site-host.com/
Staged source: `integrations/wix-sites/harsh-truth/` — 7 HTML pages, existing styles.css, site.js, favicon, plus motion.css/motion.mjs.
Added scope, editorial hero/section reveals and nonfunctional CTA hover attributes. Preserved Shopify/product links, authentic image paths and the Amanda Collection's inline JavaScript.

## Additional ten Wix properties
Added source-preserving integrations for:
- **Moore Computer Solutions** — `integrations/wix-sites/computer/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `computer`
- **Bridge to Better** — `integrations/wix-sites/bridge-to-better/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `foundation`
- **Moorvio Wix Preview** — `integrations/wix-sites/moorvio-wix/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `moorvio`
- **Fireworks TV** — `integrations/wix-sites/fireworks/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `fireworks`
- **Harsh Truth Store Preview** — `integrations/wix-sites/harsh-truth-store/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `clothing`
- **Amanda Halterman** — `integrations/wix-sites/amanda/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `amanda`
- **Leonard AI Portfolio** — `integrations/wix-sites/developer-wix/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `developer`
- **Leonard E. Moore LLC** — `integrations/wix-sites/leonard/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `leonard`
- **B3 The Place 2 Be** — `integrations/wix-sites/b3/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `b3`
- **Moore Legacy Management** — `integrations/wix-sites/moore-legacy/` — three original HTML pages, original styles, original favicon and portable motion.css/motion.mjs; brand scope `legacy`

Total staged Wix integration scope: **12 Wix sites, 41 HTML pages**, with source HTML/CSS and brand assets held only on the draft branch.
Existing business routes, images, contact links and page content were kept. No paid Wix features activated.

## Validation
Static unit checks plus browser test in `scripts/wix-integration-browser-smoke.mjs` exercise all 41 staged pages across 12 sites at mobile 390px and desktop 1366px, with reduced and normal motion, mobile navigation, and no-JS fallback. External requests are blocked. No checkout, signup or payments attempted.

## Go-live requirements
1. Obtain separate explicit live-release approval after reviewing mobile/desktop screenshots.
2. Check Wix site inventory, freshness and source drift: this folder is a dated snapshot, **not** an automatically synced Wix source.
3. Restore or exclude any newly changed live files before doing a static-site upload. `UploadHeadlessWebsiteFiles` updates the published site; do not use replaceAll to avoid deleting unrelated files.
4. Release only complete changed HTML pages and motion CSS/JS, preserving all other existing files, navigation, forms, products, and subscriptions.
5. Verify live route integrity, mobile menu, graphics, Core Web Vitals and account/customer paths. Roll back from the original saved source if degraded.
6. These are Wix companion sites, not replacements for the live WordPress or Shopify stores.

## SEO and repository safety
These staging HTML copies are intended for test and review, not long-term public deployment from GitHub Pages. Remove them before merging the repository's PR into a public Pages branch or explicitly prevent indexing; canonical points to the actual Wix site, but do not rely on canonical alone.
No paid plans, publishing, checkout, permissions, DNS or customer data changed.