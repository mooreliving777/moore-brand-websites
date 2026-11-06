// Reusable public-page newsletter entry. NO API keys, storage, fake confirmations, or account creation.
// Only provider-issued Mailchimp embedded form actions can become active here.
export function validatedMailchimpAction(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) return null;
    if (!/(^|\.)list-manage\.com$/i.test(url.hostname)) return null;
    if (!/^\/subscribe\/post\/?$/.test(url.pathname)) return null;
    if (!url.searchParams.get('u') || !url.searchParams.get('id')) return null;
    return url.href;
  } catch { return null; }
}
export function validatedPublicLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
/**
 * Create a real native POST form only after the brand's hosted action and privacy
 * URL have been verified by the owner; otherwise link to its existing website.
 * Mailchimp itself processes verification, double opt-in, errors and unsubscribes.
 */
export function mountNewsletterEntry(root, {
  title = 'Get useful updates', description = 'News and practical ideas, sent with permission.',
  brand = 'this brand', mailchimpAction = null, privacyUrl = null,
  existingSignupUrl = null, requireConsent = true, consentFieldName = null
} = {}) {
  if (!root) throw new Error('A newsletter entry container is required.');
  const action = validatedMailchimpAction(mailchimpAction);
  const privacy = validatedPublicLink(privacyUrl);
  const fallback = validatedPublicLink(existingSignupUrl);
  const consentMapped = !requireConsent || (typeof consentFieldName === 'string' && /^gdpr\[\d{1,12}\]$/.test(consentFieldName));
  root.replaceChildren();
  root.classList.add('newsletter-entry');
  root.append(element('h3', 'newsletter-entry-title', title));
  root.append(element('p', 'newsletter-entry-description', description));

  // No "almost working" email inputs on a public site.
  if (!action || !privacy || !consentMapped) {
    if (fallback) {
      const link = element('a', 'newsletter-entry-link', 'Continue to official signup');
      link.href = fallback;
      link.rel = 'noopener noreferrer';
      root.append(link);
    } else root.append(element('p', 'newsletter-entry-notice', 'Email signup is not yet connected.'));
    return { active: false };
  }

  const form = element('form', 'newsletter-entry-form');
  form.method = 'POST';
  form.action = action;
  form.acceptCharset = 'UTF-8';

  const label = element('label', 'newsletter-entry-label', 'Email address');
  const email = document.createElement('input');
  email.type = 'email';
  email.name = 'EMAIL';
  email.autocomplete = 'email';
  email.inputMode = 'email';
  email.placeholder = 'you@example.com';
  email.maxLength = 320;
  email.required = true;
  label.append(email);
  form.append(label);

  if (requireConsent) {
    const consentLabel = element('label', 'newsletter-entry-consent');
    const consent = document.createElement('input');
    consent.type = 'checkbox';
    consent.name = consentFieldName;
    consent.value = 'Y';
    consent.required = true;
    consent.checked = false;
    consentLabel.append(consent, document.createTextNode(
      ' I agree to receive marketing updates from ' + brand + '. I can unsubscribe any time.'
    ));
    form.append(consentLabel);
  }

  const button = element('button', 'newsletter-entry-submit', 'Subscribe');
  button.type = 'submit';
  form.append(button);
  const notice = element('p', 'newsletter-entry-notice',
    'Subscription is handled by the mailing service. Email confirmation may be required.');
  const privacyLink = element('a', 'newsletter-entry-privacy', 'Privacy policy');
  privacyLink.href = privacy;
  privacyLink.rel = 'noopener noreferrer';
  root.append(form, notice, privacyLink);
  return { active: true };
}
