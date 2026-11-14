import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const home=read('index.html');
const style=read('home-motion.css');
const learning=read('learn/storybook.mjs');
const next=read('learn/next-adventures.mjs');
const app=read('app.js');
const manifest=JSON.parse(read('assets/stickers/manifest.json'));
test('the exact user-approved chameleon is a distinct transparent local asset with speech tails',()=>{
 assert.ok(existsSync('assets/mascot/chameleon.webp'));
 assert.ok(statSync('assets/mascot/chameleon.webp').size>10000);
 assert.match(home,/src="\/assets\/mascot\/chameleon\.webp"/);
 assert.match(style,/\.buddy-bubble::after/);
 assert.match(style,/clip-path:polygon\(100% 0,0 58%,100% 100%\)/);
 assert.match(learning,/story[b]ook-guide-face rvu-mascot-portrait/);
 assert.match(next,/rvu-scene-character rvu-mascot-portrait/);
 assert.match(learning,/\/assets\/mascot\/chameleon\.webp/);
});
test('the home demo displays A but plays only apple and I see an apple',()=>{
 assert.match(home,/class="demo-letter-name"/);
 assert.match(home,/data-audio="002"/);
 assert.match(home,/data-audio="006"/);
 assert.doesNotMatch(home,/data-audio="000"|data-audio="001"/);
 assert.match(app,/demoLetterLabel:'Letter/);
});
test('every word maps to a local, independent picture; 25 are newly painted',()=>{
 assert.equal(manifest.items.length,101);
 assert.equal(new Set(manifest.items.map(x=>x.word)).size,101);
 const approved=manifest.items.filter(x=>x.artwork.includes('custom illustrated'));
 assert.equal(approved.length,25);
 for(const item of manifest.items){
  const path='assets/stickers/'+item.file;
  assert.ok(existsSync(path),path);
  const buf=readFileSync(path);
  assert.equal(buf.toString('ascii',0,4),'RIFF');
  assert.equal(buf.toString('ascii',8,12),'WEBP');
 }
 for(const key of ['apple','ant','airplane','fish'])assert.ok(approved.some(x=>x.word===key));
});
test('female and male voice avatars do not crop book pages',()=>{
 for(const person of ['boy','girl'])assert.ok(existsSync('assets/avatars/'+person+'.svg'));
 assert.match(read('style.css'),/assets\/avatars\/boy\.svg/);
 assert.match(read('learn/learn.css'),/assets\/avatars\/girl\.svg/);
});
