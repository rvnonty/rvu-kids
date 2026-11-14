import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const info=JSON.parse(read('assets/stickers/manifest.json'));
const audio=JSON.parse(read('learn/audio-manifest.json'));
const js=read('learn/learn.js');
test('all 101 vocabulary words have lightweight local transparent 3D stickers',()=>{
 const rows=JSON.parse(js.match(/^const AUDIO_ROWS=(\[\[.*\]\]);$/m)[1]);
 const words=new Set(rows.filter(row=>row[0]==='word').map(row=>row[2]));
 assert.equal(words.size,101);
 assert.equal(info.items.length,101);
 assert.deepEqual(new Set(info.items.map(i=>i.word)),words);
 let total=0;
 for(const item of info.items){
  const file='assets/stickers/'+item.file;
  assert.ok(existsSync(file),file);
  const buf=readFileSync(file);
  assert.ok(buf.length>300&&buf.length<80000,file);
  assert.equal(buf.toString('ascii',0,4),'RIFF',file);
  assert.equal(buf.toString('ascii',8,12),'WEBP',file);
  total+=buf.length;
 }
 assert.ok(total<1024*1024,'Sticker illustrations should total less than 1 MiB');
});
test('all curriculum words resolve to recorded speech and local images',()=>{
 assert.match(js,/image\.src='\/assets\/stickers\/'/);
 assert.match(js,/wordAudioIds\.get\(normalizedWord\(value\)\)/);
 assert.match(js,/const normalizedWord=/);
 assert.doesNotMatch(js,/REPORTED_WRONG_WORD_AUDIO/);
});
test('all 244 audio pairs exist, including fish and short E phoneme',()=>{
 assert.equal(audio.recordings.length,244);
 assert.equal(audio.recordings[37].text,'fish');
 assert.equal(audio.recordings[29].type,'letter-sound');
 for(const [i,row] of audio.recordings.entries())for(const voice of ['male','female']){
  const file='.'+row.voices[voice];
  assert.equal(file,'./assets/audio/'+voice+'/'+String(i).padStart(3,'0')+'.mp3');
  assert.ok(existsSync(file)&&statSync(file).size>2300,file);
 }
 assert.equal(audio.pronunciationQA.humanSignoffComplete,false);
});
