import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('storybook guides reserve their layout space before scripts hydrate the alphabet pages',()=>{
 for(const path of ['learn/index.html','learn/alphabet/index.html']){
  const src=readFileSync(path,'utf8');
  assert.match(src,/<aside class="storybook-guide" data-mood="welcome"/);
  assert.match(src,/class="storybook-guide-text" role="status"/);
 }
 const js=readFileSync('learn/storybook.mjs','utf8');
 assert.match(js,/hero\.querySelector\('\.storybook-guide'\)/);
 assert.match(js,/guide=existing/);
});
