// Local-only visual fallback when a third-party image is blocked or unavailable.
// Successful images remain unchanged. No fetching, trackers, or remote substitute assets.
const candidates = document.querySelectorAll(
  '.hero-art > img, .journal-card a > img, .directory-card > img'
);
for (const img of candidates) {
  const replaceBroken = () => {
    if (!img.isConnected || img.naturalWidth > 0) return;
    const hero = img.parentElement?.classList.contains('hero-art');
    const directory = img.parentElement?.classList.contains('directory-card');
    const kind = hero ? 'hero' : directory ? 'directory' : 'journal';
    const brandName = document.querySelector('meta[property="og:title"]')?.content ||
      document.querySelector('.brand')?.textContent?.trim() ||
      'Moore Brand Network';
    const title = hero ? brandName
      : (img.parentElement?.querySelector('h3,h2')?.textContent?.trim() || brandName);
    const asset = document.createElement('span');
    asset.className = 'asset-fallback asset-fallback-' + kind;
    asset.setAttribute('role', 'img');
    asset.setAttribute('aria-label', img.getAttribute('alt') || title);
    const symbol = document.createElement('span');
    symbol.className = 'asset-fallback-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = '✦';
    const kicker = document.createElement('span');
    kicker.className = 'asset-fallback-kicker';
    kicker.textContent = hero ? 'CREATIVE · BUSINESS · CULTURE' :
      directory ? 'MOORE BRAND NETWORK' : 'IDEAS · INSIGHTS · GROWTH';
    const headline = document.createElement('strong');
    headline.className = 'asset-fallback-title';
    headline.textContent = title.slice(0, 90);
    asset.append(symbol, kicker, headline);
    img.replaceWith(asset);
  };
  img.addEventListener('error', replaceBroken, { once: true });
  if (img.complete && img.naturalWidth === 0) replaceBroken();
}
