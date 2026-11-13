# Moore Network Motion Website Standard — review draft

## Coverage
This change stages premium motion across 13 GitHub Pages brand companions, the directory, and 2 blog pages (16 HTML files). It also updates the Python build generator so future regenerations retain the motion system. This does not edit live Wix, WordPress, Shopify, DNS, forms, or checkouts.

## Shared motion language
- Restrained cinematic hero entrance; scroll-triggered section and card reveals.
- Subtle product and service-card hover movement; a minimal scroll progress indicator.
- Brand palettes, actual imagery, typography, text, links, and existing customer routing remain unchanged.
- Native IntersectionObserver with a requestAnimationFrame progress update; no external libraries, paid APIs, autoplay video or trackers.
- Prefer transforms and opacity over layout-changing animation.
- HTML content remains readable if JavaScript is disabled or IntersectionObserver unavailable.
- Entire motion system honors prefers-reduced-motion, including users who change it during a visit.
- No flashing, scroll hijacking, audio autoplay, relentless marquees, or fake reviews / product photography.

## Platform rollout after review
1. **Wix**: apply equivalent entrance, hover and scroll effects in the existing editor to the 12 Wix properties, starting with City Web Design Pros and The Harsh Truth Clothing. Do not create duplicate sites or publish unpublished previews.
2. **WordPress**: 15 connected properties; simple/free-site plan restrictions limit custom CSS or JavaScript. Use native block effects where supported and keep drafts unpublished until eligible.
3. **Shopify**: assess Horizon's built-in theme animations (scroll reveals and hover), prefer an unpublished theme preview. Do not change product availability, checkout, payment, order automation or garment image authenticity.
4. **Moorvio**: apply motion to marketing and navigation; avoid distracting animation on active CRM forms and data tables. Keep app release independent.

## Acceptance checklist
- Check 390px mobile and 1440px desktop; keyboard navigation; screen readers; reduced motion; no horizontal overflow.
- Monitor CLS, LCP and INP; animation must not materially reduce web performance.
- Review user-facing text, links, image integrity and consent boundaries.
- Do not merge, deploy, publish, upgrade plans or purchase plugins without an explicit release gate.
