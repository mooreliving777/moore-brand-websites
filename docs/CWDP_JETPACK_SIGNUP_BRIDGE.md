# City Web Design Pros: Jetpack-native newsletter entry

**Verification:** On November 6, 2026, the connected WordPress.com site `citywebdesignprosllc.wordpress.com` (blog ID 258041285) was inspected read-only.

The published **Website Growth Checklist** page (page ID **41**, slug `free-website-growth-guide`) contains an existing `wp-block-jetpack-subscriptions` email-subscription block, along with separate links for the consultation and Website Rescue offer.

**Existing page:** https://citywebdesignprosllc.wordpress.com/free-website-growth-guide/

## Decision

Use the official WordPress-hosted growth checklist as the first provider-native signup destination rather than silently adding an unverified Mailchimp form. It is already the existing companion-site CTA, so maintaining that link also protects no-JavaScript visitors.

The public-only configuration identifies `wordpress_jetpack` for `city-web-design-pros` and links to that published page. The client must verify the configured link matches the page's original approved CTA; it cannot redirect to an arbitrary URL supplied in public config. No subscriber email passes through GitHub Pages.

**Not verified:** Successful end-to-end subscription by a new visitor, confirmation email delivery, the mailing list recipient/audience, consent receipt, opt-out synchronization, subscriber metrics or any welcome automation. Rendering a Jetpack subscribe block in the connected page is not proof that these functions have been tested. No actual subscription was submitted.

## Owner-reviewed test checklist

1. Use a dedicated test inbox with no current subscription. Visit the published page in a signed-out browser and confirm that Jetpack offers a visible email entry and unambiguous consent.
2. Check whether visitors can subscribe without WordPress login, and document the actual number of steps (two clicks is a goal, not a guarantee).
3. Submit one test subscription only with explicit owner approval; check double opt-in/confirmation, first email, privacy text, unsubscribing and site-specific consent.
4. Only if the Jetpack path fails the intended funnel, configure and test a real Mailchimp audience or alternative provider. Do not force visitors to create app accounts to subscribe.
5. Do not publish or change subscription settings, create automation journeys, or modify contact records until this test and owner approval are complete.

WordPress.com reports this site as a **Simple site with limited plugin-management capabilities**. Do not promise custom-plugin or self-hosted features without verifying plan support.

This is a review-branch integration note, not a deployment or confirmed Mailchimp connection.
