import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const page = readFileSync(new URL('the-harsh-truth-clothing/index.html', root), 'utf8');
const directory = readFileSync(new URL('index.html', root), 'utf8');
const generator = readFileSync(new URL('scripts/build.py', root), 'utf8');
const meta = JSON.parse(readFileSync(new URL('data/site-map.json', root), 'utf8'));
const garmentUrl = 'https://cdn.shopify.com/s/files/1/0793/2772/3683/files/HT01_Italian_Inspired_Signature_Hoodie_CONCEPT_NOT_FOR_PRODUCTION.png?v=1794300807';

test('the approved garment mockup appears in the hero and network directory', () => {
  assert.match(page, /class="hero-art"><img src="https:\/\/cdn\.shopify\.com\/[^"]*HT01_Italian_Inspired_Signature_Hoodie_CONCEPT_NOT_FOR_PRODUCTION/);
  assert.ok(directory.includes(garmentUrl));
  assert.equal(meta.find(entry => entry.path === 'the-harsh-truth-clothing/').hero.url, garmentUrl);
  assert.ok(generator.includes('HT01_Italian_Inspired_Signature_Hoodie_CONCEPT_NOT_FOR_PRODUCTION'));
});

test('concept preview is review-only without checkout or misleading inventory claims', () => {
  const start = page.indexOf('<section class="merch-preview section" id="garment-preview"');
  assert.ok(start >= 0, 'merchandise preview section should be present');
  const end = page.indexOf('</section>', start);
  const panel = page.slice(start, end + 10);
  assert.match(panel, /NOT FOR SALE · NO PREORDERS · NO CHECKOUT/);
  assert.match(panel, /digital garment mockup/);
  assert.match(panel, /Manufacturer quotes, construction details and sample approval remain outstanding/);
  assert.match(panel, /href="https:\/\/theharshtruthclothinglinellc\.wordpress\.com\/shop-vip-and-merchandise\/"/);
  assert.doesNotMatch(panel, /add-to-cart|buy-now|cart\/add|checkout\/|<form/i);
  assert.match(page, /href="#garment-preview"/);
  assert.match(page, /not a manufactured garment or available inventory/);
});

test('generator has review-safe preview and inquiry route', () => {
  assert.match(generator, /if slug == "featured_concept": return "#garment-preview"/);
  assert.match(generator, /garment_preview =/);
  assert.match(generator, /if b\.get\("featured_concept"\)/);
  assert.match(generator, /shop-vip-and-merchandise/);
});
