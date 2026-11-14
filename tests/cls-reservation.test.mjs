import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('alphabet and learning hub reserve static playback speed control space',()=>{
 const js=readFileSync('learn/learn.js','utf8'),css=readFileSync('learn/learn.css','utf8');
 for(const path of ['learn/alphabet/index.html','learn/index.html'])assert.match(readFileSync(path,'utf8'),/<div class="standalone-speed-picker" aria-label="اختيار سرعة النطق"><\/div>/,path);
 assert.match(js,/hero\.querySelector\('\.standalone-speed-picker'\)/);
 assert.match(js,/wrapper\.replaceChildren\(pronunciationSpeedPicker\(\)\)/);
 assert.match(css,/\.hero>\.standalone-speed-picker\{min-height:108px/);
});
