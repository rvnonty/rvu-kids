import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const home=read('index.html'),app=read('app.js'),book=read('books/alphabet/index.html');
const parents=read('parents/index.html'),preview=read('preview/index.html'),worker=read('server/worker.mjs');

test('public book pages and both languages show no price or automatic monetary total',()=>{
 for(const [name,source] of Object.entries({home,app,book,parents,preview,learning:read('learn/learn.js')})){
  assert.doesNotMatch(source,/300|٣٠٠|EGP|جنيه|BOOK_PRICE_EGP/,name);
 }
 assert.match(book,/content="0;url=\/#order"/);
 assert.match(parents,/content="0;url=\/#order"/);
 assert.doesNotMatch(home,/id="(?:subtotal|total|shipping-cost)"/);
});

test('backend never adds a legacy regional surcharge, even if orders are enabled',()=>{
 assert.match(worker,/const BOOK_PRICE_EGP=300/);
 assert.match(worker,/const shipping=0,subtotal=order.quantity\*BOOK_PRICE_EGP/);
 assert.match(worker,/shippingIncluded:true/);
 assert.doesNotMatch(worker,/SELECT governorate, amount_egp FROM shipping_rates/);
 assert.doesNotMatch(worker,/shipping===null/);
});
