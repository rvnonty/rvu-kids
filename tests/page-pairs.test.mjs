import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const c=JSON.parse(readFileSync('learn/content.js','utf8').match(/window.RVU_CURRICULUM=(\{[\s\S]*\});/)[1]);
test('printed pages are paired per letter, A starts 1–2 and Z ends 51–52',()=>{
 assert.equal(c.alphabet.length,26);
 const used=new Set();
 c.alphabet.forEach((item,i)=>{
   const printed=item.pages.map(n=>n-3);
   assert.deepEqual(printed,[1+i*2,2+i*2]);
   for(const p of printed){assert.ok(!used.has(p));used.add(p)}
   assert.equal(new Set(item.words).size,item.words.length);
 });
 assert.equal(used.size,52);
 assert.equal(c.alphabet.reduce((n,item)=>n+item.words.length,0),101);
});
test('page number picker accepts either facing page and renders one word group only',()=>{
 const js=readFileSync('learn/learn.js','utf8');
 const html=readFileSync('learn/words/index.html','utf8');
 assert.ok(js.includes("pageInput.min='1'"));
 assert.ok(js.includes("pageInput.max='52'"));
 assert.ok(js.includes('printedPages(a.pages).includes(n)'));
 assert.ok(js.includes('item.words.forEach((word,i)=>grid.append(renderWordCard(word,item.id,i)))'));
 assert.ok(js.includes('history.replaceState'));
 assert.ok(!js.includes('words-61-101'));
 assert.match(html,/كلمات الكتاب حسب رقم الصفحة والحرف/);
});
