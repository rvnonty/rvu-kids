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
