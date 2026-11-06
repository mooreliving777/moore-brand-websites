# Universal fast newsletter / lead entry

**Status: draft review branch only. No new live provider connection or automatic subscriber import.**

## Verified native subscription destinations (2026-11-06)

Read-only inspections of connected WordPress content confirmed **Jetpack subscription blocks on eight published pages**. Each exact destination matches the companion site's original call-to-action URL.

| Companion site | Existing official WordPress subscription destination |
| --- | --- |
| Leonard E. Moore | https://leonardemoorellc.wordpress.com/legacy-insider-letter/ |
| City Web Design Pros | https://citywebdesignprosllc.wordpress.com/free-website-growth-guide/ |
| Moore Legacy Management | https://moorelegacymanagementgroupllc.wordpress.com/partnership-readiness/ |
| The Harsh Truth Clothing | https://theharshtruthclothinglinellc.wordpress.com/vip-drop-alerts/ |
| Fireworks TV | https://fireworkstv.wordpress.com/fireworks-inside-track/ |
| Bridge to Better Foundation | https://thebridgetobetterfoundationinc.wordpress.com/community-updates/ |
| Amanda Halterman | https://amandahaltermanllc.wordpress.com/amanda-inside-updates/ |
| AI Developer Portfolio | https://leonardemooreaideveloperportfo.wordpress.com/digital-innovation-brief/ |

Presence of a Jetpack block in the connected site's page content is **not yet proof** of successful public signup, email confirmation, subscriber list mapping, or unsubscribe behavior. End-to-end testing must use an authorized test mailbox.

## Three non-verified brand routes

- **Moore Computer Solutions**: connected WordPress.com lists the site as **suspended**. Do not describe its guide as a working newsletter entry. Hosting/account review is a separate task.
- **B3 The Place 2 Be**: the verified booking-guide page has **no Jetpack subscription block**. Keep this a booking journey, not a newsletter.
- **The Harsh Truth Official Store**: its companion CTA points to blog content. No distinct newsletter signup provider was verified at this route. Do not relabel the blog visit as subscribing.

The two legacy sites are intentionally excluded from the enhancement.

## What the code does

- `assets/newsletter-entry.mjs`: accessible one-field email component with separate, mapped consent, only for future approved provider-backed forms; never collects emails by itself.
- `assets/newsletter-routing.mjs`: a tested, pure policy decision. It permits an existing `wordpress_jetpack` route **only if its HTTPS URL exactly matches the preexisting official CTA**. Other links stay as their original CTA. A separate Mailchimp form path is disabled unless `service='mailchimp_embedded'`, `ownerApproved=true`, and the action, privacy URL, and GDPR consent-field name are valid.
- `assets/newsletter-wiring.mjs`: loads a public-only config; shows the native-card link only for a verified route. Malformed, missing or unreachable configuration preserves the original CTA.
- `data/newsletter-public-config.json`: public routing metadata for eight native WordPress pages. **Contains no API tokens, emails, contact records or Mailchimp audiences.**
- `scripts/build.py`: keeps the eleven non-legacy brand pages' optional enhancement hooks in their shared template.
- `test/newsletter-routing.test.mjs`: verifies eight exact native routes, excludes the suspended/non-newsletter pages, and tests Mailchimp fail-closed behavior.
- GitHub Actions: Python syntax, Node tests, generated-page regressions and preview diffs. Existing unrelated generator drift is reported but not rewritten automatically.

## Activation review

1. Test the eight public WordPress pages in a signed-out browser for an actual visible email entry.
2. With explicit owner approval, subscribe a dedicated test mailbox to **one** brand and verify the confirmation, permissions, welcome flow and unsubscribe.
3. Repeat per brand only after verifying audience segregation and that no subscription to another brand occurs.
4. Keep account sign-in and marketing permission separate. Two clicks is a design goal, not a guarantee when confirmation or bot checks apply.
5. Add Mailchimp only if the native subscription doesn't meet the business requirements. The connected Mailchimp chat plugin cannot configure audiences/automations; those require direct Mailchimp app access or another approved integration.
6. Do not merge, publish, connect paid services, submit subscriptions, or change live WordPress pages without explicit approval.

**No production publishing occurred in this branch.**
