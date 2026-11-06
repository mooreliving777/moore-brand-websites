import { mountNewsletterEntry, validatedPublicLink } from './newsletter-entry.mjs';
import { chooseNewsletterRoute } from './newsletter-routing.mjs';

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

  // A route is eligible only when its service and exact destination are vetted.
  // Booking guides, generic blog links and suspended sites are not subscriptions.
  const route = chooseNewsletterRoute(publicConfig, originalUrl);
  if (route.kind !== 'none') {
    const state = mountNewsletterEntry(root, {
      title: root.dataset.offer || 'Stay connected',
      description: route.kind === 'native'
        ? 'Explore the official WordPress page and its existing subscription options.'
        : 'Subscribe to receive updates from this brand. Confirmation may be required.',
      brand: root.dataset.brandName || 'this brand',
      mailchimpAction: route.action || null,
      privacyUrl: route.privacyUrl || null,
      consentFieldName: route.consentFieldName || null,
      requireConsent: true,
      existingSignupUrl: route.fallbackUrl,
      fallbackLabel: route.kind === 'native' ? 'Open on WordPress' : 'Visit official updates'
    });
    // Failed provider validation must leave the existing CTA visible.
    if (route.kind === 'native' || state.active) {
      root.hidden = false;
      section.classList.add('newsletter-enhanced');
    }
  }
}
