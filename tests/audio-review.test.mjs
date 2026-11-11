import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const js=readFileSync('learn/learn.js','utf8');
const manifest=JSON.parse(readFileSync('learn/audio-manifest.json','utf8'));
test('all approved book words and E pronunciation rows have paired recordings without missing/blocked buttons',()=>{
 assert.match(js,/REPORTED_WRONG_WORD_AUDIO=new Set\(\[\]\)/);
 const rows=JSON.parse(js.match(/^const AUDIO_ROWS=(\[\[.*\]\]);$/m)[1]);
 assert.deepEqual(rows,manifest.recordings.map(row=>[row.type,row.lesson,row.text]));
 const wordRows=manifest.recordings.filter(row=>row.type==='word');
 assert.equal(wordRows.length,101);
 for(const row of manifest.recordings)for(const voice of ['female','male'])assert.ok(existsSync('.'+row.voices[voice]));
 for(const index of [28,29])assert.equal(manifest.recordings[index].lesson,'e');
 assert.equal(manifest.pronunciationQA.humanSignoffComplete,false);
});
