import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('static alphabet stations survive hydration and attach the existing two-voice listening controls',()=>{
 for(const p of ['learn/index.html','learn/alphabet/index.html']){
  const text=readFileSync(p,'utf8');
  assert.ok(text.includes('id="letter-grid" data-static-letters="true"'));
  assert.equal((text.match(/class="storybook-stop"/g)||[]).length,26,p);
 }
 const learn=readFileSync('learn/learn.js','utf8');
 assert.ok(learn.includes("grid.dataset.staticLetters!=='true'"));
 const story=readFileSync('learn/storybook.mjs','utf8');
 assert.ok(story.includes("root.dataset.staticLetters==='true'"));
 assert.ok(story.includes('staticStops.length===letters.length'));
 assert.ok(story.includes("window.RVU_WORD_AUDIO.play(lesson.id,word)"));
 assert.ok(story.includes('drawMapRoute(root);'));
});
