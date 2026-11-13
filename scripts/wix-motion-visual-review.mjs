/* Staged Wix visual review — screenshots only. No Wix publishing, checkout, or customer APIs. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const home=path.join(base,"integrations","wix-sites");
const out=path.join(base,"artifacts","wix-motion-visual-review");
await mkdir(out,{recursive:true});
const sites=[
["City Web Design Pros","city-web"],["The Harsh Truth Clothing Line","harsh-truth"],
["Moore Computer Solutions","computer"],["Bridge to Better","bridge-to-better"],
["Moorvio","moorvio-wix"],["Fireworks TV","fireworks"],
["Harsh Truth Store Preview","harsh-truth-store"],["Amanda Halterman","amanda"],
["Leonard AI Developer Portfolio","developer-wix"],["Leonard E. Moore LLC","leonard"],
["B3 The Place 2 Be","b3"],["Moore Legacy Management","moore-legacy"]
];
const contentType={".html":"text/html; charset=utf-8",".css":"text/css",".mjs":"text/javascript",".js":"text/javascript",".svg":"image/svg+xml",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp"};
let currentSite="";
const server=createServer(async(req,res)=>{
 let raw;
 try{raw=decodeURIComponent(new URL(req.url,"http://localhost").pathname)}
 catch{res.writeHead(400).end();return}
 const site=raw.split("/")[1];
 if(!sites.some(x=>x[1]===site)){res.writeHead(404).end();return}
 const pathname=raw.slice(site.length+2)||"index.html";
 const target=path.resolve(home,site,pathname);
 if(!target.startsWith(path.join(home,site)+path.sep)){res.writeHead(403).end();return}
 try{const bytes=await readFile(target);res.writeHead(200,{"Content-Type":contentType[path.extname(target)]||"application/octet-stream"}).end(bytes)}
 catch{res.writeHead(404).end()}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const origin="http://127.0.0.1:"+server.address().port;
let browser;
const reports=[];
try{
 browser=await chromium.launch({headless:true});
 for(const [name,slug] of sites){
  for(const size of [{key:"phone",width:390,height:844},{key:"desktop",width:1366,height:900}]){
   const context=await browser.newContext({viewport:{width:size.width,height:size.height},reducedMotion:"no-preference",deviceScaleFactor:1});
   const baseUrl=origin+"/"+slug+"/";
   await context.route("**/*",route=>{
    const request=route.request(),url=request.url();
    if(url.startsWith(origin+"/"))return route.continue();
    let host="";
    try{host=new URL(url).hostname.toLowerCase()}catch{}
    // Load images from the public Wix media CDN only; no third-party scripts, tracking, or forms.
    if(request.resourceType()==="image"&&host==="static.wixstatic.com")return route.continue();
    return route.abort();
   });
   const page=await context.newPage(),errors=[];
   page.on("pageerror",error=>errors.push(error.message));
   await page.goto(baseUrl,{waitUntil:"domcontentloaded"});
   // Trigger on-scroll entrances so the full-page capture does not hide below-fold sections.
   const sections=page.locator("main section");
   for(let i=0;i<Math.min(12,await sections.count());i++){
    await sections.nth(i).scrollIntoViewIfNeeded().catch(()=>{});
    await page.waitForTimeout(100);
   }
   await page.waitForTimeout(800);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
   await page.waitForTimeout(320);
   const imageReport=await page.evaluate(()=>{
    const imgs=[...document.images];
    return {total:imgs.length,loaded:imgs.filter(x=>x.complete&&x.naturalWidth>0).length,
      failed:imgs.filter(x=>x.complete&&x.naturalWidth===0).length};
   });
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   const file=slug+"-"+size.key+".png";
   await page.screenshot({path:path.join(out,file),fullPage:true,animations:"disabled"});
   reports.push({name,slug,viewport:size.key,screenWidth:size.width,images:imageReport,overflowPixels:overflow,errors,screenshot:file});
   await context.close();
  }
 }
 const safe=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
 const rows=sites.map(([name,slug])=>'<article><h2>'+safe(name)+'</h2><div class="screens">'+
 ["phone","desktop"].map(key=>'<figure><a href="'+slug+'-'+key+'.png"><img loading="lazy" src="'+slug+'-'+key+'.png" alt="'+safe(name)+' '+key+' staged screenshot"></a><figcaption>'+key+'</figcaption></figure>').join("")+
 '</div></article>').join("\n");
 const gallery='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Moore Network • Staged Wix Motion Review</title><style>body{margin:0;background:#0d1524;color:#f4f6fa;font:16px system-ui}main{max-width:1180px;margin:auto;padding:32px 20px}h1{font-size:clamp(26px,4vw,48px)}p{color:#cbd7e7;line-height:1.65}article{border-top:1px solid #344158;padding:22px 0}h2{font-size:21px}.screens{display:grid;grid-template-columns:minmax(170px,1fr) 2fr;gap:16px}figure{margin:0;background:#192338;padding:10px;border-radius:12px}img{width:100%;height:420px;object-fit:contain;object-position:top;background:#101826}figcaption{text-align:center;font-size:13px;margin-top:8px;color:#a1b8da}@media(max-width:680px){.screens{grid-template-columns:1fr}img{height:300px}}</style></head><body><main><h1>Motion Website Review</h1><p>12 staged Wix headless sites • 24 screenshots • public Wix images only. These previews are not live Wix deployments. Inspect image loading and mobile spacing before authorizing any release.</p>'+rows+'</main></body></html>';
 await writeFile(path.join(out,"index.html"),gallery);
 await writeFile(path.join(out,"asset-report.json"),JSON.stringify({createdAt:new Date().toISOString(),livePublished:false,sites:reports},null,2));
 console.log(JSON.stringify({status:"generated",screenshots:reports.length,
  overflowIssues:reports.filter(x=>x.overflowPixels>2).map(x=>x.slug+":"+x.viewport),
  imageShortfalls:reports.filter(x=>x.images.total>x.images.loaded).map(x=>({site:x.slug,width:x.viewport,images:x.images})),
  errors:reports.flatMap(x=>x.errors)},null,2));
}finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
