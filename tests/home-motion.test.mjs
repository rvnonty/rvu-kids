import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {chooseMotionScene,MOTION_SCENES} from '../home-motion.mjs';
test('companion chooses the visible chapter in either scrolling direction, including gaps and page ends',()=>{
 const down=[{id:'hero',top:-500,bottom:-50},{id:'listen',top:-20,bottom:650},{id:'play',top:700,bottom:1400}];
 assert.equal(chooseMotionScene(down,400),'listen');
 const up=[{id:'hero',top:40,bottom:600},{id:'listen',top:640,bottom:1300}];
 assert.equal(chooseMotionScene(up,300),'hero');
 assert.equal(chooseMotionScene(up,630),'listen');
 assert.equal(chooseMotionScene(up,1400),'listen');
 assert.equal(chooseMotionScene([],400),null);
});
test('all companion chapter links resolve to real homepage sections or the preview route, in both languages',()=>{
 const home=readFileSync('index.html','utf8');
 assert.equal(new Set(MOTION_SCENES.map(scene=>scene.id)).size,MOTION_SCENES.length);
 for(const scene of MOTION_SCENES){
  assert.ok(scene.ar&&scene.en&&scene.actionAr&&scene.actionEn,scene.id);
  if(scene.href.startsWith('#'))assert.ok(home.includes('id="'+scene.href.slice(1)+'"'),scene.id+' target');
  else assert.ok(existsSync('.'+scene.href+'index.html'),scene.href);
 }
});
test('the opening screen uses a real enlarged cover and an independent creator caption without the old phone and stray letters',()=>{
 const home=readFileSync('index.html','utf8');
 assert.doesNotMatch(home,/class="lesson-phone"|class="floating-letter/);
 assert.match(home,/<figure class="hero-book-figure">/);
 assert.match(home,/srcset="\.\/assets\/cover-480.webp 480w, \.\/assets\/cover.webp 900w"/);
 assert.match(home,/<figcaption class="art-credit">/);
 assert.ok(existsSync('assets/ramez-signature.svg'));
 assert.ok(existsSync('dist/home-motion.css'));
 assert.ok(existsSync('dist/home-motion.mjs'));
});
