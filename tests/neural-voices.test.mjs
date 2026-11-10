import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
const audio=JSON.parse(readFileSync('learn/audio-manifest.json','utf8'));
test('244 recorded but partially reviewed American voice rows are linked to 488 production files',()=>{
 assert.equal(audio.status,'partially-reviewed-not-final');
 assert.equal(audio.recordings.length,244);
 assert.equal(audio.pronunciationQA.humanSignoffComplete,false);
 const set=new Set();
 for(const item of audio.recordings){
  for(const voice of ['female','male']){
   const path=item.voices[voice];
   assert.match(path,/^\/assets\/audio\/(female|male)\/\d{3}\.mp3$/);
   assert.ok(existsSync('.'+path),path);
   assert.ok(statSync('.'+path).size>2300,path);
   set.add(path);
  }
 }
 assert.equal(set.size,488);
});
test('voice selector is available in learning pages',()=>{
 const js=readFileSync('learn/learn.js','utf8');
 assert.ok(js.includes('function voicePicker()'));
 assert.ok(js.includes('function playButton('));
 assert.ok(js.includes("localStorage.setItem('rvu-voice'"));
 assert.ok(!existsSync('audio-review/index.html'));
});
