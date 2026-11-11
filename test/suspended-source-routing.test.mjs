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
