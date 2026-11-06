import { mountNewsletterEntry, validatedPublicLink } from './newsletter-entry.mjs';

const root = document.querySelector('[data-newsletter-entry]');
if (root) {
  const section = root.closest('#connect');
  const original = section?.querySelector('a.button.primary');
  const originalUrl = original ? validatedPublicLink(original.href) : null;
  const slug = root.dataset.brandSlug;
  let publicConfig = null;
  try {
    const response = await fetch('../data/newsletter-public-config.json', {
      credentials: 'omit', cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      if (data?.version === 1 && data.brands && Object.hasOwn(data.brands, slug)) {
        publicConfig = data.brands[slug];
      }
    }
  } catch {
    // Original official link remains visible when config loading fails.
  }

  // Display an enhanced newsletter card only for a reviewed provider route.
  // Booking guides, generic blog links and suspended sites are not subscriptions.
  const native = publicConfig?.service === 'wordpress_jetpack' &&
    validatedPublicLink(publicConfig.hostedSignupUrl) === originalUrl;
  const mailchimp = publicConfig?.service === 'mailchimp_embedded' &&
    publicConfig?.ownerApproved === true;
  if (originalUrl && (native || mailchimp)) {
    const state = mountNewsletterEntry(root, {
      title: root.dataset.offer || 'Stay connected',
      description: native
        ? 'Explore the official WordPress page and its existing subscription options.'
        : 'Subscribe to receive updates from this brand. Confirmation may be required.',
      brand: root.dataset.brandName || 'this brand',
      mailchimpAction: mailchimp ? publicConfig.mailchimpAction : null,
      privacyUrl: mailchimp ? publicConfig.privacyUrl : null,
      consentFieldName: mailchimp ? publicConfig.consentFieldName : null,
      requireConsent: true,
      existingSignupUrl: originalUrl,
      fallbackLabel: native ? 'Open on WordPress' : 'Visit official updates'
    });
    // Failed provider validation must leave the existing CTA visible.
    if (native || state.active) {
      root.hidden = false;
      section.classList.add('newsletter-enhanced');
    }
  }
}
