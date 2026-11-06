# Universal fast newsletter and lead-entry system

**Status:** Draft / review gated · Issue #1 · Provider connections and automations are NOT live.

## Implemented

- A bright, responsive optional email-capture component in `assets/newsletter-entry.mjs` and `assets/newsletter-entry.css` (one email field and separate consent).
- A progressive enhancement controller in `assets/newsletter-wiring.mjs` and integration into `scripts/build.py`, already rendered in **11 non-legacy brand companion pages on this review branch**.
- Each page preserves its original WordPress/booking/resource CTA as the non-JavaScript fallback. When enhanced, the branded card **links to the same published destination** until a real provider is approved.
- The two legacy/coming-soon pages are excluded. No user account is required to view or follow a public link.
- Shared public configuration in `data/newsletter-public-config.json` is **intentionally empty**. There is no active Mailchimp list, endpoint, automation or subscriber storage in this repo.
- Validations reject non-HTTPS or untrusted hosted form actions. A real form is rendered only when the provider-issued POST destination, privacy policy and GDPR consent-field mapping are present; otherwise the original link remains. No fake subscription success, tokens, API keys, or client-side databases.
- A dedicated GitHub Actions check verifies component tests and source-generator consistency.

## How the public-only configuration will work, AFTER provider verification

```json
{
  "version": 1,
  "brands": {
    "brand-slug": {
      "mailchimpAction": "https://YOUR-REAL-MAILCHIMP-DATACENTER.list-manage.com/subscribe/post?u=ISSUED_ID&id=ISSUED_AUDIENCE",
      "privacyUrl": "https://YOUR-OWN-APPROVED-PRIVACY-POLICY.example/privacy",
      "consentFieldName": "gdpr[ACTUAL_PROVIDER_FIELD_NUMBER]"
    }
  }
}
```

**The above is explanatory format only, not working settings and not approved for publishing.** Use provider-generated embed details and preserve required hidden bot-control inputs if present; the current component must be reviewed against the real hosted form first. The official URL and public audience ID are not secret, but never put Mailchimp API keys, owner credentials, subscriber lists or personal information into public files. Confirm that the brand-specific privacy link is real.

The module reads brand-specific public config and falls back to an existing secure WordPress URL when the config is absent, invalid, or unreadable. The provider—not the static website—is responsible for email verification, double opt-in where applicable, errors and unsubscribe handling.

## Release and privacy gates

1. Verify each actual site is owned and that its existing lead magnet or newsletter destination is current; a lead-magnet page is not proof of an active mailing list.
2. Confirm each brand's authorized Mailchimp audience or alternative provider, GDPR preferences, suppression logic, duplicate handling, and the exact official embedded form action and consent-field mapping.
3. Confirm marketing consent is not bundled with app account terms. Signup/login and promotional email subscriptions are separate products.
4. Review provider-specific anti-spam fields and behavior, welcome journeys, tags, unsubscribe and form submission results before activating any email capture.
5. Run `node --test test/*.test.mjs` and `python scripts/build.py` then check that generated files are unchanged. Test mobile layouts, keyboard/screen readers, no-JS fallback, and provider outages on a nonpublic preview.
6. Require owner approval before merging, deploying, publishing, paying for services, or enabling any live subscription automation.

## Scope limits

- Two-click signup is the goal, not a guarantee when user authentication, consent, bot checks or double opt-in are necessary.
- This repository is a **static companion-site network**, not a central SSO or subscriber database.
- No hosted OAuth secret or access token should ever be stored in public JavaScript.
- Mailchimp audience/automation management is not available from the currently connected chat integration. Configure those settings in the authorized Mailchimp app or a separate approved integration.
