import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {join} from 'node:path';

const reviewRoot='audio-review';
const manifest=JSON.parse(readFileSync(join(reviewRoot,'learn/audio-manifest.json'),'utf8'));
const activeManifest=JSON.parse(readFileSync('learn/audio-manifest.json','utf8'));
const html=readFileSync(join(reviewRoot,'index.html'),'utf8');

test('244 separate review tracks match the source curriculum',()=>{
  assert.equal(manifest.requiredRecordings,244);
  assert.equal(manifest.recordings.length,244);
  assert.deepEqual(
    Object.fromEntries(['letter-name','letter-sound','word','alphabet-sentence','everyday-sentence'].map(type=>[
      type,manifest.recordings.filter(r=>r.type===type).length
    ])),
    {'letter-name':26,'letter-sound':26,'word':101,'alphabet-sentence':27,'everyday-sentence':64}
  );
  assert.deepEqual(
    manifest.recordings.map(({type,lesson,text})=>({type,lesson,text})),
    activeManifest.recordings.map(({type,lesson,text})=>({type,lesson,text}))
  );
});

test('all 244 MP3 paths are unique and files are nonempty',()=>{
  const paths=manifest.recordings.map(r=>r.asset);
  assert.equal(new Set(paths).size,244);
  for(const asset of paths){
    assert.match(asset,/^\/learn\/audio\/(?:letter-name|letter-sound|word|alphabet-sentence|everyday-sentence)\/[a-z0-9-]+\.mp3$/);
    const file=join(reviewRoot,asset.slice(1));
    assert.ok(existsSync(file),file);
    assert.ok(statSync(file).size>3500,file);
  }
});

test('draft tracks stay unapproved and child-facing lessons stay disabled',()=>{
  assert.equal(manifest.notForPublicPlayback,true);
  assert.equal(manifest.status,'awaiting-human-approval');
  assert.ok(manifest.recordings.every(r=>r.review_status==='pending-human-review'));
  assert.ok(manifest.recordings.every(r=>r.technical_status==='passed'));
  assert.ok(activeManifest.recordings.every(r=>r.asset===null));
  assert.ok(html.includes('meta name="robots" content="noindex,nofollow"'));
  assert.ok(html.includes('audio id="audio" controls'));
  assert.ok(html.includes("fetch('./learn/audio-manifest.json'"));
  assert.ok(readFileSync('build.mjs','utf8').includes("'audio-review'"));
});
