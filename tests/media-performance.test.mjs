import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const js=read('learn/learn.js'),manifest=JSON.parse(read('learn/audio-manifest.json'));
const page=read('index.html'),app=read('app.js');

test('WhatsApp phone number is hidden until a valid order is submitted',()=>{
 assert.ok(!page.includes('https://wa.me/'));
 assert.ok(!page.includes('+201012809358'));
 assert.ok(page.includes('id="submit-order"'));
 assert.ok(app.includes("'https://wa.me/201012809358?text='"));
 assert.ok(app.includes('encodeURIComponent(fields.join('));
 assert.ok(app.includes('window.location.assign(url)'));
});

test('244 compact audio mappings reproduce all 488 original MP3 locations exactly',()=>{
 const match=js.match(/^const AUDIO_ROWS=(\[\[.*?\]\]);$/m);
 assert.ok(match,'compact mapping is missing');
 const entries=JSON.parse(match[1]);
 assert.equal(entries.length,244);
 assert.equal(manifest.recordings.length,244);
 for(let i=0;i<entries.length;i++){
  const r=manifest.recordings[i];
  assert.deepEqual(entries[i],[r.type,r.lesson,r.text]);
  const index=String(i).padStart(3,'0');
  for(const voice of ['female','male']){
   assert.equal(r.voices[voice],'/assets/audio/'+voice+'/'+index+'.mp3');
   assert.ok(existsSync('.'+r.voices[voice]));
   assert.ok(statSync('.'+r.voices[voice]).size>2300);
  }
 }
 assert.ok(js.includes('const CACHE_LIMIT=12'));
 assert.ok(existsSync('learn/media-sw.js'));
 assert.ok(js.includes("player.preload='auto'"));
 assert.ok(js.includes("b.addEventListener('pointerenter',prepare"));
 assert.ok(js.includes('stopAudio()'));
 assert.ok(!js.includes('const AUDIO_ROWS=[["letter-name","a","A","/assets/audio/female/000.mp3"'));
});

test('book previews defer nonessential images and prioritize visible cover',()=>{
 const preview=read('preview/index.html');
 assert.ok(page.includes('fetchpriority="high" decoding="async"'));
 assert.ok(app.includes('fetchpriority="low"'));
 assert.ok(preview.includes('fetchpriority="high"'));
 assert.ok(preview.includes('loading="lazy"'));
 assert.ok(preview.includes('decoding="async"'));
 assert.ok(preview.includes('src="/assets/cover.webp"'));
});

test('all built content pages preconnect font servers only once',()=>{
 const paths=[
  'dist/index.html','dist/preview/index.html','dist/books/alphabet/index.html',
  'dist/parents/index.html','dist/learn/index.html',
  'dist/learn/alphabet/a/index.html','dist/learn/sentences/polite-words/index.html'
 ];
 for(const path of paths){
  const html=read(path);
  assert.equal((html.match(/rel="preconnect"/g)||[]).length,2,path);
  assert.ok(html.includes('fonts.gstatic.com'),path);
 }
});

test('production CSS and game bundles remove explanatory code comments',()=>{
 for(const path of ['style.css','learn/learn.css','learn/activities.css']){
  assert.ok(!read('dist/'+path).includes('/*'),'CSS comment in dist/'+path);
 }
 for(const path of ['learn/activities.mjs','learn/activity-data.mjs']){
  assert.ok(!read('dist/'+path).includes('/*'),'JS block comment in dist/'+path);
 }
});
