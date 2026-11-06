// Real Chromium smoke checks for progressive newsletter entries.
// Serves static files locally with browser access restricted to localhost.
// Never submits a subscriber email or visits WordPress/Mailchimp.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const captures = path.join(root, 'artifacts');
await mkdir(captures, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch { res.writeHead(400).end(); return; }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
const nativeBrands = [
  'leonard-e-moore','city-web-design-pros','moore-legacy-management',
  'the-harsh-truth-clothing','fireworks-tv','bridge-to-better',
  'amanda-halterman','ai-developer-portfolio'
];
const noSignupBrands = ['moore-computer-solutions','b3-the-place-2-be','the-harsh-truth-store'];
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.route('**/*', route => {
    const url = route.request().url();
    return url.startsWith(origin + '/') ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  for (const slug of nativeBrands) {
    await page.goto(origin + '/' + slug + '/', { waitUntil: 'domcontentloaded' });
    await page.locator('#connect.newsletter-enhanced').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.asset-fallback-hero').waitFor({ state: 'visible', timeout: 10000 });
    assert.equal(await page.locator('.hero-art img').count(), 0, slug + ': blocked hero photo should be replaced');
    assert.equal(await page.locator('.asset-fallback-hero').getAttribute('role'), 'img');
    const section = page.locator('#connect');
    const sourceCTA = section.locator('a.button.primary');
    assert.equal(await sourceCTA.isVisible(), false, slug + ': original button should be replaced only after validated enhancement');
    const rootEntry = section.locator('[data-newsletter-entry]');
    assert.equal(await rootEntry.isVisible(), true, slug + ': native link should be visible');
    assert.equal(await rootEntry.locator('form').count(), 0, 'No unverified email form should be rendered');
    const url = await sourceCTA.getAttribute('href');
    assert.equal(await rootEntry.locator('a.newsletter-entry-link').getAttribute('href'), url,
      slug + ': enhanced CTA must preserve the exact approved original destination');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), true,
      slug + ': mobile viewport should have no horizontal overflow');
    if (slug === 'city-web-design-pros') {
      await page.screenshot({ path: path.join(captures, 'city-web-newsletter-mobile.png'), fullPage: true });
    }
  }

  for (const slug of noSignupBrands) {
    await page.goto(origin + '/' + slug + '/', { waitUntil: 'networkidle' });
    const section = page.locator('#connect');
    assert.equal(await section.locator('a.button.primary').isVisible(), true,
      slug + ': keep the original booking/resource link');
    assert.equal(await section.locator('[data-newsletter-entry]').isHidden(), true,
      slug + ': do not imply a working newsletter provider');
    assert.equal(await section.locator('form').count(), 0);
    if (slug === 'b3-the-place-2-be') {
      await page.screenshot({ path: path.join(captures, 'b3-booking-fallback-mobile.png'), fullPage: true });
    }
  }

  await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
  // Lazy directory pictures outside the viewport won't fail until requested.
  // Force them all to load in this synthetic offline test before counting.
  await page.evaluate(() => {
    for (const img of document.querySelectorAll('.directory-card img')) img.loading = 'eager';
  });
  await page.waitForFunction(() => document.querySelectorAll('.directory-card img').length === 0,
    null, { timeout: 10000 });
  await page.locator('.directory-card .asset-fallback-directory').first().waitFor({ state: 'visible' });
  assert.equal(await page.locator('.directory-card .asset-fallback-directory').count(), 13,
    'All thirteen blocked network thumbnails should have branded fallbacks');
  assert.equal(await page.locator('.directory-card img').count(), 0);
  await page.screenshot({ path: path.join(captures, 'network-directory-gradient-fallback.png'), fullPage: true });
  await context.close();
  const noJs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const plainPage = await noJs.newPage();
  await plainPage.goto(origin + '/city-web-design-pros/', { waitUntil: 'domcontentloaded' });
  assert.equal(await plainPage.locator('#connect a.button.primary').isVisible(), true,
    'Original City Web signup link must remain usable without JavaScript');
  assert.equal(await plainPage.locator('[data-newsletter-entry]').isHidden(), true);
  await plainPage.screenshot({ path: path.join(captures, 'city-web-no-javascript-fallback.png'), fullPage: true });
  await noJs.close();
  assert.deepEqual(errors, [], 'Static newsletter enhancer should have no browser errors');
  console.log('PASS: eight verified native links, three non-newsletter fallbacks, mobile and no-JS Chromium checks');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
