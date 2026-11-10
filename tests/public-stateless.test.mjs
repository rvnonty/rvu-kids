import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const storybook=read('learn/storybook.mjs');
const parent=read('parents/index.html');
const parentSettings=read('parents/settings.js');
const letters='abcdefghijklmnopqrstuvwxyz'.split('').map(id=>({id,letter:id.toUpperCase(),words:[id==='a'?'apple':'cat']}));
const curriculum={alphabet:letters,sentences:[{id:'feelings',sentences:["I'm happy."]}]};
function anonymousSession(seed={}){
 const browser=new Map(Object.entries(seed)),writes=[],reads=[],removes=[];
 const storage={
  getItem:key=>{reads.push(key);return browser.get(key)||null},
  setItem:(key,value)=>{writes.push([key,String(value)]);browser.set(key,String(value))},
  removeItem:key=>{removes.push(key);browser.delete(key)}
 };
 const document={
  body:{dataset:{page:'lesson'}},documentElement:{lang:'ar'},
  querySelector:()=>null,getElementById:()=>null,addEventListener:()=>{},
  createElement:()=>({}),createElementNS:()=>({})
 };
 runInNewContext(storybook,{
  document,localStorage:storage,location:{pathname:'/learn/alphabet/a/'},
  window:{RVU_CURRICULUM:curriculum}
 },{timeout:1500});
 return {browser,writes,reads,removes};
}
test('1,000 independent visitors leave no student progress, account or completion data',()=>{
 const sessions=Array.from({length:1000},(_,i)=>anonymousSession(i===0?
  {'rvu-story-progress-v1':JSON.stringify({completed:{alphabet:['a']}}),'rvu-star-album-enabled':'true'}:{}));
 for(const {browser,writes,reads} of sessions){
  assert.equal(writes.length,0,'Lessons must never write visitor state');
  assert.equal(browser.has('rvu-story-progress-v1'),false);
  assert.equal(browser.has('rvu-star-album-enabled'),false);
  assert.ok(!reads.some(key=>key.includes('progress')||key.includes('completed')));
 }
 assert.equal(sessions[0].removes.length,2);
 assert.equal(sessions[999].removes.length,2);
});
test('no hidden progress dashboard, star album or student identifier in public pages',()=>{
 const home=read('index.html'),hub=read('learn/index.html');
 assert.match(home,/\/parents\/#parent-guide/);
 assert.match(hub,/\/parents\/#parent-guide/);
 assert.match(parent,/id="parent-guide"/);
 assert.doesNotMatch(parent,/parent-letter-completed|parent-reset-progress|parent-sticker-album|parent-next-link/);
 assert.doesNotMatch(hub,/href="\/learn\/stickers\/"/);
 assert.doesNotMatch(home,/parent-dashboard/);
 assert.ok(!existsSync(new URL('../parents/dashboard.js',import.meta.url)));
 const deprecated=read('learn/stickers/index.html');
 assert.match(deprecated,/<meta http-equiv="refresh" content="0;url=\/learn\/"/);
 assert.match(read('sitemap.xml'),/\/learn\/alphabet\//);
 assert.doesNotMatch(read('sitemap.xml'),/\/learn\/stickers\//);
});
test('individual listening preferences cannot modify other visitors or student records',()=>{
 assert.doesNotMatch(parentSettings,/setItem\(['"]rvu-story-progress/);
 assert.doesNotMatch(parentSettings,/setItem\(['"]rvu-star-album/);
 assert.match(parentSettings,/rvu-playback-speed/);
 assert.match(parentSettings,/rvu-motion-off/);
 const learning=read('learn/learn.js');
 assert.doesNotMatch(learning,/setItem\(['"]rvu-story-progress/);
 assert.doesNotMatch(read('learn/next-adventures.mjs'),/completedLessons|mountAlbum|lesson-completed/);
 assert.doesNotMatch(storybook,/saveProgress|readProgress|progressStats|lastVisited/);
});
test('parent order flow remains separate and does not create child profiles',()=>{
 const worker=read('server/worker.mjs');
 assert.match(worker,/ORDERS_ENABLED/);
 assert.match(worker,/\/api\/orders/);
 assert.doesNotMatch(worker,/\/api\/(?:users|students|accounts|progress|achievements)/);
 assert.match(parent,/id="parent-buying"/);
 assert.match(parent,/id="parent-offline"/);
});
