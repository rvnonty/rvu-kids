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
const journey=from('learn/story-journey.mjs');
const game=from('learn/activities.mjs');
const css=from('learn/story-journey.css');

test('first screen focuses on the printed book and one WhatsApp order form',()=>{
 assert.match(home,/class="hero-actions purchase-actions"/);
 assert.match(home,/href="#order"/);
 assert.match(home,/data-i18n="heroLearn"/);
 assert.match(home,/id="submit-order"/);
 assert.doesNotMatch(home,/class="hero-routes"|hero-route-parents|href="\/parents\//);
 assert.doesNotMatch(home,/>\s*\+?201012809358\s*</);
});
test('old parent settings guide redirects to the single book order page',()=>{
 assert.match(parents,/name="robots" content="noindex,follow"/);
 assert.match(parents,/content="0;url=\/#order"/);
 assert.doesNotMatch(parents,/parent-guide|parent-settings|parent-offline-save/);
 assert.doesNotMatch(home,/href="\/parents\//);
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
 assert.doesNotMatch(hub,/href="\/parents\//);
 const learning=from('learn/learn.js');
 assert.match(learning,/document\.querySelectorAll\('\.cta'\)/);
 assert.doesNotMatch(learning,/parent-nav-link/);
});
