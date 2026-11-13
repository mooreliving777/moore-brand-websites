# Moore Network motion — post-launch QA and next release gates
Date: November 13, 2026. This is a read-only audit report and development checklist, not a release authorization.

## Live Wix Headless — 12/12 deployed
The twelve Wix properties were updated in six controlled waves using complete static HTML/CSS/JS file uploads, not replaceAll. Original files were saved on rollback branches backup/wix-motion-wave1-2026-11-13 through backup/wix-motion-wave6-2026-11-13.

**Verified November 13:** All 12 public homepages loaded titles, content, links and imagery according to fresh rendered-page extraction. The first two released sites additionally returned their contact / collection pages. The account-wide hosted file audit confirmed each site's motion.css, motion.mjs, homepage references, reduced-motion stylesheet and IntersectionObserver script. All retained original favicon/robots assets. Source-stage validation checked 288 href/src references across the twelve homepage files with zero missing local files.

### Wix search indexing governance
Two published sites (City Web Design Pros and The Harsh Truth Clothing Line) currently advertise robots `index,follow`. Ten other Wix Headless sites have `noindex,follow`. Do not blindly switch those ten to indexable; they include proofs of concept, private business plans, under-development products and preview storefronts. Confirm domain, content quality, public launch authorization, canonical URLs, customer routing and brand-owner intent per site before making any SEO change.

### Outstanding Wix acceptance
- Lab Lighthouse/Core Web Vitals (LCP, CLS, INP) measurements on real live hosts have **not** been established; no performance score should be claimed.
- Verify keyboard-only navigation, focus indicators and screen-reader announcements on real devices.
- Test inquiry paths with a permitted owner-controlled test address only; do not send a live customer inquiry or purchase.
- Audit external links and Wix-hosted media with direct HTTP checks; simple rendered-page extraction is not an image-byte or destination-status guarantee.
- The GitHub PR #16 retains original Wix staging source and must remain draft/unmerged, to avoid publishing those source snapshots as public GitHub Pages assets.

## The Harsh Truth Shopify motion review
Live theme: `The Harsh Truth — Italian Signature Homepage` (MAIN).
Motion theme: `The Harsh Truth — Motion Design Review` (UNPUBLISHED, not processing).
Read-only code comparison confirms:
- The homepage `templates/index.json` is unchanged from MAIN.
- The original theme layout differs only by injected motion CSS and JS imports.
- The new CSS/JS target classes that exist in the homepage section and contain reduced-motion/IntersectionObserver safeguards.
- Four differences in `config/settings_data.json`: page transitions false→true and product-card hover none→lift in both the current settings and matching Horizon preset.
- No collection, inventory, payment, checkout, fulfillment or product availability changes are part of this motion theme.
**Release gate:** visually check both theme versions with garment photos on mobile/desktop and ensure no CTA/product links or performance regressions; obtain owner approval specifically to publish the Shopify theme. No publishing performed in this QA phase.

## WordPress.com companion sites
Connected WordPress inventory: 15 sites. Most are WordPress.com **simple** sites without plugin-level access. One Moore Computer Solutions site is suspended, one Rich Nerdz Nation Jetpack connection is disconnected, and two Moorvio WordPress sites are private. Do not mutate the suspended or disconnected site, expose private site contents, or reactivate anything without authorization.

The City Web WordPress.com free-hosted draft stripped an inserted custom `<style>` block on November 13; that test content was removed. Official WordPress.com docs (reviewed October 2026) state custom CSS requires an eligible paid plan or paid add-on, and full JavaScript/custom-code support is restricted to hosting features. No upgrades were purchased.

Cost-sensitive options:
1. Retain original WordPress.com sites as informational companions with current native theme styling.
2. When hosted source and DNS controls are available, migrate selected production sites to reviewed WordPress/Hostinger or static headless hosting with the tested motion library; preserve 301 redirects, canonical URLs and content.
3. Do not buy WordPress upgrades only to reproduce visual effects. Prioritize City Web and The Harsh Truth and the live independent Shopify store.

## Release constraints
No additional paid providers, no password sharing, no auto-checkout, no DNS changes, no unpublished claims or customer data changes. Any publish requires validation of the actual target and a rollback route.
