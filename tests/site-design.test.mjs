import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const file=p=>readFileSync(p,'utf8');

test('requested Arabic and English preview disclaimer is fully removed from site and translation data',()=>{
 const html=file('index.html'),translations=file('app.js'),css=file('style.css');
 assert.doesNotMatch(html,/المعاينة لصفحات مختارة|درجة الألوان في الطباعة|previewNote|preview-note/);
 assert.doesNotMatch(translations,/Printed colors may look different|previewNote/);
 assert.doesNotMatch(css,/\.preview-note/);
 assert.ok(html.includes('id="preview-grid"'), 'keep the actual book previews');
});
test('shared spacing system and mobile focus treatments are present on main and lesson pages',()=>{
 const home=file('style.css'),learn=file('learn/learn.css'),guide=file('parents/guide.css');
 for(const css of [home,learn]){
  assert.ok(css.includes('--rvu-radius-md'));
  assert.ok(css.includes('--rvu-shadow'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('max-width:'));
 }
 assert.ok(guide.includes('guide-age-card'));
 assert.ok(guide.includes('max-width:620px'));
});
test('all primary pages remain intact and have a responsive viewport declaration',()=>{
 const pages=[
  'index.html','preview/index.html','books/alphabet/index.html',
  'learn/index.html','learn/alphabet/index.html','learn/words/index.html',
  'learn/sentences/index.html','learn/sentences/polite-words/index.html',
  'learn/alphabet/a/index.html','parents/index.html'
 ];
 for(const page of pages){
  assert.ok(existsSync(page),page);
  const html=file(page);
  assert.match(html,/<meta name="viewport"/,page);
  assert.match(html,/<main\b/,page);
  assert.ok(existsSync('dist/'+page),'built route '+page);
 }
});
