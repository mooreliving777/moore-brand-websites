// Offline, review-gated visual smoke checks for the ten-section brand landing pages.
// No purchases, publishing, subscriber submissions, external browsing or store changes.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifacts = path.join(root, 'artifacts');
await mkdir(artifacts, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json' };
const brands = [
  'leonard-e-moore','city-web-design-pros','moore-legacy-management',
  'the-harsh-truth-clothing','moore-computer-solutions','fireworks-tv',
  'bridge-to-better','amanda-halterman','ai-developer-portfolio',
  'the-harsh-truth-store','b3-the-place-2-be','rich-nerdz-nation','the-rich-rapper'
];
const steps = ['trust','problem','solution','explore','how','voices','pricing','faq','connect'];
const server = createServer(async (req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try { const data = await readFile(file); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = 'http://127.0.0.1:' + server.address().port;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const viewport of [{ width: 320, height: 750 },{ width: 390, height: 844 },{ width: 1366, height: 900 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    await context.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const slug of brands) {
      await page.goto(origin + '/' + slug + '/', { waitUntil: 'networkidle' });
      const result = await page.evaluate(order => {
        const ids = [...document.querySelectorAll('section[id]')].map(el => el.id).filter(id => order.includes(id));
        const brokenLocalAnchors = [...document.querySelectorAll('a[href^="#"]')].map(x => x.getAttribute('href').slice(1)).filter(id => id && !document.getElementById(id));
        const offenders = [...document.querySelectorAll('body *')].map(el => ({ el, rect:el.getBoundingClientRect() })).filter(({rect}) => rect.width && (rect.right > window.innerWidth + 2 || rect.left < -2)).slice(0,6).map(({el,rect}) => ({tag:el.tagName,class:el.className?.toString().slice(0,50),width:Math.round(rect.width),left:Math.round(rect.left),right:Math.round(rect.right)}));
        return { ids,brokenLocalAnchors,offenders,overflows:document.documentElement.scrollWidth > window.innerWidth + 2,cssLoaded:!![...document.styleSheets].find(sheet => sheet.href?.includes('landing-sections.css')) };
      }, steps);
      assert.deepEqual(result.ids, steps, slug + ' at ' + viewport.width + 'px: conversion sections must be in order');
      assert.equal(result.cssLoaded, true, slug + ': landing styling must load');
      assert.deepEqual(result.brokenLocalAnchors, [], slug + ': local anchors must resolve');
      assert.equal(result.overflows, false, slug + ': horizontal overflow at ' + viewport.width + 'px. Offenders: ' + JSON.stringify(result.offenders));
      const faq = page.locator('#faq details').first();
      assert.equal(await faq.isVisible(), true, slug + ': FAQ must be visible');
      await faq.locator('summary').click();
      assert.equal(await faq.getAttribute('open'), '', slug + ': FAQ must open with native interaction');
      await faq.locator('summary').click();
      assert.equal(await faq.getAttribute('open'), null, slug + ': FAQ must close');
      if (slug === 'leonard-e-moore') {
        const hub = page.locator('#moore-universe');
        assert.equal(await hub.isVisible(), true, 'Leonard: Moore Universe link hub visible');
        assert.equal(await page.locator('nav a[href="#moore-universe"]').count(), 1, 'Leonard: anchor to universe section');
        assert.equal(await hub.locator('a[href="https://leonardemoorellc.wordpress.com/projects-and-links/"]').count(), 1, 'Leonard: official public directory CTA');
        assert.equal(await hub.locator('a[href="https://mooreliving777.github.io/leonard-moore-portfolio/"]').count(), 1, 'Leonard: developer portfolio CTA');
      }
      if (viewport.width === 390 && ['leonard-e-moore','city-web-design-pros','the-harsh-truth-clothing','amanda-halterman'].includes(slug)) {
        await page.screenshot({ path: path.join(artifacts, slug + '-landing-390.png'), fullPage: true });
      }
      if (viewport.width === 1366 && slug === 'leonard-e-moore') {
        await page.screenshot({ path: path.join(artifacts, 'leonard-e-moore-universe-desktop.png'), fullPage: true });
      }
      if (viewport.width === 1366 && slug === 'city-web-design-pros') {
        await page.screenshot({ path: path.join(artifacts, 'city-web-landing-desktop.png'), fullPage: true });
      }
    }
    assert.deepEqual(errors, [], 'No JavaScript errors at ' + viewport.width + 'px');
    await context.close();
  }
  console.log('PASS: 13 brands x 3 viewports, section order, local anchors, FAQ toggle, no overflow, no external requests');
} finally {
  if (browser) await browser.close();
  await new Promise(done => server.close(done));
}
