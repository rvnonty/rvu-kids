import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('English preview promotes the book and retains its production details without prices',()=>{
 const script=read('learn/learn.js'),preview=read('preview/index.html');
 assert.doesNotMatch(script,/200 EGP|Mit Ghamr|Shipping is calculated by governorate/);
 assert.doesNotMatch(script,/300 EGP|٣٠٠|جنيه/);
 assert.match(script,/A book to hold\. A world to explore\./);
 assert.doesNotMatch(script,/Printed on demand in Mansoura, Egypt/);
 assert.match(preview,/100 صفحة برسومات واضحة/);
 assert.doesNotMatch(preview,/مطبوعة حسب الطلب في المنصورة/);
});
test('preview images use accessible buttons while preserving figure captions',()=>{
 const script=read('learn/learn.js'),css=read('learn/learn.css');
 assert.match(script,/el\('button','preview-open'\)/);
 assert.doesNotMatch(script,/figure\.setAttribute\('role','button'\)/);
 assert.match(script,/figure\.append\(opener\)/);
 assert.match(css,/\.preview-open:focus-visible/);
 assert.match(css,/justify-content:space-between;color:#50655d/);
});
