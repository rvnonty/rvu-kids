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
test('exactly five preview pages',()=>{
 const preview=text('preview/index.html');
 assert.equal((preview.match(/<figure>/g)||[]).length,5);
 assert.ok(!preview.includes('.pdf'));
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
