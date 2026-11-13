/* Browser QA for complete *staged* Wix source; never contacts live Wix, Shopify or WordPress. */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const sites=[
 {name:"City Web",slug:"city-web",pages:["index.html","contact.html","explore.html","subscribe.html"],brand:"city-web"},
 {name:"Harsh Truth",slug:"harsh-truth",pages:["index.html","amanda-collection.html","collection-preview.html","contact.html","faq-and-fulfillment.html","our-story.html","subscribe.html"],brand:"harsh-truth"}
];
const mime={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".mjs":"text/javascript",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg"};
async function makeSiteServer(site){
 const directory=path.join(root,"integrations","wix-sites",site.slug);
 const server=createServer(async (req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname)}
  catch{res.writeHead(400).end();return}
  if(pathname.endsWith("/"))pathname+="index.html";
  const filepath=path.resolve(directory,"."+pathname);
  if(!filepath.startsWith(directory+path.sep)){res.writeHead(403).end();return}
  try{res.writeHead(200,{"Content-Type":mime[path.extname(filepath)]||"application/octet-stream"}).end(await readFile(filepath))}
  catch{res.writeHead(404).end()}
 });
 await new Promise(done=>server.listen(0,"127.0.0.1",done));
 return {server,origin:"http://127.0.0.1:"+server.address().port};
}
let browser;
const overflowFailures=[];
try{
 browser=await chromium.launch({headless:true});
 for(const site of sites){
  const {server,origin}=await makeSiteServer(site);
  try{
   for(const width of [390,1366]){
    for(const mode of ["reduce","no-preference"]){
     const context=await browser.newContext({viewport:{width,height:860},reducedMotion:mode});
     await context.route("**/*",route=>route.request().url().startsWith(origin+"/")?route.continue():route.abort());
     const page=await context.newPage(),errors=[];
     page.on("pageerror",err=>errors.push(err.message));
     for(const file of site.pages){
      await page.goto(origin+"/"+file,{waitUntil:"domcontentloaded"});
      await page.waitForTimeout(80);
      const result=await page.evaluate(()=>({
       css:[...document.styleSheets].some(x=>x.href?.endsWith("/motion.css")),
       script:performance.getEntriesByType("resource").some(x=>x.name.endsWith("/motion.mjs")),
       active:document.body.classList.contains("mm-ready"),
       enabled:document.body.hasAttribute("data-mm-progress"),
       progress:document.querySelectorAll(".mm-scroll-progress").length,
       brand:document.body.getAttribute("data-moore-motion"),
       heading:!!document.querySelector("h1"),
       width:innerWidth,
       scrollWidth:document.documentElement.scrollWidth,
       offending:[...document.querySelectorAll("body *")].map(el=>({el,rect:el.getBoundingClientRect()})).filter(x=>x.rect.width&&(x.rect.right>innerWidth+2||x.rect.left<-2)).slice(0,3).map(x=>({tag:x.el.tagName,cls:String(x.el.className).slice(0,75),right:Math.round(x.rect.right)}))
      }));
      assert.equal(result.css,true,site.name+"/"+file+" CSS");
      assert.equal(result.script,true,site.name+"/"+file+" JS");
      assert.equal(result.brand,site.brand);
      assert.equal(result.active,mode==="no-preference",site.name+"/"+file+" reduced motion setting");
      assert.equal(result.progress,mode==="no-preference"&&result.enabled?1:0,site.name+"/"+file+" scroll bar");
      assert.equal(result.heading,true,site.name+"/"+file+" heading");
      if(result.scrollWidth>result.width+2)overflowFailures.push(site.name+"/"+file+" "+width+"px overflow to "+result.scrollWidth+": "+JSON.stringify(result.offending));
      assert.deepEqual(errors,[],site.name+"/"+file+" browser errors");
      if(width===390&&mode==="no-preference"&&file==="index.html"){
       const menu=page.locator(site.slug==="city-web"?"button.menu":"button.nav-toggle");
       if(await menu.count()&&await menu.isVisible()){
        await menu.click();
        assert.equal(await menu.getAttribute("aria-expanded"),"true",site.name+" mobile menu should open");
        await menu.click();
        assert.equal(await menu.getAttribute("aria-expanded"),"false",site.name+" mobile menu should close");
       }
       await page.locator("main section").last().scrollIntoViewIfNeeded();
       await page.waitForTimeout(100);
       await page.emulateMedia({reducedMotion:"reduce"});
       await page.waitForTimeout(90);
       assert.equal(await page.locator(".mm-pending").count(),0,site.name+" all delayed content visible when reduced motion toggled");
       assert.equal(await page.locator(".mm-scroll-progress").count(),0,site.name+" progress removed on preference change");
       await page.emulateMedia({reducedMotion:"no-preference"});
      }
     }
     await context.close();
    }
   }
   const ctx=await browser.newContext({viewport:{width:390,height:860},javaScriptEnabled:false});
   await ctx.route("**/*",route=>route.request().url().startsWith(origin+"/")?route.continue():route.abort());
   const page=await ctx.newPage();await page.goto(origin+"/",{waitUntil:"load"});
   assert.equal(await page.locator("main h1").isVisible(),true,site.name+" visible with JS disabled");
   await ctx.close();
  }finally{await new Promise(done=>server.close(done))}
 }
 assert.deepEqual(overflowFailures,[],"Responsive overflow findings across all Wix pages");
 console.log("PASS staged Wix motion: 11 pages, 2 widths, 2 motion modes, navigation, runtime preference, no-JS");
}finally{if(browser)await browser.close()}
