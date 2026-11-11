import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const at=(name)=>path.join(root,name);
const read=name=>readFileSync(at(name),'utf8');
const environment={};
runInNewContext(read('learn/content.js'),{window:environment});
const curriculum=environment.RVU_CURRICULUM;
const manifest=JSON.parse(read('learn/audio-manifest.json'));
const letterIds=curriculum.alphabet.map(x=>x.id);
const unitIds=curriculum.sentences.map(x=>x.id);
const lessonPaths=[...letterIds.map(x=>'learn/alphabet/'+x+'/index.html'),
 ...unitIds.map(x=>'learn/sentences/'+x+'/index.html')];
function walk(dir){
 let files=[];
 for(const item of readdirSync(at(dir),{withFileTypes:true})){
  const name=path.posix.join(dir,item.name);
  if(item.isDirectory())files.push(...walk(name));
  else if(item.isFile())files.push(name);
 }
 return files;
}
test('all 41 lesson routes have valid HTML and the required shared scripts',()=>{
 assert.equal(letterIds.length,26);assert.equal(unitIds.length,15);
 assert.equal(lessonPaths.length,41);
 for(const filename of lessonPaths){
  assert.ok(existsSync(at(filename)),filename);
  const html=read(filename);
  assert.match(html,/data-page="lesson"/,filename);
  assert.match(html,/id="lesson-root"/,filename);
  assert.match(html,/\/learn\/content\.js/,filename);
  assert.match(html,/\/learn\/learn\.js/,filename);
 }
});
test('all 101 vocabulary illustrations exist and contain SVG markup',()=>{
 const words=[...new Set(curriculum.alphabet.flatMap(x=>x.words))];
 assert.equal(words.length,101);
 for(const word of words){
  const filename='assets/words/'+word.replaceAll(' ','-')+'.svg';
  assert.ok(existsSync(at(filename)),filename);
  const svg=read(filename);
  assert.match(svg,/^<svg\b/,filename);
  assert.match(svg,/<\/svg>\s*$/,filename);
 }
});
test('every recorded phrase has both voice clips with nonempty MPEG files',()=>{
 assert.equal(manifest.recordings.length,244);
 const voiceRows=JSON.parse(read('learn/learn.js').split('const AUDIO_ROWS=')[1].split(';')[0]);
 assert.deepEqual(voiceRows,manifest.recordings.map(x=>[x.type,x.lesson,x.text]));
 for(let i=0;i<manifest.recordings.length;i++){
  const entry=manifest.recordings[i];
  for(const voice of ['female','male']){
   const expected='/assets/audio/'+voice+'/'+String(i).padStart(3,'0')+'.mp3';
   assert.equal(entry.voices[voice],expected,voice+' / '+i);
   const filename=expected.slice(1);
   assert.ok(existsSync(at(filename)),filename);
   assert.ok(statSync(at(filename)).size>100,filename+' is empty or suspiciously small');
   const bytes=readFileSync(at(filename));
   assert.ok(bytes.subarray(0,3).toString('ascii')==='ID3'||
    (bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0),
    filename+' has no recognizable MP3 sync/header');
  }
 }
});
test('all HTML script, stylesheet and image URLs resolve to files',()=>{
 const pages=walk('.').filter(x=>x.endsWith('.html')&&!x.startsWith('dist/'));
 for(const filename of pages){
  const html=read(filename);
  const refs=[...html.matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)="([^"]+)"/gi)].map(x=>x[1]);
  for(const ref of refs){
   if(/^(?:https?:|data:|#|\/\/|mailto:|tel:)/i.test(ref))continue;
   const pathname=ref.split(/[?#]/)[0];
   if(!pathname||pathname==='/')continue;
   const relative=pathname.startsWith('/')?pathname.slice(1):
    path.posix.normalize(path.posix.join(path.posix.dirname(filename),pathname));
   const resolved=relative.endsWith('/')?relative+'index.html':relative;
   assert.ok(existsSync(at(resolved)),filename+' -> '+ref+' expected '+resolved);
  }
 }
});
test('the five public preview images are valid WebP and the PDF stays outside the built assets',()=>{
 for(const word of ['cover','letter-a','practice-a','feelings','letter-m']){
  const filename='assets/'+word+'.webp';
  assert.ok(existsSync(at(filename)),filename);
  const header=readFileSync(at(filename)).subarray(0,12);
  assert.equal(header.toString('ascii',0,4),'RIFF',filename);
  assert.equal(header.toString('ascii',8,12),'WEBP',filename);
 }
 assert.ok(!walk('assets').some(x=>x.toLowerCase().endsWith('.pdf')),
  'Do not ship the complete book PDF in public assets');
});
test('recordings with unreviewed pronunciation cannot silently receive approval',()=>{
 const blocked=manifest.recordings.filter(row=>row.pronunciationStatus==='blocked-pending-human-review');
 assert.deepEqual(blocked.map(x=>x.text).sort(),[]);
 assert.equal(manifest.pronunciationQA.humanSignoffComplete,false);
 assert.doesNotMatch(read('learn/learn.js'),/REPORTED_WRONG_WORD_AUDIO/);
});
