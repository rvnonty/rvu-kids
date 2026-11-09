import {readdir,stat,readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
let count=0,total=0,largest=0,audio=0,images=0;
async function walk(directory){
  for(const e of await readdir(directory,{withFileTypes:true})){
    const p=join(directory,e.name);
    if(e.isDirectory())await walk(p);
    else if(e.isFile()){
      const bytes=(await stat(p)).size;count++;total+=bytes;largest=Math.max(largest,bytes);
      if(bytes>25*1024*1024)throw Error('Asset exceeds Cloudflare per-file limit: '+p);
      if(/assets\/audio\/(female|male)\/\d{3}\.mp3$/.test(p))audio++;
      if(/assets\/words\/[a-z-]+\.svg$/.test(p))images++;
    }
  }
}
await walk('dist');
if(count>20000||audio!==488||images!==101)throw Error('Asset count/limits violated: '+JSON.stringify({count,audio,images}));
const cfg=JSON.parse(await readFile('wrangler.static.jsonc','utf8'));
if(cfg.main||cfg.routes||cfg.assets.directory!=='./dist'||cfg.assets.not_found_handling!=='404-page')throw Error('Unsafe Cloudflare staging configuration');
for(const path of ['404.html','_headers','learn/words/index.html','assets/words/apple.svg','assets/audio/female/000.mp3','assets/audio/male/000.mp3']){
  if(!(await stat(resolve('dist',path)).catch(()=>null)))throw Error('Build output missing '+path);
}
console.log(JSON.stringify({result:'PASS',files:count,bytes:total,largest,audio,images}));
