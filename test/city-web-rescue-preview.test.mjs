import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../city-web-design-pros/index.html', import.meta.url), 'utf8');
const generator = readFileSync(new URL('../scripts/build.py', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../assets/network.css', import.meta.url), 'utf8');
const rescueUrl = 'https://citywebdesignprosllc.wordpress.com/website-rescue/';
const contactUrl = 'https://citywebdesignprosllc.wordpress.com/contact/';
const consultationUrl = 'https://calendly.com/mooreliving777/city-web-design-pros-website-consultation';

test('City Web hero and navigation can reach the featured website rescue panel', () => {
  assert.match(page, /<nav[^>]*>[^]*href="#rescue-preview">Rescue<\/a>/);
  assert.match(page, /class="button secondary" href="#rescue-preview">See \$99 Rescue/);
  assert.match(page, /class="city-rescue" id="rescue-preview" aria-labelledby="city-rescue-title"/);
  assert.match(page, /id="city-rescue-title"/);
  assert.match(page, /href="https:\/\/citywebdesignprosllc\.wordpress\.com\/services\/"/);
  assert.ok(page.includes(contactUrl));
});

test('Rescue offer follows original WordPress $99 terms, no price or payment shortcuts', () => {
  const begin = page.indexOf('<section class="city-rescue"');
  const end = page.indexOf('</section>', begin);
  assert.ok(begin !== -1 && end > begin, 'rescue panel must exist');
  const offer = page.slice(begin, end + 10);
  assert.ok(offer.includes(rescueUrl));
  assert.ok(offer.includes(consultationUrl));
  assert.match(offer, /eligible minor WordPress issue/);
  assert.match(offer, /confirmed in writing before you approve any payment or repair/);
  assert.match(offer, /Full redesigns, malware recovery, migrations and major development require separate assessment and pricing/);
  assert.match(offer, /does not collect payment or credentials/);
  assert.doesNotMatch(offer, /<form|cart\/add|buy-now|checkout\/|<input/i);
});

test('static generator retains City Web offer on rebuild and CSS supports small viewports', () => {
  assert.match(generator, /"rescue_offer":true/);
  assert.match(generator, /if b\["slug"\] == "city-web-design-pros" and slug == "rescue_preview": return "#rescue-preview"/);
  assert.match(generator, /if b\.get\("rescue_offer"\)/);
  assert.match(generator, /city_rescue =/);
  assert.ok(generator.includes(rescueUrl));
  assert.ok(generator.includes(consultationUrl));
  assert.match(styles, /\.theme-city \.city-rescue\{/);
  assert.match(styles, /@media\(max-width:780px\)/);
});
