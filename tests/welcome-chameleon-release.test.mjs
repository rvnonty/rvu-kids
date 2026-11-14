import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('Original animated kids greeting is committed and under a 1.2 MB budget',()=>{
 const path='assets/rvu-hero-loop.mp4';
 const webm='assets/rvu-hero-loop.webm';
 const bytes=readFileSync(path);
 assert.ok(bytes.length>90000&&bytes.length<1200000);
 assert.equal(bytes.toString('latin1',4,8),'ftyp');
 assert.ok(statSync(webm).size>90000&&statSync(webm).size<1100000);
 assert.match(read('hero-loop.mjs'),/rvu-hero-loop\.mp4/);
 assert.match(read('hero-loop.mjs'),/video\.loop\s*=\s*true/);
 assert.match(read('hero-loop.mjs'),/video\.muted\s*=\s*true/);
 assert.match(read('hero-loop.mjs'),/video\.playsInline\s*=\s*true/);
 assert.match(read('hero-loop.mjs'),/prefers-reduced-motion/);
 assert.ok(statSync('dist/assets/rvu-hero-loop.mp4').size>90000);
 assert.ok(statSync('dist/assets/rvu-hero-loop.webm').size>90000);
});
test('The sidekick is the original book chameleon in a speech-bubble portrait',()=>{
 const html=read('index.html');
 const css=read('home-motion.css');
 const app=read('app.js');
 assert.match(html,/class="buddy-sprite buddy-from-book"/);
 assert.match(html,/class="buddy-book-face"/);
 assert.doesNotMatch(html,/class="buddy-drawing"/);
 assert.match(html,/class="buddy-bubble"/);
 assert.match(css,/\.motion-sidekick \.buddy-book-face/);
 assert.match(css,/background-image:url\('\/assets\/cover\.webp'\)/);
 assert.match(html,/data-i18n="heroWelcomeText"/);
 assert.match(app,/heroWelcomeText:'Hello, friends!/);
});
test('Letter, word and sentence audio remains present after welcome integration',()=>{
 const manifest=JSON.parse(read('learn/audio-manifest.json'));
 assert.equal(manifest.recordings.length,244);
 assert.equal(manifest.recordings[37].text,'fish');
 for(const row of manifest.recordings)for(const voice of ['female','male']){
  const path='.'+row.voices[voice];
  assert.ok(statSync(path).size>2300,path);
 }
 assert.equal(manifest.pronunciationQA.humanSignoffComplete,false);
});
