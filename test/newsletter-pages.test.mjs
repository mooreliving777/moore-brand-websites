import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const brands = [
 'leonard-e-moore','city-web-design-pros','moore-legacy-management',
 'the-harsh-truth-clothing','fireworks-tv',
 'bridge-to-better','amanda-halterman','ai-developer-portfolio',
 'the-harsh-truth-store','b3-the-place-2-be'
];
test('ten connected brand pages retain a non-live signup enhancement and original CTA', async () => {
 for(const slug of brands) {
   const html = await readFile(new URL('../'+slug+'/index.html', import.meta.url), 'utf8');
   assert.match(html, /data-newsletter-entry/);
   assert.match(html, /newsletter-entry\.css/);
   assert.match(html, /newsletter-wiring\.mjs/);
   assert.match(html, /<a class="button primary" href=/);
   assert.match(html, /newsletter-entry-root[^>]*hidden>/);
   assert.doesNotMatch(html, /<form[^>]+action="https:\/\//);
 }
});
test('legacy pages remain unchanged and without newsletter entry', async () => {
 for (const slug of ['rich-nerdz-nation','the-rich-rapper']) {
  const html = await readFile(new URL('../'+slug+'/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-newsletter-entry|newsletter-wiring\.mjs/);
 }
});


test('suspended Moore Computer Solutions source has no unverified newsletter signup enhancement', async () => {
 const html = await readFile(new URL('../moore-computer-solutions/index.html', import.meta.url), 'utf8');
 assert.doesNotMatch(html, /data-newsletter-entry|newsletter-wiring\.mjs|newsletter-entry\.css/);
 assert.match(html, /WordPress (?:source|site|support pages).*suspended/i);
 assert.match(html, /headless-fmeiexgkjgp-mooreliving777-140e\.wix-site-host\.com/);
});
