import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const base=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,base),'utf8');
const has=p=>existsSync(new URL(p,base));
test('five unique physical preview images across home and preview',()=>{
 const preview=read('preview/index.html');
 const expected=['cover.webp','letter-a.webp','practice-a.webp','feelings.webp','letter-m.webp'];
 const listed=[...preview.matchAll(/<figure><img\b[^>]*\bsrc="\/assets\/([a-z-]+\.webp)"/g)].map(m=>m[1]);
 assert.deepEqual(listed,expected);
 assert.equal(listed.length,5);
 assert.equal(new Set(listed).size,5);
 const home=read('app.js');
 for(const image of expected.slice(1))assert.ok(home.includes("'"+image.replace('.webp','')+"'"));
 assert.ok(!has('assets/review.webp'));
 for(const image of expected)assert.ok(has('assets/'+image));
});
test('all navigation targets map to committed static files',()=>{
 const pages=['index.html','learn/index.html','preview/index.html','books/alphabet/index.html','learn/alphabet/index.html','learn/sentences/index.html'];
 for(const p of pages){
  assert.ok(has(p),p);
  const html=read(p);
  for(const m of html.matchAll(/href="\/(?!#)([^"#?]+\/)"(?:\s|>)/g)){
   const target=m[1]+'index.html';
   assert.ok(has(target),p+' -> /'+m[1]);
  }
 }
});
test('alphabet index and selected lesson previews are wired',()=>{
 const alphabet=read('learn/alphabet/index.html');
 const js=read('learn/learn.js');
 const hub=read('learn/index.html');
 assert.ok(alphabet.includes('data-page="alphabet-index"'));
 assert.ok(hub.includes('href="/learn/alphabet/"'));
 assert.ok(js.includes("p==='alphabet-index'"));
 assert.ok(!js.includes("d.id==='a'||d.id==='m'"),'full printed pages are no longer duplicated inside lessons');
 assert.ok(read('preview/index.html').includes('/assets/letter-m.webp'));
});
test('English and Arabic switching is coherent on main and learning pages',()=>{
 const app=read('app.js'), learn=read('learn/learn.js'),html=read('index.html');
 assert.ok(app.includes("writeStorage('rvu-lang',lang,sessionStorage)"));
 assert.ok(learn.includes("url.searchParams.set('lang',next)"));
 assert.ok(html.includes('data-i18n="navLearn"'));
 assert.ok(html.includes('data-i18n="navPreview"'));
 assert.ok(app.includes("digitalPreview:'Exactly five real pages:"));
});
test('no imaginary live checkout or audio assets',()=>{
 const conf=read('wrangler.jsonc');
 assert.equal(JSON.parse(conf).vars.ORDERS_ENABLED,'false');
 const audio=JSON.parse(read('learn/audio-manifest.json'));
 assert.equal(audio.status,'partially-reviewed-not-final');
 assert.equal(audio.pronunciationQA.humanSignoffComplete,false);
 assert.ok(audio.recordings.every(r=>r.voices?.female&&r.voices?.male));
});


test('responsive layout avoids unbounded horizontal grid growth',()=>{
 const css=read('style.css');
 assert.ok(css.includes('grid-template-columns:minmax(0,1.02fr) minmax(0,1fr)'));
 for(const selector of ['.learning-grid','.preview-grid','.benefits-grid','.steps']){
   assert.ok(css.includes(selector+'{grid-template-columns:repeat(4,minmax(0,1fr))}'),selector);
 }
 assert.ok(css.includes('overflow-x:clip'));
 assert.ok(css.includes('@media(max-width:850px)'));
 assert.ok(css.includes('.hero{grid-template-columns:minmax(0,1fr);gap:18px}'));
});


test('visually hidden controls cannot extend the document by 10,000px',()=>{
 const css=read('style.css'),learn=read('learn/learn.css');
 assert.ok(!css.includes('left:-10000px'));
 assert.ok(!learn.includes('left:-9999px'));
 assert.ok(css.includes('clip-path:inset(50%)'));
 assert.ok(learn.includes('transform:translateY(-180%)'));
});
test('book preview cards do not introduce white picture frames',()=>{
 const main=read('style.css'),learn=read('learn/learn.css');
 assert.ok(main.includes('.preview-card .preview-frame{padding:11px'));
 assert.ok(learn.includes('.preview-five figure{background:transparent;padding:0'));
 for(const name of ['cover','letter-a','practice-a','feelings','letter-m']){
   const image=readFileSync(new URL('assets/'+name+'.webp',base));
    assert.ok(image.length>55000,name+' preview image is missing or truncated');
    assert.equal(image.toString('ascii',0,4),'RIFF');
    assert.equal(image.toString('ascii',8,12),'WEBP');
 }
});


test('whatsapp orders use approved international recipient number and never fake submission',()=>{
 const page=read('index.html'),js=read('app.js');
 assert.ok(page.includes('name="quantity"'));
 assert.ok(!page.includes('name="payment"'));
 assert.ok(!page.includes('value="bank"'));
 assert.ok(page.includes('id="submit-order" class="button full" data-i18n="submitOrder"'));
 assert.ok(!page.includes('واتساب مع Ramez'));
 assert.doesNotMatch(page,/>\s*\+?201012809358\s*</);
 assert.ok(!page.includes('+201012809358'));
 assert.ok(!page.includes('@n2nty'));
 assert.ok(!js.includes('@n2nty'));
 assert.ok(js.includes("'https://wa.me/201012809358?text='"));
 assert.ok(js.includes('encodeURIComponent(fields.join('));
 assert.ok(js.includes('window.location.assign(url)'));
 assert.ok(js.includes('buildOrderUrl(copies,lang)'));
 assert.ok(!js.includes("fetch('./api/config'"));
 assert.ok(!js.includes("fetch('./api/orders'"));
 assert.ok(!page.includes('id="service-status"'));
 assert.ok(page.includes('Created By: Ramez Medhat'));
});
test('why different gives clear printed learning progression and honest future US audio',()=>{
 const page=read('index.html'),app=read('app.js');
 for(const id of ['why-different','whyLettersTitle','whyWordsTitle','whySentencesTitle','listen','listenIntro']){
  assert.ok(page.includes(id),id);
 }
 assert.ok(app.includes('American English words and sentences'));
 const css=read('style.css');
 assert.ok(css.includes('.why-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))'));
});


test('storybook learning identity and gentle interactions use official book cover',()=>{
 const hub=read('learn/index.html'),js=read('learn/learn.js'),css=read('learn/learn.css');
 const main=read('index.html'),site=read('style.css');
 for(const character of ['boy','girl','lizard'])assert.ok(hub.includes('character-portrait '+character));
 assert.ok(css.includes("background-image:url('/assets/cover.webp')"));
 assert.ok(js.includes("function createCast(compact=false)"));
 assert.ok(js.includes("function wordVisual(w)"));
 assert.ok(js.includes("'word-visual story-visual'"));
 assert.ok(js.includes("function enableStoryMotion()"));
 assert.ok(js.includes('prefers-reduced-motion: reduce'));
 assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
 assert.ok(css.includes('.page-dialog img.page-turn'));
 assert.ok(main.includes('id="preview-previous"'));
 assert.ok(main.includes('id="preview-next"'));
 assert.ok(site.includes('.hero-art .art-credit'));
 assert.ok(!main.includes('data-i18n="whatsappNotice"'));
});


test('order heading is uncluttered and hero artwork is optically centered',()=>{
 const html=read('index.html'),css=read('style.css');
 assert.ok(!html.includes('كل الحقول مطلوبة، إلا المذكور'));
 assert.ok(!html.includes('data-i18n="formRequired"'));
 assert.ok(html.includes('Created By: Ramez Medhat'));
 assert.ok(css.includes('width:min(90%,510px)'));
 assert.ok(css.includes('transform:translate(-50%,-50%) rotate(-5deg)'));
 assert.ok(css.includes('.hero-art .book{margin-inline:auto;transform:translateY(-7px) rotate(-4deg)}'));
});


test('home is an uncluttered book storefront and lessons have a separate child-only home',()=>{
 const html=read('index.html'),app=read('app.js'),hub=read('learn/index.html');
 assert.equal((html.match(/class="explore-card /g)||[]).length,0);
 assert.ok(html.includes('class="hero-actions purchase-actions"'));
 assert.ok(html.includes('href="#order"'));
 assert.ok(html.includes('id="why-different"'));
 assert.ok(html.includes('id="preview"'));
 assert.ok(html.includes('id="order-form"'));
 assert.ok(!html.includes('class="hero-routes"'));
 assert.ok(!html.includes('href="/parents/'));
 assert.ok(!html.includes('id="inside"'));
 assert.match(hub,/href="\/learn\/alphabet\//);
 assert.match(hub,/href="\/learn\/sentences\//);
 assert.ok(!hub.includes('/parents/'));
 assert.ok(app.includes("heroLearn:'Try learning & listening"));
});

test('order form remains clear about data sharing without a privacy footer button',()=>{
 const html=read('index.html'),app=read('app.js');
 assert.ok(!html.includes('name="consent"'));
 assert.ok(!html.includes('id="privacy-open"'));
 assert.ok(!html.includes('موافق أشارك بيانات الطلب والعنوان'));
 assert.ok(!html.includes('id="footer-privacy"'));
 assert.ok(!html.includes('id="privacy-dialog"'));
 assert.ok(html.includes('data-i18n="orderPrivacy"'));
 assert.ok(!app.includes("getElementById('footer-privacy')"));
 assert.ok(app.includes("form.addEventListener('submit'"));
});


test('main storefront and learning pages retain canonical URL metadata while removed pages redirect',()=>{
 for(const [file,canonical] of [
  ['index.html','https://rvu-kids.company/'],
  ['learn/index.html','https://rvu-kids.company/learn/'],
  ['preview/index.html','https://rvu-kids.company/preview/']
 ]){
  const html=read(file);
  assert.ok(html.includes('<link rel="canonical" href="'+canonical+'">'),file);
  assert.ok(html.includes('<meta name="description" content="'),file);
 }
 for(const file of ['books/alphabet/index.html','parents/index.html']){
  const html=read(file);
  assert.match(html,/noindex,follow/);
  assert.match(html,/content="0;url=\/#order"/);
  assert.ok(html.includes('<link rel="canonical" href="https://rvu-kids.company/">'));
 }
 assert.ok(!has('parents/guide.js'));
 assert.ok(!has('parents/settings.js'));
 assert.ok(!has('parents/guide.css'));
 assert.ok(!read('sitemap.xml').includes('<loc>https://rvu-kids.company/parents/</loc>'));
 assert.equal((read('preview/index.html').match(/<figure>/g)||[]).length,5);
});

test('approved wordmark remains consistent across home, learning and parent pages',()=>{
 const svg=read('assets/rvu-kids-logo.svg'),home=read('style.css'),shared=read('learn/learn.css');
 assert.ok(svg.startsWith('<svg ')&&svg.includes('viewBox="0 0 232 146"'));
 assert.ok(svg.includes('#183d32')&&!svg.includes('#e49532'));
 assert.ok(home.includes(".header .brand,.footer .brand{"));
 assert.ok(home.includes("background:url('/assets/rvu-kids-logo.svg')"));
 assert.ok(shared.includes("background:url('/assets/rvu-kids-logo.svg')"));
 assert.ok(shared.includes('.sitebar .brand b{font-size:0'));
 assert.ok(shared.includes('.sitebar nav{'));
 assert.ok(shared.includes('overflow-x:auto'));
 const favicon=read('favicon.svg');
 assert.ok(!favicon.includes('#e49532')&&favicon.includes('#183d32'));
 assert.ok(!read('index.html').includes('class="brand-sun"'));
});
test('all preview cards have the same print ratio, modest hover and touch fallback',()=>{
 const home=read('style.css'),shared=read('learn/learn.css');
 assert.ok(home.includes('.preview-card .preview-frame{'));
 assert.ok(home.includes('aspect-ratio:900 / 1273'));
 assert.ok(home.includes('scale(1.035) rotate(2deg)'));
 assert.ok(shared.includes('.preview-five img{'));
 assert.ok(shared.includes('aspect-ratio:900 / 1273'));
 assert.ok(shared.includes('.preview-five figure:first-child{grid-column:auto;max-width:none;justify-self:stretch}'));
 assert.ok(home.includes('(prefers-reduced-motion:reduce)'));
 assert.ok(shared.includes('(pointer:coarse)'));
});

test('cover credit stays inside artwork and header remains compact on phones',()=>{
 const css=read('style.css');
 assert.ok(css.includes('.header{\n display:grid;'));
 assert.ok(css.includes('grid-template-columns:138px minmax(0,1fr) auto'));
 assert.ok(css.includes('.hero-art .art-credit{\n bottom:22px;'));
 assert.ok(css.includes('.hero-art{min-height:625px}'));
 assert.ok(css.includes('.hero-art .art-credit{bottom:17px;'));
});
