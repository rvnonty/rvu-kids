import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,join,sep,extname} from 'node:path';

const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
 '.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.mp3':'audio/mpeg','.mp4':'video/mp4'};
const server=createServer(async(req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let path=resolve(root,'.'+pathname);
 if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return}
 if(pathname.endsWith('/')||!extname(pathname))path=join(path,'index.html');
 try{
  const buffer=await readFile(path);
  res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream',
    'content-length':buffer.length});
  res.end(buffer);
 }catch{res.writeHead(404);res.end('Not Found')}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const base='http://127.0.0.1:'+server.address().port;
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[],requests=[];
page.on('pageerror',error=>errors.push(String(error)));
page.on('request',request=>{
 if(request.url().startsWith(base)&&/\/assets\/(audio|words|cover|stickers)/.test(request.url()))requests.push(request.url());
});
try{
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 const welcome=page.locator('.hero-welcome-quote');
 await welcome.waitFor({timeout:12000});
 if(!(await welcome.innerText()).includes('أهلًا'))throw Error('Kids welcoming words missing');
 if(await page.locator('.buddy-book-face').count()!==1)throw Error('Original book chameleon portrait missing');
 if(await page.locator('.buddy-drawing').count()!==0)throw Error('Old unrelated chameleon illustration remains');
 const sourceVideo=await page.request.get(base+'/assets/rvu-hero-loop.mp4');
 if(sourceVideo.status()!==200||!sourceVideo.headers()['content-type']?.includes('video/mp4'))throw Error('Locally hosted welcome video does not load as video/mp4');
 if((await sourceVideo.body()).length>1200000)throw Error('Welcome video exceeds optimized bandwidth budget');
 await page.waitForFunction(()=>Boolean(document.querySelector('.hero-loop-video')),{timeout:12000});
 const videoState=await page.locator('.hero-loop-video').evaluate(video=>({
  muted:video.muted,loop:video.loop,playsInline:video.playsInline,autoplay:video.autoplay,
  source:new URL(video.currentSrc||video.src).pathname
 }));
 if(!videoState.muted||!videoState.loop||!videoState.playsInline||!videoState.autoplay||
    videoState.source!=='/assets/rvu-hero-loop.mp4')
  throw Error('Welcome animation has unsafe or incorrect playback settings: '+JSON.stringify(videoState));
 const contact=page.locator('#submit-order');
 await contact.waitFor();
 if(await page.locator('.order-whatsapp-link').count()!==0)throw Error('Old public WhatsApp link still visible');
 if((await page.locator('body').innerText()).includes('+201012809358'))throw Error('Phone number exposed in UI');
 if(!(await contact.innerText()).includes('اطلب الكتاب على واتساب'))throw Error('Arabic order CTA missing');
 await page.locator('#language').click();
 if(!(await contact.innerText()).includes('Order the book on WhatsApp'))throw Error('English order CTA translation missing');
 await page.locator('#language').click();

 let openedUrl='';
 await page.route('https://wa.me/**',route=>{
  openedUrl=route.request().url();
  route.fulfill({status:200,contentType:'text/html',body:'<html><body>WhatsApp redirect captured locally</body></html>'});
 });
 await page.locator('#quantity').selectOption('2');
 await page.locator('#submit-order').click();
 await page.waitForURL(/wa\.me\/201012809358\?text=/,{timeout:10000});
 if(!openedUrl.includes('wa.me/201012809358?text='))throw Error('Order chat target incorrect: '+openedUrl);
 const message=new URL(openedUrl).searchParams.get('text');
 if(!message.includes('عدد النسخ: 2'))throw Error('Order quantity missing');
 if(/300|٣٠٠|EGP|جنيه/.test(message))throw Error('Price leaked into WhatsApp message');

 await page.goto(base+'/learn/alphabet/a/',{waitUntil:'domcontentloaded'});
 await page.locator('.word-image').first().waitFor({timeout:10000});
 if(await page.locator('.word-image').count()<4)throw Error('Word thumbnails not available');
 await page.locator('.audio-play').first().waitFor();
 await page.waitForFunction(()=>navigator.serviceWorker?.controller?.scriptURL.endsWith('/learn/media-sw.js'),null,{timeout:12000});
 await page.locator('.audio-play').first().click();
 await page.waitForTimeout(400);
 const female=requests.find(url=>/\/assets\/audio\/female\/\d{3}\.mp3$/.test(new URL(url).pathname));
 if(!female)throw Error('Female audio was never requested');
 await page.waitForFunction(async url=>{
  const cache=await caches.open('rvu-kids-media-v4');
  return Boolean(await cache.match(new URL(url).origin+new URL(url).pathname));
 },female,{timeout:10000});
 await page.context().setOffline(true);
 const repeat=await page.evaluate(async url=>{
  const res=await fetch(url,{headers:{Range:'bytes=0-7'}});
  return {status:res.status,range:res.headers.get('content-range'),bytes:(await res.arrayBuffer()).byteLength};
 },female);
 await page.context().setOffline(false);
 if(repeat.status!==206||repeat.bytes!==8||!repeat.range?.startsWith('bytes 0-7/'))throw Error('Previously played sound is not cached: '+JSON.stringify(repeat));
 const shortVowel=page.locator('.letter-sound-card .audio-play');
 if(await shortVowel.count()!==1)throw Error('Separate letter-sound control missing');
 if(!(await shortVowel.getAttribute('aria-label')).includes('صوت الحرف'))throw Error('Letter sound needs an explicit accessible label');
 await shortVowel.click();
 await page.waitForTimeout(400);
 if(!requests.some(url=>/\/assets\/audio\/female\/001\.mp3$/.test(new URL(url).pathname)))throw Error('A letter phoneme was not requested');
 await page.locator('.voice-choice[data-voice="male"]').first().click();
 await page.locator('.audio-play').first().click();
 await page.waitForTimeout(400);
 if(!requests.some(url=>/\/assets\/audio\/male\/\d{3}\.mp3$/.test(new URL(url).pathname)))throw Error('Male audio was never requested');
 if(errors.length)throw Error('Browser JS errors: '+errors.slice(0,7).join(' | '));
 console.log(JSON.stringify({result:'PASS',whatsapp:'phone hidden and bilingual submit CTA verified',audio:'female and male on demand; offline replay verified',words:'illustrations present',pageErrors:errors.length}));
}finally{
 await page.close();await browser.close();await new Promise(done=>server.close(done));
}
