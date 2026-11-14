import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,existsSync} from 'node:fs';

const read=path=>readFileSync(path,'utf8');
test('all 101 vocabulary cards share the same illustrated layout without embedded book screenshots',()=>{
 const dir='assets/words';
 const names=readdirSync(dir).filter(name=>name.endsWith('.svg'));
 assert.equal(names.length,101);
 for(const name of names){
  const svg=read(dir+'/'+name);
  assert.match(svg,/<svg[^>]*viewBox="0 0 192 192"/,name);
  assert.match(svg,/<rect width="192" height="192" rx="36"/,name);
  assert.doesNotMatch(svg,/data:image\/|base64|<foreignObject/i,name);
 }
 assert.match(read(dir+'/carrot.svg'),/🥕/);
 assert.match(read(dir+'/drum.svg'),/🥁/);
 for(const word of ['igloo','quilt','xylophone'])assert.match(read(dir+'/'+word+'.svg'),/<path|<rect/);
});
test('audio mapping is complete and never replaces recorded speech with unavailable disabled controls',()=>{
 const js=read('learn/learn.js');
 assert.doesNotMatch(js,/SpeechSynthesisUtterance|speechSynthesis|deviceVoice/);
 assert.doesNotMatch(js,/audio-play audio-unavailable/);
 assert.match(js,/wordAudioIds\.get\(normalizedWord\(value\)\)/);
 const rows=JSON.parse(js.match(/^const AUDIO_ROWS=(\[\[.*\]\]);$/m)[1]);
 const words=new Set(rows.filter(row=>row[0]==='word').map(row=>row[2]));
 const curriculum=JSON.parse(read('learn/content.js').replace(/^.*?window\.RVU_CURRICULUM=/s,'').replace(/;\s*$/,''));
 const missing=curriculum.alphabet.flatMap(lesson=>lesson.words.filter(word=>!words.has(word))).sort();
 assert.deepEqual(missing,[]);
 for(const [index,type] of [[28,'letter-name'],[29,'letter-sound'],[30,'word'],[31,'word']]){
  const row=rows[index];assert.equal(row[1],'e');assert.equal(row[0],type);
  for(const voice of ['male','female'])assert.ok(existsSync('assets/audio/'+voice+'/'+String(index).padStart(3,'0')+'.mp3'));
 }
});
