// Visit the actual Wix-hosted Moore Computer Solutions standalone inquiry form.
// Read-only browser check: never fills or submits an email, password, or ticket.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const destination = 'https://mooreliving777.wixforms.com/f/7526317906712331460';
const artifacts = path.resolve('artifacts');
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });
let output = {};
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const response = await page.goto(destination, { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Allow Wix's client-side form to hydrate; do not assume networkidle for analytics.
  await page.waitForTimeout(3500);
  const frames = [];
  for (const frame of page.frames()) {
    try {
      const body = (await frame.locator('body').innerText({ timeout: 6000 })).slice(0, 2000);
      const fields = await frame.locator('input, textarea, button, [role="textbox"]').evaluateAll(els =>
        els.slice(0, 30).map(el => ({
          tag: el.tagName.toLowerCase(),
          type: el.getAttribute('type'),
          label: el.getAttribute('aria-label'),
          text: (el.innerText || '').slice(0, 80),
          placeholder: el.getAttribute('placeholder')
        }))
      );
      frames.push({ url: frame.url(), body, fields });
    } catch (error) {
      frames.push({ url: frame.url(), error: String(error).slice(0, 150) });
    }
  }
  await page.screenshot({ path: path.join(artifacts, 'mcs-real-wixforms-phone-390.png'), fullPage: true });
  output = {
    url: page.url(),
    title: await page.title(),
    http: response?.status(),
    frames
  };
  console.log('FORM_DIAGNOSTICS ' + JSON.stringify(output).slice(0, 6500));
  assert.equal(output.http, 200, 'Wix public form URL must return HTTP 200');
  assert.match(output.url, /wixforms\.com\/f\/7526317906712331460/, 'Form must stay on its official Wix Forms public address');
  const texts = frames.map(frame => frame.body || '').join(' ').toLowerCase();
  assert.match(texts, /email/, 'A visitor must see the email input label');
  assert.match(texts, /briefly describe your issue|do not share passwords/, 'A visitor must see the safe problem-description field');
  assert.match(texts, /support inquiry|send support inquiry/, 'A visitor must see the MCS inquiry context');
  const inputs = frames.flatMap(frame => frame.fields || []);
  assert.ok(inputs.some(field => (field.type || '').toLowerCase() === 'email' || /email/i.test(field.label || '') || /email/i.test(field.placeholder || '')),
    'A real visible email form input must be present');
  assert.ok(inputs.some(field => field.tag === 'textarea' || /textbox|describe|issue/i.test(field.label || '')),
    'A real message input must be present');
  console.log('PASS MCS public standalone Wix Form renders required safe inquiry fields at 390px; no submission made');
} finally {
  await browser.close();
}
