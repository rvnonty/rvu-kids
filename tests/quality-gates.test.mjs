import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('preview remains five selected book pages with fixed ratios and nonempty loading artwork',()=>{
 const html=read('preview/index.html');
 const css=read('learn/learn.css');
 assert.equal((html.match(/<figure>/g)||[]).length,5);
 assert.match(css,/preview-five figure::before/);
 assert.match(css,/aspect-ratio:900\/1273/);
 assert.match(css,/preview-image-failed/);
 assert.match(read('learn/learn.js'),/img\.addEventListener\('error',failed/);
});
test('A-Z map provides separate keyboard-friendly image links and approved audio',()=>{
 const source=read('learn/storybook.mjs');
 const pageScript=read('learn/learn.js');
 assert.match(source,/const stop=node\('div','storybook-stop'\)/);
 assert.match(source,/const station=node\('a','storybook-station'\)/);
 assert.match(source,/const listen=node\('button','storybook-station-listen'/);
 assert.match(source,/listen\.disabled=!playable/);
 assert.match(pageScript,/window\.RVU_WORD_AUDIO/);
 assert.match(pageScript,/REPORTED_WRONG_WORD_AUDIO=new Set\(\['fish','fork'\]\)/);
});
test('new motion respects user reduction and does not autoplay audio',()=>{
 const css=read('learn/learn.css');
 const js=read('learn/learn.js');
 assert.match(css,/html\.rvu-motion-off/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(js,/window\.RVU_WORD_AUDIO/);
 assert.doesNotMatch(js,/SpeechSynthesisUtterance|speechSynthesis|deviceVoice/);
 assert.match(js,/b\.addEventListener\('click',\(\)=>\{/);
 assert.match(js,/utterance\.lang='en-US'/);
 assert.match(js,/REPORTED_WRONG_WORD_AUDIO/);
});
test('performance budgets are stated honestly without claiming a synthetic INP',()=>{
 const script=read('scripts/check-vitals.mjs');
 assert.match(script,/2500/);
 assert.match(script,/cls<=0\.1/);
 assert.match(script,/INP field data required/);
 const workflow=read('.github/workflows/lighthouse.yml');
 assert.match(workflow,/lighthouse@/);
 assert.match(workflow,/Run Lighthouse - preview/);
});
