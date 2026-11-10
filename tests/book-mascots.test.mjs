import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const read=path=>readFileSync(path,'utf8');
const learning=read('learn/learn.js');
const lessonCss=read('learn/learn.css');
const games=read('learn/activities.mjs');
const gamesCss=read('learn/activities.css');

test('remove only the requested home order timing statement, in Arabic and English',()=>{
 const home=read('index.html'),translation=read('app.js');
 assert.ok(!home.includes('بنطبع في ميت غمر حسب الطلب.'));
 assert.ok(!home.includes('الطباعة بتاخد تقريبًا يوم بعد مراجعة التحويل'));
 assert.ok(!home.includes('data-i18n="howIntro"'));
 assert.ok(!translation.includes("howIntro:'Printed on demand"));
 assert.ok(home.includes('data-i18n="step1Title"'),'order steps stay intact');
 assert.ok(home.includes('id="submit-order"'),'WhatsApp order form remains available');
 assert.ok(!home.includes('https://wa.me/'),'phone number is not exposed as a public link');
 assert.ok(translation.includes("'https://wa.me/201012809358?text='"),'order submit still opens WhatsApp');
});

test('all letter lessons keep alphabet name audio but no longer render phonics audio or explanation',()=>{
 assert.ok(learning.includes("playButton('letter-name',d.id,d.letter)"));
 assert.ok(learning.includes("const letterCard=el('div','letter-name')"));
 assert.ok(learning.includes("el('div','letter-name-copy')"));
 assert.ok(learning.includes("el('div','letter-name-action')"));
 assert.ok(!learning.includes("playButton('letter-sound',d.id,d.letter)"));
 assert.ok(!learning.includes("phonics-note"));
 assert.ok(!lessonCss.includes('.phonics-note'));
 assert.ok(!learning.includes("phonics-line"));
 assert.ok(!learning.includes('اسم الحرف مختلف عن صوته، اسمع الاتنين.'));
 assert.ok(!learning.includes('The letter name is different from its phonics sound.'));
});

test('both audio voice choices use original book boy and girl, labels and existing switching',()=>{
 assert.ok(learning.includes("['female','girl','بنت','Girl']"));
 assert.ok(!learning.includes('👧')&&!learning.includes('👦'));

 assert.ok(learning.includes("['male','boy','ولد','Boy']"));
 assert.ok(learning.includes("el('span','character-portrait voice-avatar '+kind)"));
 assert.ok(learning.includes("b.setAttribute('aria-pressed'"));
 assert.ok(learning.includes("localStorage.setItem('rvu-voice',id)"));
 assert.ok(lessonCss.includes("background-image:url('/assets/cover.webp')"));
 assert.ok(lessonCss.includes('.voice-picker .voice-avatar.character-portrait'));
});

test('book page link and name audio have intentional spacing and small-screen fallback',()=>{
 assert.ok(learning.includes('spread-lesson-link lesson-words-link'));
 assert.ok(learning.includes('lesson-words-icon'));
 assert.ok(lessonCss.includes('.letter-name{display:grid;'));
 assert.ok(lessonCss.includes('gap:clamp(18px,3vw,42px)'));
 assert.ok(lessonCss.includes('.letter-name-action .audio-play'));
 assert.ok(lessonCss.includes('.lesson-words-link'));
 assert.ok(lessonCss.includes('@media(max-width:650px)'));
});

test('actual book lizard participates in games with distinct happy and retry moods',()=>{
 assert.ok(games.includes("el('span','character-portrait lizard rvu-lizard-avatar')"));
 assert.ok(games.includes("setMascot(panel,lang,ok?'correct':'retry')"));
 assert.ok(games.includes("mood==='correct'"));
 assert.ok(games.includes("mood==='retry'"));
 assert.ok(games.includes("'حاول مرة تانية براحتك.'"));
 assert.ok(games.includes("'برافو عليك!'"));
 assert.ok(games.includes("['girl','lizard','boy']"));
 assert.ok(gamesCss.includes('.rvu-game-panel[data-mood="correct"]'));
 assert.ok(gamesCss.includes('.rvu-game-panel[data-mood="retry"]'));
 assert.ok(gamesCss.includes('@media(prefers-reduced-motion:reduce)'));
 assert.ok(existsSync('dist/learn/activities.mjs'));
});
