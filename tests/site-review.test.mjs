import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const base=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,base),'utf8');
const has=p=>existsSync(new URL(p,base));
test('five unique physical preview images across home and preview',()=>{
 const preview=read('preview/index.html');
 const expected=['cover.webp','letter-a.webp','practice-a.webp','feelings.webp','letter-m.webp'];
 const listed=[...preview.matchAll(/<figure><img src="\/assets\/([a-z-]+\.webp)"/g)].map(m=>m[1]);
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
 assert.ok(js.includes("d.id==='a'||d.id==='m'"));
 assert.ok(js.includes('/assets/letter-m.webp'));
});
test('English and Arabic switching is coherent on main and learning pages',()=>{
 const app=read('app.js'), learn=read('learn/learn.js'),html=read('index.html');
 assert.ok(app.includes("sessionStorage.setItem('rvu-lang',lang)"));
 assert.ok(learn.includes("url.searchParams.set('lang',next)"));
 assert.ok(html.includes('data-i18n="navLearn"'));
 assert.ok(html.includes('data-i18n="navPreview"'));
 assert.ok(app.includes("digitalPreview:'Exactly five real pages:"));
});
test('no imaginary live checkout or audio assets',()=>{
 const conf=read('wrangler.jsonc');
 assert.equal(JSON.parse(conf).vars.ORDERS_ENABLED,'false');
 const audio=JSON.parse(read('learn/audio-manifest.json'));
 assert.equal(audio.status,'awaiting-reviewed-audio');
 assert.ok(audio.recordings.every(r=>r.asset===null));
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
   assert.ok(readFileSync(new URL('assets/'+name+'.webp',base)).length>150000,name+' is too small for a preview');
 }
});


test('whatsapp orders are enabled, use the approved username and never fake submission',()=>{
 const page=read('index.html'),js=read('app.js');
 assert.ok(page.includes('value="instapay"'));
 assert.ok(page.includes('value="vodafone_cash"'));
 assert.ok(!page.includes('value="bank"'));
 assert.ok(page.includes('id="submit-order" class="button full" data-i18n="submitOrder"'));
 assert.ok(page.includes('@n2nty'));
 assert.ok(!page.includes('الطلب هيفتح على واتساب @n2nty برسالة جاهزة.'));
 assert.ok(js.includes("'https://wa.me/n2nty?text='"));
 assert.ok(js.includes('encodeURIComponent(fields.join('));
 assert.ok(js.includes('window.location.assign(url)'));
 assert.ok(js.includes('payload.payment'));
 assert.ok(!js.includes("fetch('./api/config'"));
 assert.ok(!js.includes("fetch('./api/orders'"));
 assert.ok(!page.includes('id="service-status"'));
 assert.ok(page.includes('Created By: Ramez Medhat'));
});
test('why different gives clear printed learning progression and honest future US audio',()=>{
 const page=read('index.html'),app=read('app.js');
 for(const id of ['why-different','whyLettersTitle','whyWordsTitle','whySentencesTitle','whyAudioSoon','whyAudioTitle','whyAudioText']){
  assert.ok(page.includes(id),id);
 }
 assert.ok(app.includes('audio playback is not available yet'.replace('audio playback','Audio playback')));
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


test('home learning discovery is concise, bilingual and free of redundant text grids',()=>{
 const html=read('index.html'),css=read('style.css'),app=read('app.js');
 assert.equal((html.match(/class="explore-card /g)||[]).length,2);
 assert.ok(html.includes('href="/learn/alphabet/"'));
 assert.ok(html.includes('href="/learn/sentences/"'));
 assert.ok(html.includes('id="inside" class="explore-section'));
 assert.ok(html.includes('id="why-different"'));
 assert.ok(html.includes('id="preview"'));
 assert.ok(!html.includes('01 / Aa'));
 assert.ok(!html.includes('05</span><h3>Book Preview'));
 assert.ok(!html.includes('الكتاب مش واقف عند الورق'));
 assert.ok(css.includes('.explore-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))'));
 assert.ok(css.includes('.explore-card:focus-visible'));
 assert.ok(app.includes("digitalEyebrow:'Keep exploring'"));
 assert.ok(app.includes("digitalTitle:'The learning continues online.'"));
});


test('order form has no mandatory consent paragraph but privacy remains accessible in footer',()=>{
 const html=read('index.html'),app=read('app.js');
 assert.ok(!html.includes('name="consent"'));
 assert.ok(!html.includes('id="privacy-open"'));
 assert.ok(!html.includes('موافق أشارك بيانات الطلب والعنوان'));
 assert.ok(html.includes('id="footer-privacy"'));
 assert.ok(html.includes('id="privacy-dialog"'));
 assert.ok(app.includes("document.getElementById('footer-privacy').addEventListener('click'"));
 assert.ok(app.includes("form.addEventListener('submit'"));
});


test('main storefront sections have descriptive metadata and exact canonical URLs',()=>{
 for(const [path,canonical] of [
  ['index.html','https://rvu-kids.company/'],
  ['learn/index.html','https://rvu-kids.company/learn/'],
  ['preview/index.html','https://rvu-kids.company/preview/'],
  ['books/alphabet/index.html','https://rvu-kids.company/books/alphabet/']
 ]){
  const html=read(path);
  assert.ok(html.includes('<link rel="canonical" href="'+canonical+'">'),path);
  assert.ok(html.includes('<meta name="description" content="'),path);
 }
});

test('bilingual parent guide ships in build and links from storefront and hub',()=>{
 const page=read('parents/index.html'),css=read('parents/guide.css'),js=read('parents/guide.js');
 assert.ok(read('index.html').includes('href="/parents/"'));
 assert.ok(read('learn/index.html').includes('href="/parents/"'));
 assert.ok(page.includes('3–4')&&page.includes('5–6'));
 assert.ok(page.includes('I see an apple.'));
 assert.ok(page.includes('قيد التجهيز'));
 assert.ok(page.includes('href="/learn/alphabet/a/"'));
 assert.ok(page.includes('href="/learn/sentences/feelings/"'));
 assert.ok(js.includes("sessionStorage.setItem('rvu-lang',lang)"));
 assert.ok(css.includes('@media(max-width:620px)'));
 assert.ok(read('app.js').includes("parentGuideTitle:'Where should we start?'"));
 assert.ok(read('learn/learn.js').includes('data-hub-parent-title'));
 assert.ok(read('build.mjs').includes("'parents'"));
 assert.ok(read('sitemap.xml').includes('<loc>https://rvu-kids.company/parents/</loc>'));
 assert.equal((read('preview/index.html').match(/<figure>/g)||[]).length,5);
});

test('approved wordmark remains consistent across home, learning and parent pages',()=>{
 const svg=read('assets/rvu-kids-logo.svg'),home=read('style.css'),shared=read('learn/learn.css');
 assert.ok(svg.startsWith('<svg ')&&svg.includes('viewBox="0 0 246 146"'));
 assert.ok(svg.includes('#183d32')&&svg.includes('#e49532'));
 assert.ok(home.includes(".header .brand,.footer .brand{"));
 assert.ok(home.includes("background:url('/assets/rvu-kids-logo.svg')"));
 assert.ok(shared.includes("background:url('/assets/rvu-kids-logo.svg')"));
 assert.ok(shared.includes('.sitebar .brand b{font-size:0'));
 assert.ok(shared.includes('.sitebar nav{'));
 assert.ok(shared.includes('overflow-x:auto'));
 const favicon=read('favicon.svg');
 assert.ok(favicon.includes('#e49532')&&favicon.includes('#183d32'));
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
