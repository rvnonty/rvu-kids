import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const curriculum=JSON.parse(read('learn/content.js').match(/window.RVU_CURRICULUM=(\{[\s\S]*\});/)[1]);
const audio=JSON.parse(read('learn/audio-manifest.json'));
test('all 244 audio targets are approved by the site owner and exist',()=>{
 assert.equal(audio.status,'approved-by-site-owner');assert.equal(audio.recordings.length,244);
 for(const r of audio.recordings)for(const voice of ['female','male']){
  const path=r.voices[voice];assert.match(path,/^\/assets\/audio\/(female|male)\/\d{3}\.mp3$/);
  assert.ok(existsSync('.'+path),path);assert.ok(statSync('.'+path).size>2300,path)
 }
});
test('all 101 picture words are unique and linked to images',()=>{
 const words=curriculum.alphabet.flatMap(a=>a.words);
 assert.equal(words.length,101);assert.equal(new Set(words).size,101);
 for(const w of words){const file='assets/words/'+w.replaceAll(' ','-')+'.svg';assert.ok(existsSync(file),file);assert.ok(statSync(file).size<2000,file)}
 assert.ok(existsSync('learn/words/index.html'));assert.ok(existsSync('dist/learn/words/index.html'));
});
test('playback loads on click and photos respect reduced-motion',()=>{
 const js=read('learn/learn.js'),css=read('learn/learn.css');
 assert.ok(js.includes('new Audio(url)'));
 assert.ok(js.includes("image.loading='lazy'"));
 assert.ok(js.includes('function wordLibrary()'));
 assert.ok(js.includes('const ALL_PICTURE_WORDS=alphabet.flatMap(unit=>unit.words);'));
 assert.ok(!js.includes('FIRST_60'));
 assert.ok(js.includes('ALL_PICTURE_WORDS.forEach'));
 assert.ok(read('learn/words/index.html').includes('101 كلمة'));
 assert.ok(read('learn/index.html').includes('101 كلمة'));
 assert.ok(css.includes('prefers-reduced-motion:reduce'));
 assert.ok(!existsSync('audio-review/index.html'));
});
