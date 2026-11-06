import { mountNewsletterEntry, validatedPublicLink } from './newsletter-entry.mjs';

const root = document.querySelector('[data-newsletter-entry]');
if (root) {
  const section = root.closest('#connect');
  const original = section?.querySelector('a.button.primary');
  const fallbackUrl = original ? validatedPublicLink(original.href) : null;
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
    // Keep the existing official link on any configuration/network failure.
  }
  if (publicConfig || fallbackUrl) {
    const state = mountNewsletterEntry(root, {
      title: root.dataset.offer || 'Stay connected',
      description: 'Choose the official next step for this brand. No new account is required on this companion page.',
      brand: root.dataset.brandName || 'this brand',
      mailchimpAction: publicConfig?.mailchimpAction || null,
      privacyUrl: publicConfig?.privacyUrl || null,
      consentFieldName: publicConfig?.consentFieldName || null,
      requireConsent: true,
      existingSignupUrl: fallbackUrl,
      fallbackLabel: root.dataset.offer ? 'Explore ' + root.dataset.offer : 'Visit the official website'
    });
    if (state.active || fallbackUrl) {
      root.hidden = false;
      section.classList.add('newsletter-enhanced');
    }
  }
}
