import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../moore-computer-solutions/index.html', import.meta.url), 'utf8');
const generator = readFileSync(new URL('../scripts/build.py', import.meta.url), 'utf8');

test('suspended WordPress support pages are not linked as current contact routes', () => {
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map(match => match[1]);
  const suspended = hrefs.filter(href => href.startsWith('https://moorecomputersolutions.wordpress.com'));
  assert.deepEqual(suspended, [], 'No click should lead to suspended WordPress service pages');
  assert.ok(hrefs.some(href => href.startsWith('https://headless-fmeiexgkjgp-mooreliving777-140e.wix-site-host.com')),
    'At least one published Wix overview route should be present');
});

test('readers see explicit suspension and unverified Wix intake disclosure', () => {
  assert.match(html, /WordPress (?:source|site|support pages).*suspended/i);
  assert.match(html, /contact routes still require verification|contact routes are not yet verified|contact and support routes need confirmation/i);
  assert.doesNotMatch(html, /id="journal"/, 'Suspended-site blog snapshots should not be offered as active pages');
  assert.doesNotMatch(html, /data-newsletter-entry/, 'Do not offer unverified subscription capture');
});

test('rebuild script retains the suspended-source guard', () => {
  assert.match(generator, /"suspended_source":True/);
  assert.match(generator, /if b\.get\("suspended_source"\): return b\["active_alt"\]/);
  assert.match(generator, /posts=\[\] if b\.get\("suspended_source"\)/);
});

test('MCS brand media is local typography rather than remote WordPress images', () => {
  const directory = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const metadata = JSON.parse(readFileSync(new URL('../data/site-map.json', import.meta.url), 'utf8'));
  const mcs = metadata.find(item => item.path === 'moore-computer-solutions/');
  assert.ok(mcs, 'MCS site should be listed');
  assert.equal(mcs.hero.type, 'local_brand_markup');
  assert.doesNotMatch(html, /moorecomputersolutions\.wordpress\.com\/wp-content\//);
  assert.doesNotMatch(directory, /moorecomputersolutions\.wordpress\.com\/wp-content\//);
  assert.doesNotMatch(html, /property="og:image"[^>]*wordpress\.com/);
  assert.match(html, /class="asset-fallback asset-fallback-hero mcs-brand-graphic"/);
  assert.match(directory, /class="asset-fallback asset-fallback-directory mcs-brand-graphic"/);
  assert.match(generator, /def branded_art\(b, size\)/);
});

test('permission-first safety checklist is visible but not a fake support intake form', () => {
  const start = html.indexOf('<section class="mcs-support-safety" id="support-safety"');
  const end = html.indexOf('</section>', start);
  assert.ok(start >= 0 && end > start, 'local support safety panel must exist');
  const section = html.slice(start, end + 10);
  assert.match(html, /class="button secondary" href="#support-safety">Before remote support/);
  assert.match(section, /Support intake has not been verified/);
  assert.match(section, /Start the request yourself/);
  assert.match(section, /Confirm identity and scope/);
  assert.match(section, /Keep control/);
  assert.match(section, /Close the session/);
  assert.match(section, /form submission, staff availability and response times have not been tested/);
  assert.doesNotMatch(section, /<form|<input|name="email"|checkout|payment-link/i);
  assert.match(section, /href="https:\/\/headless-fmeiexgkjgp-mooreliving777-140e\.wix-site-host\.com\/"/);
  assert.match(generator, /if b\.get\("suspended_source"\) and slug == "support_safety": return "#support-safety"/);
  assert.match(generator, /support_safety =/);
});
