import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../learn/offline-sw.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../parents/index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('../parents/offline.js',import.meta.url),'utf8');
const eventHandlers={};
const sw={addEventListener:(name,handler)=>{eventHandlers[name]=handler}};
const files=new Function('self','caches',source+'\nreturn FILES;')(sw,{});
test('parent must explicitly opt in and can remove stored lessons',()=>{
 assert.match(html,/id="parent-offline-save"/);
 assert.match(html,/id="parent-offline-clear"/);
 assert.match(script,/addEventListener\('click'/);
 assert.match(script,/SAVE_BEGINNER_PACK/);
 assert.match(script,/CLEAR_BEGINNER_PACK/);
 assert.match(source,/event\.data\?\.type/);
});
test('offline pack contains only beginner A/B and their exact approved audio',()=>{
 assert.ok(files.includes('/learn/alphabet/a/'));
 assert.ok(files.includes('/learn/alphabet/b/'));
 assert.ok(files.includes('/assets/words/apple.svg'));
 assert.ok(files.includes('/assets/words/ball.svg'));
 assert.ok(files.includes('/assets/cover.webp'));
 assert.ok(files.includes('/learn/next-adventures.mjs'));
 assert.ok(files.includes('/learn/story-journey.mjs'));
 for(const voice of ['female','male']){
  for(let i=0;i<14;i++)
   assert.ok(files.includes('/assets/audio/'+voice+'/'+String(i).padStart(3,'0')+'.mp3'));
  assert.ok(!files.includes('/assets/audio/'+voice+'/037.mp3'));
  assert.ok(!files.includes('/assets/audio/'+voice+'/040.mp3'));
 }
 assert.ok(!files.some(path=>path.endsWith('.pdf')||path.includes('letter-m.webp')));
 assert.equal(new Set(files).size,files.length);
});
test('service worker never auto-installs or auto-downloads from regular lessons',()=>{
 assert.ok(eventHandlers.install);
 assert.ok(eventHandlers.message);
 assert.ok(eventHandlers.fetch);
 assert.match(source,/event\.data\?\.type/);
 assert.match(source,/['"]SAVE_BEGINNER_PACK['"]/);
});

test('offline pack cannot keep serving obsolete tracking-era lesson JavaScript',()=>{
 assert.match(source,/rvu-learning-a-b-v3/);
 assert.match(source,/PREVIOUS_PREFIX/);
 assert.ok(source.includes("const code=/\\.(?:js|mjs|css)$/.test(url.pathname)"));
 assert.match(source,/fetch\(request,\{cache:'no-cache'\}\)/);
 assert.match(source,/await caches\.open\(CACHE\)/);
});
