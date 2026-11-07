import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chooseNewsletterRoute } from '../assets/newsletter-routing.mjs';

const expectedNative = {
 'leonard-e-moore': 'https://leonardemoorellc.wordpress.com/legacy-insider-letter/',
 'city-web-design-pros': 'https://citywebdesignprosllc.wordpress.com/free-website-growth-guide/',
 'moore-legacy-management': 'https://moorelegacymanagementgroupllc.wordpress.com/partnership-readiness/',
 'the-harsh-truth-clothing': 'https://theharshtruthclothinglinellc.wordpress.com/vip-drop-alerts/',
 'fireworks-tv': 'https://fireworkstv.wordpress.com/fireworks-inside-track/',
 'bridge-to-better': 'https://thebridgetobetterfoundationinc.wordpress.com/community-updates/',
 'amanda-halterman': 'https://amandahaltermanllc.wordpress.com/amanda-inside-updates/',
 'ai-developer-portfolio': 'https://leonardemooreaideveloperportfo.wordpress.com/digital-innovation-brief/'
};

test('only eight verified WordPress pages receive a native signup route', async () => {
 const cfg=JSON.parse(await readFile(new URL('../data/newsletter-public-config.json', import.meta.url),'utf8'));
 assert.equal(cfg.version,1);
 assert.deepEqual(Object.keys(cfg.brands).sort(),Object.keys(expectedNative).sort());
 for(const [slug,url] of Object.entries(expectedNative)) {
   assert.equal(cfg.brands[slug].service,'wordpress_jetpack');
   assert.equal(cfg.brands[slug].hostedSignupUrl,url);
   assert.equal(chooseNewsletterRoute(cfg.brands[slug],url).kind,'native');
   assert.equal(chooseNewsletterRoute(cfg.brands[slug],url+'wrong').kind,'none');
   const html=await readFile(new URL('../'+slug+'/index.html',import.meta.url),'utf8');
   const section=html.slice(html.indexOf('<section class="connect section"'));
   const actual=section.match(/<a class="button primary" href="([^"]+)"/)?.[1];
   assert.equal(actual,url,slug+' original CTA must match reviewed provider destination');
 }
});
test('suspended and non-subscription brands stay in original-link mode', async () => {
 const cfg=JSON.parse(await readFile(new URL('../data/newsletter-public-config.json',import.meta.url),'utf8'));
 for(const slug of ['moore-computer-solutions','b3-the-place-2-be','the-harsh-truth-store']) {
   assert.equal(cfg.brands[slug],undefined);
   assert.equal(chooseNewsletterRoute(cfg.brands[slug],'https://example.org/guide').kind,'none');
 }
});
test('unverified marketing providers, mismatched destinations and unsafe consent are rejected', () => {
 const destination='https://example.org/updates';
 const valid={
   service:'mailchimp_embedded',
   ownerApproved:true,
   mailchimpAction:'https://us21.list-manage.com/subscribe/post?u=public-id&id=list-id',
   privacyUrl:'https://example.org/privacy',
   consentFieldName:'gdpr[123456]'
 };
 assert.equal(chooseNewsletterRoute(valid,destination).kind,'mailchimp');
 for(const edit of [
   {ownerApproved:false},{ownerApproved:'true'}, {service:'other'},
   {mailchimpAction:'https://attack.example/subscribe/post?u=1&id=2'},
   {privacyUrl:'javascript:alert(1)'},{consentFieldName:'EMAIL'}
 ]) assert.equal(chooseNewsletterRoute({...valid,...edit},destination).kind,'none',JSON.stringify(edit));
 assert.equal(chooseNewsletterRoute(valid,'http://example.org/updates').kind,'none');
 assert.equal(chooseNewsletterRoute({service:'wordpress_jetpack',hostedSignupUrl:'https://evil.example/updates'},destination).kind,'none');
});
