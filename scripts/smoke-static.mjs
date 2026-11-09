import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,join,sep} from 'node:path';
import {performance} from 'node:perf_hooks';

const root=resolve('dist');
const server=createServer(async(request,response)=>{
  const pathname=new URL(request.url,'http://localhost').pathname;
  let filepath=resolve(root,'.'+decodeURIComponent(pathname));
  if(filepath!==root&&!filepath.startsWith(root+sep)){response.writeHead(400);response.end();return}
  if(!pathname.match(/\.[a-z0-9]+$/i))filepath=join(filepath,'index.html');
  try{
    const buffer=await readFile(filepath);
    response.writeHead(200,{'Content-Length':buffer.byteLength});
    response.end(buffer);
  }catch{
    response.writeHead(404);response.end('Not Found');
  }
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const paths=['/','/learn/','/learn/words/','/assets/words/apple.svg','/assets/audio/female/000.mp3','/assets/audio/male/000.mp3'];
const errors=[],times=[];
let next=0;
async function worker(){
  while(next<120){
    const i=next++;const path=paths[i%paths.length];const start=performance.now();
    try{
      const resp=await fetch(base+path,{signal:AbortSignal.timeout(5000)});
      const data=await resp.arrayBuffer();
      times.push(performance.now()-start);
      if(resp.status!==200||data.byteLength<100)errors.push({path,status:resp.status,bytes:data.byteLength});
    }catch(err){errors.push({path,error:String(err)})}
  }
}
try{await Promise.all(Array.from({length:20},()=>worker()))}
finally{await new Promise(resolve=>server.close(resolve))}
times.sort((a,b)=>a-b);
const p95=times[Math.ceil(times.length*.95)-1]||0;
console.log(JSON.stringify({scope:'local-only',requests:120,concurrency:20,failures:errors.length,p95ms:Math.round(p95)}));
if(errors.length||times.length!==120||p95>5000)throw Error('Local smoke test failed '+JSON.stringify(errors.slice(0,6)));
