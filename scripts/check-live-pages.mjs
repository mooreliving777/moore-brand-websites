// Read-only production delivery smoke test for Moore Network GitHub Pages.
// No customer submissions, remote sessions, commerce, paid APIs, or app credentials.
// A successful GitHub Pages *deployment* is not enough: assert public content and
// the approved garment image can actually be fetched from the production host.
import process from 'node:process';

const base = new URL(process.env.PAGES_BASE_URL || 'https://mooreliving777.github.io/moore-brand-websites/');
const expectedHost = 'mooreliving777.github.io';
if (base.protocol !== 'https:' || base.hostname !== expectedHost || !base.pathname.endsWith('/moore-brand-websites/')) {
  throw new Error('Production smoke test must target the expected HTTPS GitHub Pages project root.');
}
const checks = [
  {
    name: 'Moore Network directory',
    path: '',
    contentType: 'text/html',
    markers: ['<title>The Moore Brand Network', 'href="the-harsh-truth-clothing/"', 'assets/ht01-signature-hoodie-preview.webp']
  },
  {
    name: 'The Harsh Truth Clothing concept',
    path: 'the-harsh-truth-clothing/',
    contentType: 'text/html',
    markers: [
      '<title>The Harsh Truth Clothing',
      'id="garment-preview"',
      'src="../assets/ht01-signature-hoodie-preview.webp"',
      'NOT FOR SALE',
      'NO PREORDERS',
      '/shop-vip-and-merchandise/'
    ]
  },
  {
    name: 'City Web Design Pros $99 Rescue',
    path: 'city-web-design-pros/',
    contentType: 'text/html',
    markers: [
      '<title>City Web Design Pros',
      'id="rescue-preview"',
      '$99',
      '/website-rescue/',
      'before payment'
    ]
  },
  {
    name: 'Leonard E. Moore Universe',
    path: 'leonard-e-moore/',
    contentType: 'text/html',
    markers: [
      '<title>Leonard E. Moore',
      'id="moore-universe"',
      '/projects-and-links/',
      'https://mooreliving777.github.io/leonard-moore-portfolio/'
    ]
  },
  {
    name: 'HT-01 approved garment preview image',
    path: 'assets/ht01-signature-hoodie-preview.webp',
    contentType: 'image/webp',
    signature: true
  },
  {
    name: 'Site layout stylesheet',
    path: 'assets/network.css',
    contentType: 'text/css',
    markers: ['.city-rescue', '.moore-universe', '.merch-preview']
  }
];
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
async function fetchWithRetries(url, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(16000),
        headers: {
          'Accept': '*/*',
          'Cache-Control': 'no-cache',
          'User-Agent': 'Moore-Network-GitHub-Pages-QA/1.0'
        }
      });
      if (response.status !== 200) {
        throw new Error('HTTP ' + response.status);
      }
      const type = (response.headers.get('content-type') || '').toLowerCase();
      const bytes = new Uint8Array(await response.arrayBuffer());
      return { type, bytes, url: response.url, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await wait(2000 * attempt);
    }
  }
  throw lastError;
}
function checkContent(check, data) {
  if (!data.type.includes(check.contentType)) {
    throw new Error('Expected Content-Type ' + check.contentType + ', got ' + (data.type || '(none)'));
  }
  if (!data.url.startsWith(base.href)) {
    throw new Error('Unexpected final URL: ' + data.url);
  }
  if (check.signature) {
    const ascii = new TextDecoder('ascii').decode(data.bytes.slice(0, 12));
    if (!(ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP')) {
      throw new Error('Production artwork is not a valid WEBP binary.');
    }
    if (data.bytes.length < 2500) throw new Error('Production garment preview is unexpectedly small.');
  } else {
    const body = new TextDecoder().decode(data.bytes);
    for (const marker of check.markers ?? []) {
      if (!body.includes(marker)) throw new Error('Missing approved content marker: ' + marker);
    }
  }
}
const results = await Promise.all(checks.map(async check => {
  const url = new URL(check.path, base).href;
  try {
    const result = await fetchWithRetries(url);
    checkContent(check, result);
    return { ok: true, name: check.name, url, bytes: result.bytes.length, attempts: result.attempts };
  } catch (error) {
    return { ok: false, name: check.name, url, error: String(error?.message || error) };
  }
}));
for (const item of results) {
  console.log((item.ok ? 'PASS' : 'FAIL') + ' ' + item.name + ' ' + item.url + (item.ok ? ' (' + item.bytes + ' bytes, attempt ' + item.attempts + ')' : ' — ' + item.error));
}
const failures = results.filter(item => !item.ok);
if (failures.length) {
  console.error('Public Pages QA failed: ' + failures.length + ' of ' + results.length + ' resources could not be verified.');
  process.exitCode = 1;
} else {
  console.log('PASS: all ' + results.length + ' live public Pages resources and approved content markers verified; external WordPress inquiry delivery and Shopify checkout were intentionally NOT tested.');
}
