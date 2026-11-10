#!/usr/bin/env node
import {readFileSync} from 'node:fs';

/* Lighthouse measures lab LCP and CLS. INP must be checked in field data. */
const files=process.argv.slice(2);
if(!files.length){
 console.error('Usage: node scripts/check-vitals.mjs reports/home.json ...');
 process.exit(2);
}
let failed=false;
for(const filename of files){
 try{
  const data=JSON.parse(readFileSync(filename,'utf8'));
  const audits=data.audits||{};
  const lcp=audits['largest-contentful-paint']?.numericValue;
  const cls=audits['cumulative-layout-shift']?.numericValue;
  if(!Number.isFinite(lcp)||!Number.isFinite(cls)){
   failed=true;console.error(filename+': missing LCP or CLS metric');continue;
  }
  const passLcp=lcp<=2500,passCls=cls<=0.1;
  if(!passLcp||!passCls)failed=true;
  console.log([
   filename,
   'LCP '+Math.round(lcp)+' ms '+(passLcp?'PASS':'FAIL'),
   'CLS '+cls.toFixed(3)+' '+(passCls?'PASS':'FAIL'),
   'INP field data required'
  ].join(' | '));
 }catch(error){
  failed=true;console.error(filename+': '+error.message);
 }
}
if(failed)process.exitCode=1;
