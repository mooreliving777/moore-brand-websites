import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../leonard-e-moore/index.html', import.meta.url), 'utf8');
const generator = readFileSync(new URL('../scripts/build.py', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/network.css', import.meta.url), 'utf8');
const official = 'https://leonardemoorellc.wordpress.com/projects-and-links/';
const portfolio = 'https://mooreliving777.github.io/leonard-moore-portfolio/';

test('personal companion leads to current published Moore Universe directory', () => {
  assert.match(html, /<nav[^>]*>[^]*href="#moore-universe">All links<\/a>/);
  assert.match(html, /<section class="moore-universe" id="moore-universe" aria-labelledby="moore-universe-heading">/);
  assert.ok(html.includes(official));
  assert.ok(html.includes(portfolio));
  assert.match(html, /AI projects, music, media, fashion, learning resources and creator work/);
  assert.match(html, /Projects still in development are identified as such/);
});

test('new directory section is a neutral link hub with no forms or fake launch claims', () => {
  const a = html.indexOf('<section class="moore-universe"');
  const b = html.indexOf('</section>', a);
  assert.ok(a >= 0 && b > a);
  const section = html.slice(a, b + 10);
  assert.match(section, /does not imply that unpublished products or programs have launched/);
  assert.doesNotMatch(section, /<form|checkout|add-to-cart|<input|5-star|guaranteed launch/i);
  assert.match(section, /aria-hidden="true"/);
});

test('generator and responsive original CSS keep link hub during rebuild', () => {
  assert.match(generator, /"universe_hub":True/);
  assert.match(generator, /if b\.get\("universe_hub"\)/);
  assert.ok(generator.includes(official));
  assert.ok(generator.includes(portfolio));
  assert.match(css, /\.theme-leonard \.moore-universe\{/);
  assert.match(css, /@media\(max-width:390px\)/);
});
