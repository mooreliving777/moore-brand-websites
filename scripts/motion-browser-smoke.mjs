/* Motion-specific visual QA. Private local webserver only; no live site modifications. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const artifacts=path.join(root,'artifacts');
await mkdir(artifacts,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp'};
const server=createServer(async(req,res)=>{
 let name;
 try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 if(name.endsWith('/'))name+='index.html';
 const file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 try{const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(bytes)}
 catch{res.writeHead(404).end()}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const routes=['/','/city-web-design-pros/','/the-harsh-truth-clothing/'];
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const route of routes){
  for(const reducedMotion of ['reduce','no-preference']){
   for(const width of [390,1366]){
    const context=await browser.newContext({viewport:{width,height:844},reducedMotion});
    await context.route('**/*',req=>req.request().url().startsWith(origin+'/')?req.continue():req.abort());
    const page=await context.newPage(),errors=[];
    page.on('pageerror',err=>errors.push(err.message));
    await page.goto(origin+route,{waitUntil:'networkidle'});
    const result=await page.evaluate(()=>({
      css:[...document.styleSheets].some(sheet=>sheet.href?.endsWith('assets/motion.css')),
      script:performance.getEntriesByType('resource').some(item=>item.name.endsWith('assets/motion.mjs')),
      ready:document.body.classList.contains('motion-active'),
      progress:!!document.querySelector('.motion-scroll-progress'),
      h1:!!document.querySelector('h1'),
      width:innerWidth,scrollWidth:document.documentElement.scrollWidth
    }));
    assert.equal(result.css,true,route+' CSS');
    assert.equal(result.script,true,route+' JS');
    assert.equal(result.h1,true,route+' heading');
    assert.equal(result.ready,reducedMotion==='no-preference',route+' preferred motion');
    assert.equal(result.progress,reducedMotion==='no-preference',route+' progress');
    assert.ok(result.scrollWidth<=result.width+2,route+' overflow '+width);
    assert.deepEqual(errors,[],route+' errors');
    if(route==='/city-web-design-pros/'&&reducedMotion==='no-preference'&&width===390){
      for(const target of await page.locator('main > section').all()){await target.scrollIntoViewIfNeeded();await page.waitForTimeout(35)}
      await page.waitForTimeout(800);
      await page.screenshot({path:path.join(artifacts,'city-web-motion-mobile.png'),fullPage:true});
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForTimeout(80);
      assert.equal(await page.locator('.motion-scroll-progress').count(),0,'Dynamic preference removes motion');
      assert.equal(await page.locator('.motion-reveal').count(),0,'Dynamic preference reveals hidden content');
    }
    await context.close();
   }
  }
 }
 const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
 await context.route('**/*',req=>req.request().url().startsWith(origin+'/')?req.continue():req.abort());
 const page=await context.newPage();await page.goto(origin+'/the-harsh-truth-clothing/',{waitUntil:'load'});
 assert.equal(await page.locator('h1').isVisible(),true,'No-JS headline remains visible');
 assert.equal(await page.locator('main > section').first().isVisible(),true,'No-JS content remains visible');
 await context.close();
 console.log('PASS motion: three sites, two widths, both preferences, dynamic preference and no-JS fallback');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
