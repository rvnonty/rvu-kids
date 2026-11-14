import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
test('hero responsive preload avoids duplicate unconditional cover download',()=>{
 const html=read('index.html');
 assert.match(html,/imagesrcset="\.\/assets\/cover-480\.webp 480w, \.\/assets\/cover\.webp 900w"/);
 assert.doesNotMatch(html,/<link rel="preload" as="image" href="\.\/assets\/cover-480\.webp"/);
});
test('first-load motion is deferred and mobile companion does not reserve an empty area',()=>{
 assert.match(read('app.js'),/requestIdleCallback\(enableMotionWorld/);
 assert.match(read('home-motion.mjs'),/min-width:561px/);
 assert.match(read('home-motion.css'),/hero-buddy-slot\{display:none!important;height:0!important/);
});
test('100-page edition appears throughout public storefront and English FAQ',()=>{
 for(const path of ['app.js','index.html','books/alphabet/index.html','parents/index.html']){
  const s=read(path);assert.doesNotMatch(s,/(?:96[ -]?page|96 صفحة|Mansoura, Egypt)/,path);
 }
});
