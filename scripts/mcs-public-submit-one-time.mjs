// One-time production visitor QA: one benign, clearly marked Wix Forms submission.
// This file is never part of the ongoing release and must be removed after its run.
// No credentials, real customer data, attachments, remote access, or payments.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const url = 'https://mooreliving777.wixforms.com/f/7526317906712331460';
const marker = 'MCS-WEB-UI-QA-20261111-ONE-TIME';
const artifacts = path.resolve('artifacts');
await mkdir(artifacts,{recursive:true});
const browser = await chromium.launch({headless:true});
try {
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const res = await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  if(res?.status() !== 200) throw Error('Wix public form unavailable: HTTP '+res?.status());
  await page.locator('input[type="email"]').waitFor({state:'visible',timeout:16000});
  await page.locator('input[type="text"]').first().fill('MCS Internal QA');
  await page.locator('input[type="email"]').fill('mcs-qa-20261111@example.com');
  await page.locator('textarea').fill(marker + ' — INTERNAL QUALITY ASSURANCE ONLY. Please do not reply. This is a benign test of the real public support form; no customer device details or passwords were submitted.');
  const submit = page.getByRole('button',{name:/send support inquiry/i});
  await submit.waitFor({state:'visible',timeout:10000});
  await page.screenshot({path:path.join(artifacts,'mcs-public-submit-before.png'),fullPage:true});
  // Exactly ONE click. Never automatically retry or create a duplicate.
  await submit.click({timeout:10000});
  await page.waitForTimeout(4500);
  const body = await page.locator('body').innerText({timeout:10000});
  await page.screenshot({path:path.join(artifacts,'mcs-public-submit-after.png'),fullPage:true});
  const complete = /thanks.{0,120}(?:received|reaching out)|thank you|submitted successfully|message sent/i.test(body);
  console.log('PUBLIC_SUBMIT_OUTCOME '+JSON.stringify({
    url:page.url(),
    content:body.slice(0,850),
    successMessageVisible:complete,
    marker
  }));
  if(!complete)throw Error('No success message after ONE form click. See screenshot and inspect whether CAPTCHA, validation or network failure blocked the form.');
  console.log('PASS: a benign, one-time public visitor form submission received Wix success confirmation');
} finally {
 await browser.close();
}
