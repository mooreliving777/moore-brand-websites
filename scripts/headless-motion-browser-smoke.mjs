/* Offline Playwright QA for the Wix Headless / Hostinger portable motion kit. */
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const fixture='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/integrations/headless/motion.css"></head><body data-moore-motion="city-web" data-mm-progress style="margin:0"><main><section style="min-height:90vh"><h1 data-mm="hero">Motion test</h1><div data-mm="hero-media">Visual test</div></section><section data-mm="reveal" style="min-height:110vh">Section two</section><section data-mm="reveal" style="min-height:110vh">Section three</section></main><script type="module" src="/integrations/headless/motion.mjs"></script></body></html>';
const mime={'.css':'text/css','.mjs':'text/javascript','.html':'text/html'};
const server=createServer(async(req,res)=>{
 let url;
 try{url=new URL(req.url,"http://localhost")}catch{res.writeHead(400).end();return}
 if(url.pathname==="/motion-fixture"){res.writeHead(200,{"Content-Type":"text/html"}).end(fixture);return}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 try{res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream"}).end(await readFile(file))}
 catch{res.writeHead(404).end()}
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
const origin="http://127.0.0.1:"+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const width of [390,1366]){
  for(const reducedMotion of ["reduce","no-preference"]){
   const ctx=await browser.newContext({viewport:{width,height:840},reducedMotion});
   await ctx.route("**/*",r=>r.request().url().startsWith(origin+"/")?r.continue():r.abort());
   const page=await ctx.newPage(),errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto(origin+"/motion-fixture",{waitUntil:"networkidle"});
   const state=await page.evaluate(()=>({
     active:document.body.classList.contains("mm-ready"),
     progress:document.querySelectorAll(".mm-scroll-progress").length,
     width:document.documentElement.scrollWidth,
     heading:document.querySelector("h1")?.textContent,
     style:[...document.styleSheets].some(x=>x.href?.endsWith("/integrations/headless/motion.css"))
   }));
   assert.equal(state.heading,"Motion test");
   assert.equal(state.style,true);
   assert.equal(state.active,reducedMotion==="no-preference");
   assert.equal(state.progress,reducedMotion==="no-preference"?1:0);
   assert.ok(state.width<=width+2,"overflow at "+width+": "+state.width);
   if(reducedMotion==="no-preference"){
     await page.locator("section").last().scrollIntoViewIfNeeded();
     await page.waitForTimeout(110);
     await page.emulateMedia({reducedMotion:"reduce"});
     await page.waitForTimeout(50);
     assert.equal(await page.locator(".mm-scroll-progress").count(),0,"change to reduced motion removes bar");
     assert.equal(await page.locator(".mm-pending").count(),0,"change reveals all content");
   }
   assert.deepEqual(errors,[],"no page errors");
   await ctx.close();
  }
 }
 const ctx=await browser.newContext({viewport:{width:390,height:840},javaScriptEnabled:false});
 await ctx.route("**/*",r=>r.request().url().startsWith(origin+"/")?r.continue():r.abort());
 const page=await ctx.newPage();await page.goto(origin+"/motion-fixture",{waitUntil:"load"});
 assert.equal(await page.locator("h1").isVisible(),true,"content visible with JS disabled");
 assert.equal(await page.locator(".mm-scroll-progress").count(),0);
 await ctx.close();
 console.log("PASS portable headless motion: 2 widths, both preferences, runtime change, no-JS fallback");
}finally{if(browser)await browser.close();await new Promise(done=>server.close(done))}
