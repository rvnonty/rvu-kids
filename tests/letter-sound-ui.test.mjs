import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const js=readFileSync('learn/learn.js','utf8');
const audio=JSON.parse(readFileSync('learn/audio-manifest.json','utf8'));
test('All 26 A-Z lessons render separate letter-name and letter-sound buttons',()=>{
 assert.match(js,/playButton\('letter-name',d\.id,d\.letter\)/);
 assert.match(js,/playButton\('letter-sound',d\.id,d\.letter\)/);
 assert.match(js,/letter-sound-card/);
 assert.match(js,/صوت الحرف/);
 assert.match(js,/Letter sound/);
 assert.match(js,/استمع إلى صوت الحرف/);
 const names=audio.recordings.filter(x=>x.type==='letter-name');
 const sounds=audio.recordings.filter(x=>x.type==='letter-sound');
 assert.equal(names.length,26);
 assert.equal(sounds.length,26);
 for(const x of sounds)for(const voice of ['female','male'])assert.ok(existsSync('.'+x.voices[voice]));
});
test('Separate letter-name and sound recordings are correct for short E',()=>{
 const name=audio.recordings.find(x=>x.type==='letter-name'&&x.lesson==='e');
 const sound=audio.recordings.find(x=>x.type==='letter-sound'&&x.lesson==='e');
 assert.ok(name&&sound);
 assert.equal(name.voices.female,'/assets/audio/female/028.mp3');
 assert.equal(sound.voices.female,'/assets/audio/female/029.mp3');
});
