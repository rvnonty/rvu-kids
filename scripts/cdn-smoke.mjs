import {performance} from 'node:perf_hooks';

const root=(process.env.RVU_BASE_URL||'https://rvu-kids.company').replace(/\/$/,'');
const urls=['/','/learn/','/learn/alphabet/','/preview/','/assets/cover.webp','/assets/audio/male/031.mp3','/assets/audio/female/031.mp3'];
const tasks=Array.from({length:4},()=>urls).flat();
const concurrency=5;
const results=[];
let next=0;
async function worker(){
 while(next<tasks.length){
  const path=tasks[next++];
  const start=performance.now();
  try{
   const response=await fetch(root+path,{signal:AbortSignal.timeout(12000),redirect:'follow'});
   const buffer=await response.arrayBuffer();
   const ms=Math.round(performance.now()-start);
   results.push({path,status:response.status,bytes:buffer.byteLength,ms});
   if(response.status!==200||buffer.byteLength<100)throw Error('Unexpected HTTP status or empty asset');
  }catch(error){
   results.push({path,error:String(error),ms:Math.round(performance.now()-start)});
  }
 }
}
await Promise.all(Array.from({length:concurrency},worker));
const failures=results.filter(x=>x.error||x.status!==200||x.bytes<100);
const durations=results.map(x=>x.ms).sort((a,b)=>a-b);
const pct=p=>durations[Math.min(durations.length-1,Math.ceil(p*durations.length)-1)];
const summary={
 testedAt:new Date().toISOString(),
 mode:'bounded availability smoke only; not a capacity or stress certification',
 domain:root,requests:results.length,concurrency,failures:failures.length,
 p50_ms:pct(.5),p95_ms:pct(.95),worst_ms:pct(1),failed:failures.slice(0,8)
};
console.log(JSON.stringify(summary,null,2));
if(failures.length)process.exitCode=1;
