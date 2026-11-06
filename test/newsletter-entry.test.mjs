import test from 'node:test';
import assert from 'node:assert/strict';
import { validatedMailchimpAction, validatedPublicLink } from '../assets/newsletter-entry.mjs';

const good = 'https://us21.list-manage.com/subscribe/post?u=demo-public-embed-id&id=example-list';
test('only HTTPS public Mailchimp POST endpoints with expected IDs can collect email', () => {
  assert.equal(validatedMailchimpAction(good), good);
  for (const url of [
    'https://evil.example/subscribe/post?u=1&id=2',
    'http://us21.list-manage.com/subscribe/post?u=1&id=2',
    'https://list-manage.com.evil.example/subscribe/post?u=1&id=2',
    'https://us21.list-manage.com/subscribe/post?u=1',
    'https://us21.list-manage.com/subscribe/post?u=1&id=2#bad',
    'https://us21.list-manage.com/subscribe/post-json?u=1&id=2',
    '', null
  ]) assert.equal(validatedMailchimpAction(url), null, String(url));
});
test('links must be public HTTPS and never include credentials', () => {
  assert.equal(validatedPublicLink('https://example.org/signup'), 'https://example.org/signup');
  for (const url of ['javascript:alert(1)', 'http://example.org', 'https://user:pw@example.org', null]) {
    assert.equal(validatedPublicLink(url), null);
  }
});
