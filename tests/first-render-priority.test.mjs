import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('static alphabet map hydrates only once and preview gallery uses low-priority lazy images',()=>{
 const js=readFileSync('learn/learn.js','utf8');
 assert.match(js,/grid\.dataset\.serverRendered!=='true'/);
 for(const path of ['learn/index.html','learn/alphabet/index.html']){
  const html=readFileSync(path,'utf8');
  assert.match(html,/id="letter-grid" data-server-rendered="true"/);
 }
 const preview=readFileSync('preview/index.html','utf8');
 assert.equal((preview.match(/fetchpriority="low"/g)||[]).length,5);
 const css=readFileSync('learn/learn.css','utf8');
 assert.match(css,/\.preview-five figure\{content-visibility:auto/);
});
