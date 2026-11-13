import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const targets={ "city-web":["index.html","contact.html","explore.html","subscribe.html"],
 "harsh-truth":["index.html","amanda-collection.html","collection-preview.html","contact.html","faq-and-fulfillment.html","our-story.html","subscribe.html"] };
test("Wix source copies include complete motion integration and preserve key links",()=>{
 for(const [brand,pages] of Object.entries(targets)){
  const folder=path.join(root,"integrations","wix-sites",brand);
  for(const file of pages){
   const html=readFileSync(path.join(folder,file),"utf8");
   assert.match(html,/href="motion.css"/,brand+"/"+file);
   assert.match(html,/src="motion.mjs"/,brand+"/"+file);
   assert.match(html,/data-moore-motion="(?:city-web|harsh-truth)"/,brand+"/"+file);
   assert.equal((html.match(/href="motion\.css"/g)||[]).length,1);
   assert.equal((html.match(/src="motion\.mjs"/g)||[]).length,1);
   assert.match(html,/<h1\b/i);
  }
  const js=readFileSync(path.join(folder,"motion.mjs"),"utf8");
  const css=readFileSync(path.join(folder,"motion.css"),"utf8");
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(js,/IntersectionObserver/);
  assert.doesNotMatch(js,/fetch\s*\(|localStorage|sessionStorage|document\.cookie/);
 }
 const city=readFileSync(path.join(root,"integrations/wix-sites/city-web/index.html"),"utf8");
 assert.match(city,/citywebdesignprosllc\.wordpress\.com\/contact\//);
 assert.match(city,/WordPress Rescue/i);
 const clothing=readFileSync(path.join(root,"integrations/wix-sites/harsh-truth/index.html"),"utf8");
 assert.match(clothing,/collection/i);
});
