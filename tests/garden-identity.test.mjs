import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../learn/next-adventures.mjs',import.meta.url),'utf8');
const gardenCss=readFileSync(new URL('../learn/next-adventures.css',import.meta.url),'utf8');
const lessons=readFileSync(new URL('../learn/learn.js',import.meta.url),'utf8');
const preview=readFileSync(new URL('../preview/index.html',import.meta.url),'utf8');
const expose=source.replace(/^import .*$/gm,'').replace(/^export /gm,'')+
 '\nreturn {LETTER_GARDENS,SENTENCE_GARDENS,themeFor};';
const helpers=new Function('window','document','location','localStorage',expose)(
 {RVU_CURRICULUM:{alphabet:[],sentences:[]}},
 {documentElement:{lang:'ar'}},{pathname:'/'},{});
const letters='abcdefghijklmnopqrstuvwxyz'.split('');

test('26 distinct letter scenes use their own illustrated-theme palettes',()=>{
 assert.equal(Object.keys(helpers.LETTER_GARDENS).length,26);
 const colors=new Set();
 for(const id of letters){
  const theme=helpers.themeFor('alphabet',{id});
  assert.ok(theme.scene);
  for(const color of [theme.sky,theme.grass,theme.flower,theme.leaf])
   assert.match(color,/^#[0-9a-f]{6}$/i);
  colors.add([theme.sky,theme.grass,theme.flower,theme.leaf].join('|'));
 }
 assert.equal(colors.size,26);
});

test('every everyday-English unit has a coordinated garden palette',()=>{
 const keys=Object.keys(helpers.SENTENCE_GARDENS);
 assert.equal(keys.length,15);
 for(const id of keys){
  const theme=helpers.themeFor('sentences',{id});
  assert.ok(theme.scene&&theme.sky&&theme.grass);
 }
});

test('garden animations suspend offscreen and respect reduced motion',()=>{
 assert.match(source,/activateGardenMotion/);
 assert.match(source,/IntersectionObserver/);
 assert.match(gardenCss,/rvu-motion-visible/);
 assert.match(gardenCss,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(gardenCss,/animation:none!important/);
});

test('the complete workbook is not embedded in lessons or the preview',()=>{
 assert.equal((preview.match(/<figure>/g)||[]).length,5);
 assert.doesNotMatch(lessons,/page\.src=d\.id==='a'/);
 assert.doesNotMatch(lessons,/image\.src='\/assets\/feelings\.webp'/);
 assert.doesNotMatch(source,/\.pdf['"]/);
});
