import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('visible learning navigation reserves language-switch space before hydration',()=>{
 const js=readFileSync('learn/learn.js','utf8');
 assert.match(js,/nav\.querySelector\('button\.lang-switch'\)/);
 assert.match(js,/if\(!sw\.isConnected\)nav\.append\(sw\)/);
 for(const path of ['learn/alphabet/index.html','learn/index.html','preview/index.html']){
  const html=readFileSync(path,'utf8');
  const header=html.slice(html.indexOf('<header class="sitebar">'),html.indexOf('</header>'));
  assert.equal((header.match(/class="lang-switch"/g)||[]).length,1,path);
  assert.match(header,/aria-label="Switch to English"/);
 }
});
