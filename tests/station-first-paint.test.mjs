import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('the 26-map stations have static server-rendered structure to prevent first-paint layout jumps',()=>{
 const pages=['learn/index.html','learn/alphabet/index.html'];
 for(const p of pages){
  const html=readFileSync(p,'utf8');
  const section=html.slice(html.indexOf('class="storybook-map-intro"'),html.indexOf('</main>'));
  assert.ok(section.startsWith('class="storybook-map-intro"'),p);
  assert.match(section,/class="letter-grid storybook-map" id="letter-grid"/);
  assert.equal((section.match(/class="storybook-stop"/g)||[]).length,26,p);
  assert.equal((section.match(/class="storybook-station-image"/g)||[]).length,26,p);
 }
 const js=readFileSync('learn/learn.js','utf8');
 assert.match(js,/existing\.querySelector\('\.storybook-map-title'\)/);
});
