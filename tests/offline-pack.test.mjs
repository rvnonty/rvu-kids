import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
test('retired parents offline service and settings do not ship to visitors',()=>{
 assert.equal(existsSync(new URL('../learn/offline-sw.js',import.meta.url)),false);
 for(const old of ['parents/guide.js','parents/settings.js','parents/offline.js','parents/guide.css']){
  assert.equal(existsSync(new URL('../'+old,import.meta.url)),false,old);
 }
 const redirect=read('parents/index.html');
 assert.match(redirect,/<meta http-equiv="refresh" content="0;url=\/#order">/);
 assert.match(redirect,/noindex,follow/);
});
test('kid learning replaces legacy offline workers with persistent media caching',()=>{
 const source=read('learn/learn.js');
 assert.match(source,/getRegistration\('\/learn\/'\)/);
 assert.match(source,/registration\.unregister\(\)/);
 assert.match(source,/register\('\/learn\/media-sw\.js'/);
 assert.match(source,/rvu-learning-a-b-/);
 assert.match(source,/window\.caches\.delete\(key\)/);
});
