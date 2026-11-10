import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {SCENES,makeActivityData,shuffle} from '../learn/activity-data.mjs';

const source=readFileSync('learn/content.js','utf8');
const context={window:{}};
runInNewContext(source,context);
const curriculum=context.window.RVU_CURRICULUM;

test('all 15 Everyday English units get four independent extra games',()=>{
 assert.equal(curriculum.sentences.length,15);
 assert.equal(Object.keys(SCENES).length,15);
 for(const unit of curriculum.sentences){
  const plan=makeActivityData('sentences',unit);
  assert.ok(plan.scene.length>=2,unit.id+' scenario rounds');
  assert.ok(plan.listening.length>=2,unit.id+' listen rounds');
  assert.ok(plan.missing.length>=1,unit.id+' missing-word rounds');
  assert.ok(plan.reorder.length>=1,unit.id+' reordering rounds');
  for(const row of plan.scene){
   assert.ok(unit.sentences.includes(row.answer),unit.id+': '+row.answer);
   assert.ok(row.choices.includes(row.answer),unit.id);
   assert.equal(new Set(row.choices).size,row.choices.length);
   assert.ok(row.ar&&row.en&&row.emoji);
  }
  for(const type of ['listening','missing']){
   for(const round of plan[type]){
    assert.ok(round.choices.includes(round.answer),unit.id+' '+type);
    assert.equal(new Set(round.choices).size,round.choices.length);
   }
  }
 }
});
test('all 26 alphabet lessons get picture, listening, spelling, sentence-order practice',()=>{
 assert.equal(curriculum.alphabet.length,26);
 for(const letter of curriculum.alphabet){
  const plan=makeActivityData('alphabet',letter);
  assert.equal(plan.pictures.length,letter.words.length,letter.id);
  assert.ok(plan.wordListening.length>=2,letter.id+' listen');
  assert.ok(plan.spelling.length>=1,letter.id+' spell');
  assert.ok(plan.reorder.length>=1,letter.id+' word order');
  for(const r of plan.spelling){
   assert.equal(r.shuffled.length,[...r.word].length);
   assert.equal(new Set(r.shuffled).size,r.shuffled.length);
   assert.deepEqual([...r.shuffled].sort((a,b)=>a-b),[...r.word].map((_,i)=>i));
  }
 }
});
test('shuffles and activities remain finite and predictable; protected mispronounced clips are not used in listening games',()=>{
 assert.deepEqual(shuffle([0,1,2,3,4],99),shuffle([0,1,2,3,4],99));
 const f=curriculum.alphabet.find(x=>x.id==='f');
 const rounds=makeActivityData('alphabet',f);
 assert.ok(!rounds.wordListening.some(r=>r.answer==='fish'||r.answer==='fork'));
 assert.ok(rounds.pictures.some(r=>r.answer==='fish'));
});
test('lesson route progressively loads activities and respects users who prefer fewer animations',()=>{
 const js=readFileSync('learn/learn.js','utf8');
 const game=readFileSync('learn/activities.mjs','utf8');
 const css=readFileSync('learn/activities.css','utf8');
 assert.ok(js.includes("import('/learn/activities.mjs')"));
 assert.ok(js.includes("sheet.href='/learn/activities.css'"));
 assert.ok(existsSync('dist/learn/activities.mjs'));
 assert.ok(existsSync('dist/learn/activity-data.mjs'));
 assert.ok(existsSync('dist/learn/activities.css'));
 assert.match(game,/role','status'/);
 assert.ok(game.includes('aria-live'));
 assert.ok(game.includes('aria-selected'));
 assert.ok(game.includes('animationend'));
 assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
 assert.ok(!game.includes('setInterval('));
 assert.ok(!game.includes('localStorage.'));
});
