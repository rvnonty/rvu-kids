/* Browser smoke check for RVU Kids lesson enhancements.
   Run on a local static server using playwright; no public load generation. */
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,join,sep,extname} from 'node:path';
import {mkdir} from 'node:fs/promises';
const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{
 const uri=new URL(req.url,'http://127.0.0.1');
 const path=decodeURIComponent(uri.pathname);
 let file=resolve(root,'.'+path);
 if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);res.end('Forbidden');return}
 if(path.endsWith('/')||!extname(path))file=join(file,'index.html');
 try{
  const buffer=await readFile(file);
  res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','content-length':buffer.length});
  res.end(buffer);
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
const errors=[];
page.on('pageerror',error=>errors.push(String(error)));
page.on('response',response=>{
 if(response.status()>=400&&response.url().startsWith(base)){
  errors.push('HTTP '+response.status()+' '+response.url());
 }
});
try{
 await page.goto(base+'/learn/sentences/polite-words/',{waitUntil:'domcontentloaded'});
 await page.locator('.rvu-game-tab').first().waitFor({timeout:15000});
 if(await page.locator('.rvu-game-tab').count()!==4)throw Error('Polite words missing 4 game types');
 if(await page.locator('.rvu-scene-emoji').count()<1)throw Error('No scenario illustration');
 await page.locator('.rvu-game-panel:not([hidden]) .rvu-choice').filter({hasText:'Thank you.'}).click();
 await page.locator('.rvu-game-panel:not([hidden]) .rvu-feedback[data-result="correct"]').waitFor();
 if(await page.locator('.rvu-burst-piece').count()<6)throw Error('Confetti missing after correct answer');
 await page.locator('.rvu-game-panel:not([hidden]) .rvu-game-next:visible').first().click();
 await page.locator('.rvu-game-tab').nth(1).click();
 if(await page.locator('.rvu-game-panel:not([hidden]) .rvu-choice').count()<2)throw Error('Listen exercise missing');
 await page.locator('.rvu-game-tab').nth(2).click();
 if(await page.locator('.rvu-game-panel:not([hidden]) .rvu-masked-sentence').count()===0)throw Error('Missing word exercise empty');
 await page.locator('.rvu-game-tab').nth(3).click();
 if(await page.locator('.rvu-game-panel:not([hidden]) .rvu-tiles button').count()<2)throw Error('Word order activity empty');
 await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/polite-words-mobile.png',fullPage:true});
 await page.goto(base+'/learn/alphabet/a/',{waitUntil:'domcontentloaded'});
 await page.locator('.rvu-game-tab').first().waitFor();
 if(await page.locator('.rvu-game-tab').count()!==4)throw Error('A lesson needs 4 game types');
 const cards=page.locator('.word-card');
 if(await cards.count()!==4)throw Error('Alphabet A must show four picture word cards');
 const opacity=await cards.first().evaluate(node=>getComputedStyle(node).opacity);
 if(opacity!=='1')throw Error('Lesson vocabulary became invisible outside the viewport: '+opacity);
 await page.locator('.rvu-game-panel:not([hidden]) .rvu-choice').filter({hasText:'apple'}).click();
 await page.locator('.rvu-game-panel:not([hidden]) .rvu-feedback[data-result="correct"]').waitFor();
 await page.screenshot({path:'artifacts/alphabet-a-mobile.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});
 const prefers=await page.locator('.rvu-deco-item').first().evaluate(node=>getComputedStyle(node).animationName);
 if(prefers!=='none')throw Error('Reduced-motion did not disable decorative animation: '+prefers);
 await page.emulateMedia({reducedMotion:'no-preference'});
 // All 41 exact curriculum lessons must initialize their extra exercises.
 const source=await readFile('learn/content.js','utf8');
 const obj=JSON.parse(source.match(/window.RVU_CURRICULUM=(\{[\s\S]*\});/)[1]);
 for(const letter of obj.alphabet){
  await page.goto(base+'/learn/alphabet/'+letter.id+'/',{waitUntil:'domcontentloaded'});
  await page.locator('.rvu-game-tab').first().waitFor({timeout:10000});
  const n=await page.locator('.rvu-game-tab').count();
  if(n!==4)throw Error('Letter '+letter.id+' expected 4 games, got '+n);
 }
 for(const unit of obj.sentences){
  await page.goto(base+'/learn/sentences/'+unit.id+'/',{waitUntil:'domcontentloaded'});
  await page.locator('.rvu-game-tab').first().waitFor({timeout:10000});
  const n=await page.locator('.rvu-game-tab').count();
  if(n!==4)throw Error('Unit '+unit.id+' expected 4 games, got '+n);
 }
 if(errors.length)throw Error('Browser errors: '+errors.slice(0,8).join(' | '));
 console.log('PASS: 41 lesson pages, four games each, responsive mobile, success confetti and no page errors.');
}finally{
 await page.close();await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
