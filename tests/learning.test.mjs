import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const text=path=>readFileSync(new URL(path,root),'utf8');
const env={window:{}};runInNewContext(text('learn/content.js'),env);
const d=env.window.RVU_CURRICULUM;
const qr=JSON.parse(text('learn/qr-map.json'));
const audio=JSON.parse(text('learn/audio-manifest.json'));
test('locked content counts',()=>{
 assert.equal(d.bookPages,96);
 assert.equal(d.alphabet.length,26);
 assert.equal(d.alphabet.reduce((n,a)=>n+a.words.length,0),101);
 assert.equal(d.sentences.length,15);
 assert.equal(d.sentences.reduce((n,a)=>n+a.sentences.length,0),64);
 assert.deepEqual(Array.from(d.alphabet[16].words),['queen','quilt','quail']);
 assert.deepEqual(Array.from(d.alphabet[23].words),['x-ray','xylophone']);
 assert.ok(d.sentences[3].sentences.includes('I wash my hands.'));
 assert.ok(d.sentences[4].sentences.includes('This is my family.'));
 assert.ok(d.sentences[11].sentences.includes('Can I play with you?'));
 assert.ok(!d.sentences[11].sentences.includes('Can I play?'));
});
test('exactly five UNIQUE real preview pages, including A and M',()=>{
 const preview=text('preview/index.html');
 assert.equal((preview.match(/<figure>/g)||[]).length,5);
 const photos=[...preview.matchAll(/<figure><img src="\/assets\/([a-z-]+\.webp)"/g)].map(m=>m[1]);
 assert.deepEqual(photos,['cover.webp','letter-a.webp','practice-a.webp','feelings.webp','letter-m.webp']);
 const publicImages=['cover.webp','letter-a.webp','practice-a.webp','feelings.webp','letter-m.webp'];
 assert.ok(publicImages.every(name=>existsSync(new URL('assets/'+name,root))));
 assert.ok(!existsSync(new URL('assets/review.webp',root)),'Review image must not remain publicly accessible as a sixth page');
 const home=text('app.js');
 assert.ok(home.includes("['letter-m','حرف M"));
 assert.ok(!home.includes("['review','"));
 assert.ok(!preview.includes('.pdf'));
});
test('M preview image is intact and from the actual book',()=>{
 const data=readFileSync(new URL('assets/letter-m.webp',root));
 assert.equal(data.toString('ascii',0,4),'RIFF');
 assert.equal(data.toString('ascii',8,12),'WEBP');
 assert.equal(data.readUInt32LE(4)+8,data.length);
});
test('production build includes all learning paths',()=>{
 for(const file of ['dist/index.html','dist/learn/index.html','dist/learn/alphabet/a/index.html',
 'dist/learn/alphabet/m/index.html','dist/learn/alphabet/z/index.html',
 'dist/learn/sentences/index.html','dist/learn/sentences/feelings/index.html',
 'dist/books/alphabet/index.html','dist/preview/index.html','dist/CNAME',
 'dist/assets/letter-m.webp']){
   assert.ok(existsSync(new URL(file,root)),file);
 }
 assert.ok(!existsSync(new URL('dist/assets/review.webp',root)));
});

test('all 41 routes and direct navigation',()=>{
 assert.equal(qr.units.length,41);
 assert.equal(new Set(qr.units.map(q=>q.url)).size,41);
 for(const entry of qr.units){
  assert.match(entry.url,/^https:\/\/rvu-kids\.company\/learn\/(?:alphabet|sentences)\/[a-z0-9-]+\/$/);
  assert.ok(existsSync(new URL(entry.url.replace('https://rvu-kids.company/','')+'index.html',root)),entry.url);
  assert.equal(entry.printedPages[1],entry.printedPages[0]+1);
  assert.deepEqual(entry.printedPages,entry.pdfPages.map(n=>n-3));
 }
});
test('audio stays explicitly unapproved until reviewed',()=>{
 assert.equal(audio.recordings.length,244);
 assert.equal(audio.status,'awaiting-reviewed-audio');
 assert.ok(audio.recordings.every(r=>r.asset===null));
});
test('assets and scripts are wired',()=>{
 for(const f of ['learn/index.html','preview/index.html','books/alphabet/index.html','learn/alphabet/a/index.html','learn/sentences/feelings/index.html']){
  const html=text(f);
  assert.ok(html.includes('/learn/content.js'),f);
  assert.ok(html.includes('/learn/learn.js'),f);
 }
 assert.ok(existsSync(new URL('CNAME',root)));
});


test('displayed numbers follow the book, not the PDF front matter',()=>{
 const a=qr.units.find(x=>x.group==='alphabet'&&x.id==='a');
 const m=qr.units.find(x=>x.group==='alphabet'&&x.id==='m');
 const feelings=qr.units.find(x=>x.group==='sentences'&&x.id==='feelings');
 assert.deepEqual(a.printedPages,[1,2]);assert.deepEqual(a.pdfPages,[4,5]);
 assert.deepEqual(m.printedPages,[25,26]);assert.deepEqual(m.pdfPages,[28,29]);
 assert.deepEqual(feelings.printedPages,[53,54]);assert.deepEqual(feelings.pdfPages,[56,57]);
 const js=text('learn/learn.js');
 assert.ok(js.includes('function printedPages(pages){return pages.map(page=>page-3)}'));
 assert.ok(js.includes("printedPages(d.pages).join('–')"));
 assert.ok(js.includes("printedPages(u.pages).join('–')"));
});


test('legacy learning URLs never silently display a different lesson',()=>{
 const js=text('learn/learn.js');
 assert.ok(!js.includes("'healthy-habits':'bathroom'"));
 assert.ok(!js.includes("'kind-words':'can-you-help'"));
 for(const [slug,target] of [
  ['healthy-habits','/learn/sentences/'],
  ['kind-words','/learn/sentences/polite-words/'],
  ['good-manners','/learn/sentences/polite-words/']
 ]){
  const page=text('learn/sentences/'+slug+'/index.html');
  assert.ok(page.includes('content="0;url='+target+'"'),slug);
  assert.ok(page.includes('name="robots" content="noindex,follow"'),slug);
 }
});
test('learning browser titles describe the actual lesson',()=>{
 const js=text('learn/learn.js');
 assert.ok(js.includes("document.title=headingLabel+' | RVU Kids Learning'"));
 assert.ok(js.includes("document.title='Everyday English | RVU Kids'"));
 assert.ok(js.includes("meta.name='description'"));
});
