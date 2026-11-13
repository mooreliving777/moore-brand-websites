import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitesRoot = path.join(root, "integrations", "wix-sites");
const sites = readdirSync(sitesRoot).filter(name =>
  statSync(path.join(sitesRoot, name)).isDirectory()
);

function localTarget(siteRoot, source, raw) {
  const url = raw.trim();
  if (!url || /^(?:#|\/\/|[a-z][a-z0-9+.-]*:)/i.test(url) || /[{}]/.test(url)) return null;
  const withoutSuffix = url.split(/[?#]/, 1)[0];
  if (!withoutSuffix) return null;
  let decoded;
  try { decoded = decodeURIComponent(withoutSuffix); }
  catch { return { error: "invalid percent escape: " + raw }; }
  const from = decoded.startsWith("/")
    ? path.join(siteRoot, decoded.replace(/^\/+/, ""))
    : path.resolve(path.dirname(source), decoded);
  const full = path.normalize(from);
  if (!full.startsWith(siteRoot + path.sep) && full !== siteRoot)
    return { error: "link escapes site root: " + raw };
  const target = decoded.endsWith("/") ? path.join(full, "index.html") : full;
  return { target, label: raw };
}

test("all staged Wix pages retain valid internal file references", () => {
  assert.equal(sites.length, 12, "site inventory changed: review deployment scope");
  let pages = 0;
  let refs = 0;
  const issues = [];
  for (const slug of sites) {
    const siteRoot = path.join(sitesRoot, slug);
    for (const file of readdirSync(siteRoot).filter(name => name.endsWith(".html"))) {
      const full = path.join(siteRoot, file);
      const html = readFileSync(full, "utf8");
      pages++;
      for (const match of html.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)) {
        const candidate = localTarget(siteRoot, full, match[2]);
        if (!candidate) continue;
        refs++;
        if (candidate.error) { issues.push(slug + "/" + file + ": " + candidate.error); continue; }
        if (!existsSync(candidate.target))
          issues.push(slug + "/" + file + ": missing " + match[2]);
      }
    }
  }
  assert.equal(pages, 41, "expected Wix page inventory changed");
  assert.deepEqual(issues, [], "Missing internal references across " + refs + " local references");
  console.log("Passed " + pages + " staged Wix HTML pages; " + refs + " local references checked.");
});
