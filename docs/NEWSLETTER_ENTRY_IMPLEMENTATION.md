# Universal fast newsletter / lead entry
Status: draft, review gated · Issue #1 · No live form endpoint or audience has been connected.

## What's built
- `assets/newsletter-entry.mjs` + `assets/newsletter-entry.css` supply a mobile-first **one-email-field** subscription component, with consent text and a bold CTA. No passwords or signup account required.
- Supports a provider-generated **Mailchimp HTTPS embedded form POST action** only. The public embedded action includes audience identifiers, not API secrets. Validate the provider's exact official embed snippet and required hidden fields before activation.
- Rejects unapproved/invalid actions. Falls back to an approved existing HTTPS signup destination; never pretends to collect an email or show a fake success message.
- Native HTML `POST` lets the provider handle subscription, double opt-in, errors and unsubscribes. No tracking pixels, browser storage, client-side API keys, or credential collection.
- Responsive visual styling intended for the Moore brand network; each brand can override CSS variables and copy separately.

## Using the component after owner approval
```html
<link rel="stylesheet" href="../assets/newsletter-entry.css">
<div id="newsletterEntry"></div>
<script type="module" src="../assets/newsletter-wiring-example.mjs"></script>
```

The wiring module should call `mountNewsletterEntry(document.getElementById('newsletterEntry'), { brand, title, description, mailchimpAction, privacyUrl, existingSignupUrl, requireConsent: true })` with each brand's verified configuration, loaded from a carefully reviewed public-only config. This step is **not** installed on generated sites yet. Do not paste a Mailchimp API key or private personal data into source control.

## Activation gates
1. Confirm an authorized brand-specific Mailchimp account/audience and verified double-opt-in/compliance settings. The currently available ChatGPT Mailchimp integration does **not** manage audiences/automations; this work must be completed in the Mailchimp app or another approved provider.
2. Obtain official embed HTML and exact public action URL. Verify native POST behavior and required anti-bot inputs; adapt only after provider-specific review.
3. Confirm privacy URL, consent language, audience tag routing, unsubscribe, welcome series and suppression logic. Do not subscribe people through account registration.
4. Run `node --test test/newsletter-entry.test.mjs`; manually test valid/invalid, accessible keyboard/mobile input, opt-in, duplicate, unsubscribe and outage behavior before merging.
5. Integrate into `scripts/build.py` and generated brand sites only after the per-brand backend is real and approved. Keep published WordPress destinations until then.

## Non-goals
- No guaranteed two clicks when a provider requires email verification.
- No custom subscriber database, API secret in GitHub Pages, Mailchimp workflow creation, or unpublished live changes.
- No assumption that a free Mailchimp tier allows every requested multi-brand automation.
