import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const from=(name)=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const story=from('learn/story-moments.mjs');
const scenes=runInNewContext(story.replace(/^export /gm,'')+'\n({STORY_MOMENTS,approvedMoments});',{});
const curriculumWindow={};
runInNewContext(from('learn/content.js'),{window:curriculumWindow});
const curriculum=curriculumWindow.RVU_CURRICULUM;
const audioRows=from('learn/learn.js');
const home=from('index.html'),parents=from('parents/index.html');
const dashboard=from('parents/dashboard.js');
const journey=from('learn/story-journey.mjs');
const game=from('learn/activities.mjs');
const css=from('learn/story-journey.css');

test('first screen offers accessible distinct parent and child routes',()=>{
 assert.match(home,/class="hero-routes"/);
 assert.match(home,/href="\/parents\/#parent-dashboard"/);
 assert.match(home,/href="\/learn\/" class="hero-route hero-route-kids"/);
});

test('Parent Mode keeps progress, settings, guidance and commerce separate',()=>{
 assert.match(parents,/id="parent-dashboard"/);
 for(const key of ['parent-letter-visited','parent-letter-completed','parent-unit-completed',
  'parent-stars-count','parent-next-link','parent-playback-speed','parent-reduce-motion',
  'parent-sticker-album','parent-reset-progress','parent-buying']){
  assert.ok(parents.includes('id="'+key+'"'),'Parent control missing: '+key);
 }
 assert.match(parents,/href="\/#order"/);
 assert.match(dashboard,/rvu-story-progress-v1/);
 assert.match(dashboard,/rvu-playback-speed/);
 assert.match(dashboard,/rvu-motion-off/);
 assert.match(dashboard,/window\.confirm/);
});

test('four book-based Everyday English journeys have three approved scenes each',()=>{
 const units=Object.keys(scenes.STORY_MOMENTS);
 assert.deepEqual([...units].sort(),['at-school','can-i-have','can-you-help','polite-words'].sort());
 for(const id of units){
  const lesson=curriculum.sentences.find(item=>item.id===id);
  assert.ok(lesson,'Unknown curriculum unit '+id);
  const actual=scenes.approvedMoments(lesson);
  assert.equal(actual.length,3,id);
  for(const moment of actual){
   assert.ok(lesson.sentences.includes(moment.answer));
   assert.equal(moment.choices.length,3);
   assert.equal(new Set(moment.choices).size,3);
   for(const phrase of moment.choices){
    assert.ok(lesson.sentences.includes(phrase),phrase);
    assert.ok(audioRows.includes(JSON.stringify(['everyday-sentence',id,phrase]).slice(1,-1)),
     'Missing approved audio row: '+id+' / '+phrase);
   }
  }
 }
});

test('visual choices include approved audio and gentle local feedback',()=>{
 assert.match(journey,/playButton\('everyday-sentence',lesson.id,phrase\)/);
 assert.match(journey,/className='character-portrait/);
 assert.match(journey,/rvu:activity-feedback/);
 assert.match(journey,/rvu:story-stage/);
 assert.match(journey,/rvu-story-journey/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(game,/kind:panel\.dataset\.gameKind/);
 assert.match(game,/kind==='spell'/);
 assert.match(game,/kind==='listen'/);
});

test('learning area no longer displays direct purchasing calls to action',()=>{
 const hub=from('learn/index.html');
 assert.doesNotMatch(hub,/href="\/#order"/);
 assert.doesNotMatch(hub,/<section class="cta">/);
 assert.match(hub,/href="\/parents\/#parent-dashboard"/);
 const learning=from('learn/learn.js');
 assert.match(learning,/document\.querySelectorAll\('\.cta'\)/);
});
