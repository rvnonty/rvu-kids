import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const home=read('index.html'),app=read('app.js'),book=read('books/alphabet/index.html');
const parents=read('parents/index.html'),settings=read('parents/settings.js'),worker=read('server/worker.mjs');

test('the published book has a fixed 300 EGP delivered price throughout Arabic and English public pages',()=>{
 assert.match(home,/300 جنيه شامل الشحن والتوصيل لباب المنزل/);
 assert.match(home,/300 جنيه للنسخة، من غير أي رسوم شحن إضافية/);
 assert.match(home,/id="subtotal">300 جنيه/);
 assert.match(book,/300 <small>EGP<\/small>/);
 assert.match(book,/شامل الشحن والتوصيل لباب المنزل/);
 assert.match(parents,/300 جنيه مصري للنسخة شامل مصاريف الشحن والتوصيل لباب المنزل/);
 assert.match(settings,/300 EGP per copy, including shipping and delivery to your doorstep/);
 assert.match(app,/price:'300 EGP/);
 for(const file of [home,book,parents])assert.doesNotMatch(file,/200 (?:جنيه|EGP)|الشحن حسب المحافظة|plus shipping/);
});

test('order quantity and WhatsApp totals include delivery without any additional quote',()=>{
 assert.match(app,/const BOOK_PRICE_EGP=300/);
 assert.match(app,/const total=count\*BOOK_PRICE_EGP/);
 assert.match(app,/const copies=Number\(payload.quantity\)/);
 assert.match(app,/copies\*BOOK_PRICE_EGP/);
 assert.match(app,/مصاريف شحن إضافية: 0 جنيه/);
 assert.match(app,/Additional shipping fee: 0 EGP/);
 assert.doesNotMatch(app,/count\*200|copies\*200|shippingRates|Awaiting shipping quote/);
});

test('backend never adds a legacy regional surcharge, even if orders are enabled',()=>{
 assert.match(worker,/const BOOK_PRICE_EGP=300/);
 assert.match(worker,/const shipping=0,subtotal=order.quantity\*BOOK_PRICE_EGP/);
 assert.match(worker,/shippingIncluded:true/);
 assert.doesNotMatch(worker,/SELECT governorate, amount_egp FROM shipping_rates/);
 assert.doesNotMatch(worker,/shipping===null/);
});
