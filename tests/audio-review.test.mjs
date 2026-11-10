import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const js=readFileSync(new URL('../learn/learn.js',import.meta.url),'utf8');
const raw=js.slice(js.indexOf('const AUDIO_ROWS=')+'const AUDIO_ROWS='.length);
const rows=JSON.parse(raw.slice(0,raw.indexOf(';')));
test('Fish and Fork remain disabled until human-reviewed American-English clips are approved',()=>{
 assert.match(js,/REPORTED_WRONG_WORD_AUDIO=new Set\(\['fish','fork'\]\)/);
 assert.match(js,/type==='word'&&REPORTED_WRONG_WORD_AUDIO\.has\(value\)/);
 assert.match(js,/!REPORTED_WRONG_WORD_AUDIO\.has\(word\)/);
 for(const [word,expected] of [['fish',37],['fork',40]]){
  const idx=rows.findIndex(row=>row[0]==='word'&&row[2]===word);
  assert.equal(idx,expected);
  for(const voice of ['female','male']){
   const file=new URL('../assets/audio/'+voice+'/'+String(idx).padStart(3,'0')+'.mp3',import.meta.url);
   assert.ok(existsSync(file),voice+' '+word+' audio file is missing');
   const bytes=readFileSync(file);
   assert.ok(bytes.length>1000,'Suspiciously short clip '+voice+' '+word);
   assert.ok(bytes.toString('ascii',0,3)==='ID3'||bytes[0]===255,'Invalid MP3 header '+voice+' '+word);
  }
 }
});
