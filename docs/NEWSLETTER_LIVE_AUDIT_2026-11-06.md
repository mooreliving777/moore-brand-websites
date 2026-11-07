# WordPress newsletter live-system audit and controlled test
Date: 2026-11-06 (UTC) · read-only verification via owner-authorized WordPress connector, except the single approved test-address import noted below.

## Native newsletter status
Each of the eight approved brand signup pages was checked using the WordPress/Jetpack newsletter status API.

| Brand | Confirmed recipients (before test) | Can email subscribers? |
| --- | ---: | --- |
| Leonard E. Moore | 1 | Yes |
| City Web Design Pros | 0 | No — no active subscribers |
| Moore Legacy Management | 0 | No — no active subscribers |
| The Harsh Truth Clothing | 0 | No — no active subscribers |
| Fireworks TV | 0 | No — no active subscribers |
| Bridge to Better Foundation | 0 | No — no active subscribers |
| Amanda Halterman | 1 | Yes |
| AI Developer Portfolio | 0 | No — no active subscribers |

**All eight** have WordPress Newsletter enabled, subscribe blocks at post ends and branded welcome text. Current settings were read but **not changed**. Email-new-posts-by-default is disabled on seven; Amanda currently has it enabled. Do not change send defaults without separate editorial approval.

The above `confirmed` counts were checked before a limited live test. WordPress includes other counters (e.g., unconfirmed invitations); counters need not add up because imported/followed states are provider-specific.

## Live backend test: City Web Design Pros
The owner expressly requested an end-to-end subscription setup/test. Only **one owner-controlled linked test mailbox** was imported into the existing City Web Design Pros WordPress subscriber list, with consent confirmed. Do not place its address in the repository.

- WordPress native subscriber import finished successfully: 1 added, 0 already subscribed, 0 failed.
- A follow-up WordPress status read reported **1 confirmed subscriber**, **1 unconfirmed earlier test subscription**, `site_can_send: true`, and **no send blockers**.
- No new WordPress post was published, newsletter campaign sent, marketing workflow enabled, domain modified, or public form changed.

**This is a confirmed backend import, not an end-to-end visitor form subscription.** No confirmation email or welcome email was observed in the test mailbox immediately after the import; that does **not** prove deliverability failure (imports may not send an immediate email). No unsubscribe link was tested.

## Earlier public sign-up evidence
The owner-connected Gmail inbox contains separate WordPress.com **Confirm your subscription** emails from 2026-10-22 addressed to distinct plus-addressed test aliases for the eight brand sites. This verifies that a previous signup request generated confirmation emails. It does **not** verify the final confirmation click. Those invitations are still unconfirmed for six brands according to WordPress status; older confirmation links may expire.

Do not put confirmation URLs, login links, activation tokens, test inbox IDs or mailbox aliases into GitHub files, published content or analytics.

## Remaining end-to-end checks
1. Authorized owner opens a WordPress confirmation email directly in their connected inbox and follows the legitimate confirmation link in the correct browser session. The confirmation URL may also create a separate WordPress.com account for that alias; verify the page before accepting.
2. Read WordPress status again and confirm that `confirmed` increased and the relevant `send_blockers` disappeared; distinguish the imported address from the earlier self-serve alias.
3. Send a **reviewed** genuine newsletter edition through the official WordPress editor, only after the user approves publication/sending, and verify delivered recipient count and inbox arrival. Do not publish a fake promotional campaign just for testing.
4. Review the sender/from name, welcome copy, unsubscribe footer, suppression behavior, privacy disclosure, spam controls and mobile screen-reader usability.
5. Run a second controlled self-serve signup using a different, owner-controlled test inbox once a browser with authenticated context is available. Confirm direct visitor form, email, click, thank-you page, and unique subscriber.
6. No automatic email marketing from Mailchimp is connected through the ChatGPT connector. If separate branded automations are needed, configure them in the authenticated Mailchimp app, with audience separation and consent records.

## Outstanding constraints
Browser automation via the already-connected TinyFish service could not start because of its wallet balance. This does not affect WordPress read/write connector access. Google Cloud OAuth remains a separate application, never a prerequisite for anonymous newsletter subscriptions.

Treat each test claim literally: provider enabled, address imported, confirmation observed, email actually delivered, and opt-out verified are different milestones.
