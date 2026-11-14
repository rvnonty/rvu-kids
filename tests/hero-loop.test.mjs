import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('100-page storefront and preview copy agree',()=>{
 const home=readFileSync('index.html','utf8');
 const preview=readFileSync('preview/index.html','utf8');
 const app=readFileSync('app.js','utf8');
 assert.match(home, /<strong>100<\/strong>/);
 assert.match(home, /<b>100<\/b>/);
 assert.match(home, /100 صفحة/);
 assert.match(app, /100-page illustrated workbook/);
 assert.match(preview, /100 صفحة/);
});
test('hero video is optional and never blocks the book poster',()=>{
 const home=readFileSync('index.html','utf8');
 const js=readFileSync('hero-loop.mjs','utf8');
 const css=readFileSync('home-motion.css','utf8');
 assert.match(home, /hero-loop\.mjs/);
 assert.match(home, /assets\/cover-480\.webp/);
 assert.match(js, /fetch\(MEDIA_PATH, \{ method: 'HEAD'/);
 assert.match(js, /if \(!availability\.ok/);
 assert.match(js, /prefers-reduced-motion: reduce/);
 assert.match(js, /classList\.add\('has-live-video'\)/);
 assert.match(css, /\.hero-loop-video/);
});
