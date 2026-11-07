import { validatedMailchimpAction, validatedPublicLink, validatedConsentField } from './newsletter-entry.mjs';

// A pure decision boundary between published, reviewed signup routes and
// unverified/disabled offers. No network calls and no side effects.
export function chooseNewsletterRoute(publicConfig, existingButtonUrl) {
  const existing = validatedPublicLink(existingButtonUrl);
  if (!existing || !publicConfig || typeof publicConfig !== 'object') return { kind: 'none' };
  if (publicConfig.service === 'wordpress_jetpack') {
    const hosted = validatedPublicLink(publicConfig.hostedSignupUrl);
    return hosted === existing ? { kind: 'native', fallbackUrl: existing } : { kind: 'none' };
  }
  if (publicConfig.service === 'mailchimp_embedded' && publicConfig.ownerApproved === true) {
    const action = validatedMailchimpAction(publicConfig.mailchimpAction);
    const privacyUrl = validatedPublicLink(publicConfig.privacyUrl);
    const consent = validatedConsentField(publicConfig.consentFieldName);
    if (action && privacyUrl && consent) {
      return { kind: 'mailchimp', fallbackUrl: existing, action, privacyUrl, consentFieldName: consent };
    }
  }
  return { kind: 'none' };
}
