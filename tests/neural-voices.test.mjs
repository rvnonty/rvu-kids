import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {join} from 'node:path';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const curriculum = JSON.parse(read('learn/audio-manifest.json'));
const neural = JSON.parse(read('audio-review/neural-manifest.json'));
const page = read('audio-review/index.html');

test('exactly 244 source items, each with two US neural voice clips', () => {
  assert.equal(neural.version, 3);
  assert.equal(neural.locale, 'en-US');
  assert.deepEqual(Object.keys(neural.voices).sort(), ['female', 'male']);
  assert.equal(neural.requiredRecordings, 244);
  assert.equal(neural.recordings.length, 244);
  assert.deepEqual(
    neural.recordings.map(({type, lesson, text}) => ({type, lesson, text})),
    curriculum.recordings.map(({type, lesson, text}) => ({type, lesson, text})),
  );
  for (const r of neural.recordings) {
    assert.equal(r.status, 'pending-human-review');
    for (const sex of ['female', 'male']) {
      assert.equal(r.voices[sex]?.review_status, 'pending-human-review');
      assert.equal(r.voices[sex]?.technical_status, 'passed');
    }
  }
});

test('488 local MP3 files with unique voice-specific paths', () => {
  const paths = new Set();
  for (let i = 0; i < neural.recordings.length; ++i) {
    const record = neural.recordings[i];
    for (const voice of ['female', 'male']) {
      const path = record.voices[voice].asset;
      assert.equal(path, '/audio-review/neural/' + voice + '/' + String(i).padStart(3,'0') + '.mp3');
      assert.ok(!paths.has(path), path);
      paths.add(path);
      const f = new URL(path.slice(1), root);
      assert.ok(existsSync(f), path);
      assert.ok(statSync(f).size > 2300, path);
    }
  }
  assert.equal(paths.size, 488);
});

test('voice switching is in preview only and never activates child lessons', () => {
  assert.equal(neural.notForPublicPlayback, true);
  assert.ok(curriculum.recordings.every(x => x.asset === null));
  assert.ok(page.includes('id="voice"'));
  assert.ok(page.includes('value="female"'));
  assert.ok(page.includes('value="male"'));
  assert.ok(page.includes("fetch('./neural-manifest.json'"));
  assert.ok(page.includes("const reviewKey=i=>$('voice').value+':'+i;"));
  assert.ok(page.includes('noindex,nofollow'));
  assert.ok(!read('learn/learn.js').includes('neural-manifest.json'));
  assert.ok(read('build.mjs').includes("'audio-review'"));
});
