import test from 'node:test';
import assert from 'node:assert/strict';
import {buildOrderMessage,buildOrderUrl} from '../app.js';
test('WhatsApp order preserves the chosen quantity in both languages without requesting child data or quoting a price',()=>{
 for(const language of ['ar','en'])for(const copies of [1,2,20]){
  const url=new URL(buildOrderUrl(copies,language));
  assert.equal(url.origin,'https://wa.me');
  assert.equal(url.pathname,'/201012809358');
  assert.equal(url.searchParams.get('text'),buildOrderMessage(copies,language).join('\n'));
  assert.match(url.searchParams.get('text'),new RegExp('(?:Copies: |عدد النسخ: )'+copies+'(?:\\n|$)'));
  assert.doesNotMatch(url.searchParams.get('text'),/300|٣٠٠|EGP|جنيه|child.*name|اسم الطفل/i);
 }
});
test('invalid copy counts cannot create an order link',()=>{
 for(const copies of [0,-1,21,1.5,NaN,Infinity,'2',null])assert.throws(()=>buildOrderUrl(copies),RangeError);
});
