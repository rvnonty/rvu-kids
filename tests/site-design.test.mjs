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
 const home=file('style.css'),learn=file('learn/learn.css');
 for(const css of [home,learn]){
  assert.ok(css.includes('--rvu-radius-md'));
  assert.ok(css.includes('--rvu-shadow'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('max-width:'));
 }
 assert.ok(home.includes('.purchase-actions'));
 assert.ok(learn.includes('.voice-picker'));
 assert.ok(!existsSync('parents/settings.js'));
 assert.ok(!existsSync('parents/guide.css'));
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

test('responsive footer uses the existing SVG logo, privacy dialog and Ramez Medhat credit',()=>{
 const home=file('index.html'),css=file('style.css');
 assert.match(home,/class="footer-identity"/);
 assert.match(home,/class="brand light" href="\/" aria-label="RVU Kids/);
 assert.match(home,/id="footer-privacy"/);
 assert.match(home,/class="footer-credit" dir="ltr"/);
 assert.match(home,/By:<\/span>/);
 assert.match(home,/Ramez Medhat<span class="footer-heart"/);
 assert.match(home,/❤️/);
 assert.match(home,/id="year"/);
 assert.match(home,/data-i18n="footerPlace"/);
 assert.match(css,/\.footer-top\{display:grid;grid-template-columns:minmax\(0,1fr\) auto minmax\(0,1fr\)/);
 assert.match(css,/@media\(max-width:820px\)/);
 assert.match(css,/\.footer-privacy:focus-visible/);
 assert.match(css,/\.footer-identity/);
 assert.match(css,/assets\/rvu-kids-logo\.svg/);
});
