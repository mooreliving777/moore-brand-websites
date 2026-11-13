import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const targets={
  "city-web": [
    "index.html",
    "contact.html",
    "explore.html",
    "subscribe.html"
  ],
  "harsh-truth": [
    "index.html",
    "amanda-collection.html",
    "collection-preview.html",
    "contact.html",
    "faq-and-fulfillment.html",
    "our-story.html",
    "subscribe.html"
  ],
  "computer": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "bridge-to-better": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "moorvio-wix": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "fireworks": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "harsh-truth-store": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "amanda": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "developer-wix": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "leonard": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "b3": [
    "index.html",
    "about.html",
    "contact.html"
  ],
  "moore-legacy": [
    "index.html",
    "about.html",
    "contact.html"
  ]
};
const brandKeys={
  "city-web": "city-web",
  "harsh-truth": "harsh-truth",
  "computer": "computer",
  "bridge-to-better": "foundation",
  "moorvio-wix": "moorvio",
  "fireworks": "fireworks",
  "harsh-truth-store": "clothing",
  "amanda": "amanda",
  "developer-wix": "developer",
  "leonard": "leonard",
  "b3": "b3",
  "moore-legacy": "legacy"
};

test("Wix source copies include complete motion integration and preserve key links",()=>{
 for(const [brand,pages] of Object.entries(targets)){
  const folder=path.join(root,"integrations","wix-sites",brand);
  for(const file of pages){
   const html=readFileSync(path.join(folder,file),"utf8");
   assert.match(html,/href="motion.css"/,brand+"/"+file);
   assert.match(html,/src="motion.mjs"/,brand+"/"+file);
   assert.ok(html.includes('data-moore-motion="'+brandKeys[brand]+'"'),brand+"/"+file+" brand scope");
   assert.equal((html.match(/href="motion\.css"/g)||[]).length,1);
   assert.equal((html.match(/src="motion\.mjs"/g)||[]).length,1);
   assert.match(html,/<h1\b/i);
  }
  const js=readFileSync(path.join(folder,"motion.mjs"),"utf8");
  const css=readFileSync(path.join(folder,"motion.css"),"utf8");
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.doesNotMatch(css,/translate3d\(16px,9px,0\)/,"Hero entrance must not push content outside narrow viewports");
  assert.match(js,/IntersectionObserver/);
  assert.doesNotMatch(js,/fetch\s*\(|localStorage|sessionStorage|document\.cookie/);
 }
 const city=readFileSync(path.join(root,"integrations/wix-sites/city-web/index.html"),"utf8");
 assert.match(city,/citywebdesignprosllc\.wordpress\.com\/contact\//);
 assert.match(city,/WordPress Rescue/i);
 const clothing=readFileSync(path.join(root,"integrations/wix-sites/harsh-truth/index.html"),"utf8");
 assert.match(clothing,/collection/i);
});
