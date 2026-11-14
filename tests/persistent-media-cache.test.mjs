import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../learn/media-sw.js',import.meta.url),'utf8');
function mediaWorker({holdCacheWrite=false}={}){
 let releaseWrite=()=>{};
 const cacheBarrier=holdCacheWrite?new Promise(resolve=>{releaseWrite=resolve}):null;
 const events=new Map(),entries=new Map(),pending=[];
 let downloads=0,offline=false;
 const cache={
  async match(key){const entry=entries.get(key.url||key);return entry?.clone()},
  async put(key,response){if(cacheBarrier)await cacheBarrier;entries.set(key.url||key,response.clone())},
  async keys(){return [...entries.keys()].map(url=>new Request(url))},
  async delete(key){return entries.delete(key.url||key)}
 };
 const scope={
  self:{location:{origin:'https://rvu-kids.company'},clients:{claim:async()=>{}},skipWaiting:async()=>{},
   addEventListener:(name,handler)=>events.set(name,handler)},
  caches:{open:async()=>cache,keys:async()=>['rvu-kids-media-v5']},
  Request,Response,Headers,URL,
  fetch:async request=>{
   if(offline)throw Error('offline');
   downloads++;
   return new Response(new TextEncoder().encode('0123456789abcdefghij'),{
    status:200,headers:{'Content-Type':'audio/mpeg','Accept-Ranges':'bytes'}
   });
  }
 };
 runInNewContext(source,scope);
 return {
  async request(path,range){
   let result=null;
   const event={request:new Request('https://rvu-kids.company'+path,{
    headers:range?{Range:range}:{}
   }),respondWith(promise){result=promise},waitUntil(promise){pending.push(promise)}};
   events.get('fetch')(event);
   return result?await result:null;
  },
  entries,releaseWrite,async settle(){await Promise.all(pending)},get downloads(){return downloads},set offline(v){offline=v}
 };
}
test('playing an MP3 caches its full body and supports offline byte-range replay',async()=>{
 const worker=mediaWorker();
 const first=await worker.request('/assets/audio/female/000.mp3','bytes=0-7');
 assert.equal(first.status,206);
 assert.equal(first.headers.get('Content-Range'),'bytes 0-7/20');
 assert.equal(await first.text(),'01234567');
 assert.equal(worker.downloads,1);
 await worker.settle();
 assert.equal(worker.entries.size,1);
 worker.offline=true;
 const repeat=await worker.request('/assets/audio/female/000.mp3','bytes=8-11');
 assert.equal(repeat.status,206);
 assert.equal(await repeat.text(),'89ab');
 assert.equal(worker.downloads,1);
});
test('media cache only intercepts approved site assets, not pages, forms, or APIs',async()=>{
 const worker=mediaWorker();
 assert.equal(await worker.request('/learn/'),null);
 assert.equal(await worker.request('/api/orders'),null);
 assert.equal(await worker.request('/assets/audio/female/9999.mp3'),null);
 assert.equal(await worker.request('/assets/words/flower.svg').then(r=>r?.status),200);
 await worker.settle();
 assert.equal(worker.downloads,1);
});
test('service worker is registered by lessons and limits local retention',()=>{
 const js=readFileSync(new URL('../learn/learn.js',import.meta.url),'utf8');
 assert.match(js,/navigator\.serviceWorker\.register\('\/learn\/media-sw\.js'/);
 assert.match(source,/const MAX_MEDIA_FILES=640/);
 assert.match(source,/await cache\.put\(key,response\.clone\(\)\)/);
 assert.match(source,/event\.waitUntil\(write\)/);
 assert.match(source,/respondToRange\(response,range\)/);
 assert.doesNotMatch(source,/\/api\/|skipWaiting\(\)\s*;\s*fetch\(/);
});
test('first audio response is not delayed by persistent cache writes',async()=>{
 const worker=mediaWorker({holdCacheWrite:true});
 const audio=await Promise.race([
  worker.request('/assets/audio/male/031.mp3','bytes=0-5'),
  new Promise((_,reject)=>setTimeout(()=>reject(new Error('Playback blocked waiting for cache storage')),1000))
 ]);
 assert.equal(audio.status,206);
 assert.equal(await audio.text(),'012345');
 assert.equal(worker.entries.size,0);
 worker.releaseWrite();
 await worker.settle();
 assert.equal(worker.entries.size,1);
});
