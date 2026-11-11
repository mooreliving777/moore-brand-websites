import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('moore-computer-solutions/index.html', root), 'utf8');
const generator = readFileSync(new URL('scripts/build.py', root), 'utf8');
const directory = readFileSync(new URL('index.html', root), 'utf8');
const metadata = JSON.parse(readFileSync(new URL('data/site-map.json', root), 'utf8'));
const wixForm = 'https://mooreliving777.wixforms.com/f/7526317906712331460';

test('MCS routes to a Wix-hosted form, not suspended WordPress', () => {
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map(m => m[1]);
  assert.equal(hrefs.filter(h => h.startsWith('https://moorecomputersolutions.wordpress.com')).length, 0);
  assert.ok(hrefs.filter(h => h === wixForm).length >= 4, 'Inquiry should be prominent and reachable');
  assert.ok(hrefs.some(h => h.includes('headless-fmeiexgkjgp-mooreliving777-140e.wix-site-host.com')),
    'Keep the published Wix business overview as a secondary source, not a verified intake route');
  assert.ok(generator.includes('support_form_url'));
  assert.ok(generator.includes('mcs_brand_page(b)'));
});

test('MCS customer messaging does not promise support scheduling, payment or reply times', () => {
  assert.match(html, /Response times, pricing and service availability are confirmed separately/i);
  assert.match(html, /Human replies.*service availability.*not guaranteed|response times.*not guaranteed/i);
  assert.match(html, /WordPress (?:site|pages|support pages).*suspended/i);
  assert.doesNotMatch(html, /<form|<input|checkout\/|add-to-cart|data-newsletter-entry/i);
  assert.doesNotMatch(html, /id="journal"/);
});

test('a four-step remote support safety guide is linked from the MCS hero', () => {
  assert.match(html, /href="#support-safety">Before remote support/);
  const a = html.indexOf('<section class="mcs-support-safety" id="support-safety"');
  const b = html.indexOf('</section>', a);
  assert.ok(a > 0 && b > a);
  const section = html.slice(a,b+10);
  for(const phrase of ['Start the request yourself','Confirm identity and scope','Keep control','Close the session']) {
    assert.ok(section.includes(phrase), phrase);
  }
  assert.ok(section.includes(wixForm), 'Safety panel should lead to real inquiry form');
  assert.match(section, /passwords|access codes/);
  assert.doesNotMatch(section, /<form|<input|password="|collect payment/);
});

test('MCS network preview uses local original brand typography, never blocked WordPress imagery', () => {
  const entry = metadata.find(m => m.path === 'moore-computer-solutions/');
  assert.equal(entry?.hero?.type, 'local_brand_markup');
  assert.match(html, /mcs-brand-graphic/);
  assert.match(directory, /asset-fallback-directory mcs-brand-graphic/);
  assert.doesNotMatch(directory, /moorecomputersolutions\.wordpress\.com\/wp-content\//);
  assert.doesNotMatch(html, /property="og:image"[^>]*wordpress\.com/);
});

test('MCS support link remains separate from commerce and subscriptions', () => {
  assert.match(html, /Send a support inquiry/);
  assert.match(html, /This page does not collect account or payment information/);
  assert.doesNotMatch(html, /subscription form|newsletter sign-up|instant booking|guaranteed appointment/i);
});
