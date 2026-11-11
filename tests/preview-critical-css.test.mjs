import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('preview paints first-screen layout from lightweight critical CSS and defers noncritical sheets',()=>{
 const critical=readFileSync('learn/critical-preview.css','utf8');
 const html=readFileSync('preview/index.html','utf8');
 assert.ok(critical.length>8000&&critical.length<40000);
 for(const selector of ['.hero','.sitebar','.shell','.rvu-flip-frame'])assert.ok(critical.includes(selector),selector);
 assert.match(html,/href="\/learn\/critical-preview\.css"/);
 assert.match(html,/href="\/learn\/learn\.css" media="print" onload=/);
 assert.match(html,/href="\/learn\/next-adventures\.css" media="print" onload=/);
 assert.match(html,/<noscript><link rel="stylesheet"/);
});
