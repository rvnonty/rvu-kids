import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,join,sep,extname} from 'node:path';

const root=resolve('dist');
const mime={
 '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
 '.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp',
 '.png':'image/png','.mp3':'audio/mpeg'
};
const server=createServer(async(request,response)=>{
 const uri=new URL(request.url,'http://127.0.0.1');
 const pathname=decodeURIComponent(uri.pathname);
 let filepath=resolve(root,'.'+pathname);
 if(filepath!==root&&!filepath.startsWith(root+sep)){
  response.writeHead(403);response.end('Forbidden');return;
 }
 if(pathname.endsWith('/')||!extname(pathname))filepath=join(filepath,'index.html');
 try{
  const buffer=await readFile(filepath);
  response.writeHead(200,{
   'content-type':mime[extname(filepath)]||'application/octet-stream',
   'content-length':buffer.length
  });
  response.end(buffer);
 }catch{
  response.writeHead(404);response.end('Not found');
 }
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const paths=[
 '/','/preview/','/books/alphabet/','/learn/','/learn/alphabet/',
 '/learn/words/','/learn/sentences/','/learn/sentences/polite-words/',
 '/learn/alphabet/a/','/parents/'
];
const viewports=[
 {width:390,height:844,name:'phone'},
 {width:768,height:1024,name:'tablet'},
 {width:1280,height:800,name:'desktop'}
];
const errors=[];
await mkdir('artifacts/site-design',{recursive:true});
try{
 for(const viewport of viewports){
  const page=await browser.newPage({
   viewport:{width:viewport.width,height:viewport.height},
   reducedMotion:'reduce'
  });
  page.on('pageerror',e=>errors.push(viewport.name+' JS '+String(e)));
  page.on('response',r=>{
   if(r.url().startsWith(base)&&r.status()>=400)errors.push(viewport.name+' HTTP '+r.status()+' '+r.url());
  });
  for(const path of paths){
   const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:15000});
   if(!response||response.status()!==200)throw Error(viewport.name+' '+path+' HTTP failure');
   await page.locator('main').first().waitFor({timeout:12000});
   if(path==='/')await page.locator('#preview-grid .preview-card').first().waitFor({timeout:12000});
   if(path==='/learn/')await page.locator('#letter-grid a').first().waitFor({timeout:12000});
   if(path==='/learn/sentences/polite-words/'||path==='/learn/alphabet/a/'){
    await page.locator('.rvu-game-tab').first().waitFor({timeout:12000});
    const games=await page.locator('.rvu-game-tab').count();
    if(games!==4)throw Error(viewport.name+' '+path+' has '+games+' games, expected 4');
   }
   const h1=await page.locator('h1').first().textContent().catch(()=>null);
   if(!h1||!h1.trim())throw Error(viewport.name+' '+path+' missing main heading');
   const measurements=await page.evaluate(()=>({
    doc:document.documentElement.scrollWidth,
    view:document.documentElement.clientWidth,
    body:document.body.scrollWidth
   }));
   if(measurements.doc>measurements.view+3)throw Error(
    viewport.name+' '+path+' page scroll overflow '+JSON.stringify(measurements)
   );
   if(path==='/'){
    if(viewport.width<=560){
     await page.locator('#motion-sidekick.at-hero').waitFor({state:'attached'});
     const overlaps=await page.evaluate(()=>{
      const a=document.querySelector('.art-credit').getBoundingClientRect();
      const b=document.querySelector('#motion-sidekick').getBoundingClientRect();
      return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
     });
     if(overlaps)throw Error('Mobile companion overlaps the creator caption');
    }
    const text=await page.locator('body').innerText();
    if(text.includes('المعاينة لصفحات مختارة')||text.includes('درجة الألوان في الطباعة')||
       text.includes('Printed colors may look different'))throw Error('Removed preview disclaimer still visible');
    if(/300|٣٠٠|EGP|جنيه/.test(text))throw Error('Public homepage must not display prices');
    const footer=page.locator('footer.footer');
    const credit=await footer.locator('.footer-credit').innerText();
    if(!credit.includes('By:')||!credit.includes('Ramez Medhat')||!credit.includes('❤️'))
      throw Error(viewport.name+' missing footer creator credit: '+credit);
    const columns=await footer.locator('.footer-top').evaluate(el=>getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length);
    if(columns!==2)throw Error(viewport.name+' footer must have two columns for left credit and right logo');
    if(await footer.locator('#footer-privacy, #privacy-dialog').count())throw Error('Removed privacy UI is still present');
    const geometry=await footer.evaluate(el=>{
     const box=selector=>{
      const r=el.querySelector(selector).getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,centerX:(r.left+r.right)/2};
     };
     const brand=el.querySelector('.footer-identity .brand');
     return {
      top:box('.footer-top'),credit:box('.footer-credit'),brand:box('.footer-identity .brand'),
      tagline:box('.footer-tagline'),copyright:box('.footer-bottom > span:first-child'),
      location:box('.footer-bottom > span[data-i18n="footerPlace"]'),
      background:getComputedStyle(brand).backgroundImage,
      logoFont:parseFloat(getComputedStyle(brand.querySelector('.brand-rvu')).fontSize)
     };
    });
    if(geometry.credit.left>=geometry.brand.left)throw Error(viewport.name+' creator credit must be left of RVU KIDS wordmark');
    if(geometry.background!=='none')throw Error(viewport.name+' footer logo must be text without a background image');
    if(viewport.width<=820){
     if(geometry.tagline.top<geometry.credit.bottom-2)throw Error(viewport.name+' tagline must be below the name/logo row');
     if(Math.abs(geometry.tagline.centerX-geometry.top.centerX)>8)throw Error(viewport.name+' tagline must be horizontally centered');
     if(geometry.logoFont>24)throw Error(viewport.name+' footer wordmark is oversized');
    }else if(geometry.copyright.left>=geometry.location.left){
     throw Error('Copyright must be left and Mansoura printing line must be right on desktop');
    }
    if(viewport.name!=='tablet'){
      await footer.screenshot({path:'artifacts/site-design/'+viewport.name+'-footer.png',animations:'disabled'});
    }
   }
   if(path==='/preview/'&&viewport.name==='phone'){
    if(await page.locator('.preview-five figure').count()!==5)throw Error('Expected five preview pages');
   }
   if(path==='/learn/words/'){
    await page.locator('#letter-spread-select').waitFor({timeout:12000});
   }
   const screenshotPaths={
    '/':'home','/preview/':'preview','/books/alphabet/':'book',
    '/learn/':'learning-hub','/learn/sentences/polite-words/':'polite-words',
    '/learn/alphabet/a/':'alphabet-a','/parents/':'parent-guide'
   };
   if(screenshotPaths[path]&&(viewport.name==='phone'||viewport.name==='desktop')){
    await page.screenshot({
     path:'artifacts/site-design/'+viewport.name+'-'+screenshotPaths[path]+'.png',
     fullPage:true,
     animations:'disabled'
    });
   }
   console.log('OK '+viewport.name+' '+path+' documentWidth='+measurements.doc);
  }
  await page.close();
 }
 if(errors.length)throw Error('Uncaught page/network errors: '+errors.slice(0,9).join(' | '));
 console.log('PASS: all 10 page types at phone, tablet and desktop width. No JS errors or horizontal overflow.');
}finally{
 await browser.close();
 await new Promise(done=>server.close(done));
}
