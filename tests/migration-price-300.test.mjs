import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
test('migration retains historical 200 EGP invoices and permits 300 EGP delivered orders',()=>{
 const sqlite=new DatabaseSync(':memory:');
 const columns='reference,request_key,body_hash,parent_name,phone,governorate,city,address,quantity,payment_method,notes,locale,unit_price_egp,subtotal_egp,shipping_egp,total_egp,status,created_at,consent_version';
 const insert=(ref,unit,qty,shipping,total)=>{
  sqlite.prepare('INSERT INTO orders ('+columns+') VALUES ('+Array(19).fill('?').join(',')+')').run(
   ref,ref+'-key',ref+'-hash','Test Parent','01000000000','DK','Mansoura',
   'Full delivery address',qty,'instapay','','ar',unit,qty*unit,shipping,total,
   'pending_review','2026-11-10','2026-09-21');
 };
 try{
  sqlite.exec(read('server/schema.sql').replace('CHECK(unit_price_egp > 0)','CHECK(unit_price_egp = 200)'));
  insert('RVK-OLD',200,1,73,273);
  assert.throws(()=>insert('RVK-REJECT',300,2,0,600));
  sqlite.exec(read('server/migrations/20261110_price_300_inclusive.sql'));
  insert('RVK-NEW',300,2,0,600);
  const prices=sqlite.prepare('SELECT reference,unit_price_egp,shipping_egp,total_egp FROM orders ORDER BY reference').all();
  assert.deepEqual(prices.map(row=>[row.reference,row.unit_price_egp,row.shipping_egp,row.total_egp]),
   [['RVK-NEW',300,0,600],['RVK-OLD',200,73,273]]);
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM orders_before_300_egp').get().n,1);
  assert.ok(sqlite.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='orders_review'").get());
 }finally{sqlite.close()}
});
