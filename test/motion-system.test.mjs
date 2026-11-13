import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
const root=resolve(import.meta.dirname,"..");
const pages=[];
function walk(folder){for(const name of readdirSync(folder)){if(name===".git"||name==="node_modules"||((folder.endsWith("/integrations"))&&name==="wix-sites"))continue;const p=join(folder,name);if(statSync(p).isDirectory())walk(p);else if(name.endsWith(".html"))pages.push(p)}}
walk(root);
test("All companion HTML pages load motion exactly once",()=>{
 assert.equal(pages.length,16,"Inventory changed: review scope before adjusting");
 for(const file of pages){
  const s=readFileSync(file,"utf8");const depth=relative(root,file).split("/").length-1;const prefix="../".repeat(depth);
  assert.ok(s.includes('href="'+prefix+'assets/motion.css"'),file+" css path");
  assert.ok(s.includes('src="'+prefix+'assets/motion.mjs"'),file+" script path");
  assert.equal((s.match(/assets\/motion\.css/g)||[]).length,1,file+" duplicate stylesheet");
  assert.equal((s.match(/assets\/motion\.mjs/g)||[]).length,1,file+" duplicate script");
 }
});
test("Accessibility and performance guards are in place",()=>{
 const css=readFileSync(join(root,"assets/motion.css"),"utf8");
 const js=readFileSync(join(root,"assets/motion.mjs"),"utf8");
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/opacity:1!important/);
 assert.match(js,/IntersectionObserver/);
 assert.match(js,/requestAnimationFrame/);
 assert.match(js,/if\(reduce&&reduce.matches\)return/);
 assert.doesNotMatch(js,/fetch\(|localStorage|XMLHttpRequest/);
});
