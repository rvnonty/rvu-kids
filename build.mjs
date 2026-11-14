import {mkdir,copyFile,cp,rm,readFile,writeFile,readdir} from 'node:fs/promises';

await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});

for(const file of ['index.html','404.html','style.css','home-motion.css','app.js','home-motion.mjs','hero-loop.mjs','favicon.svg','robots.txt','_headers','CNAME','sitemap.xml'])
  await copyFile(file,`dist/${file}`);

for(const dir of ['assets','learn','preview','books','parents'])
  await cp(dir,`dist/${dir}`,{recursive:true});

const fontHints='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
async function optimizeHtml(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=dir+'/'+entry.name;
  if(entry.isDirectory()){await optimizeHtml(file);continue}
  if(!entry.isFile()||!entry.name.endsWith('.html'))continue;
  const original=await readFile(file,'utf8');
  let output=original.replace(/<!--[\s\S]*?-->/g,'');
  if(output.includes('fonts.googleapis.com/css2?')&&!output.includes('rel="preconnect"')){
   output=output.replace(/<head(?:\s[^>]*)?>/i,opening=>opening+'\n'+fontHints);
  }
  if(output!==original)await writeFile(file,output);
 }
}
await optimizeHtml('dist');

async function stripShippedComments(dir){
 for(const item of await readdir(dir,{withFileTypes:true})){
  const file=dir+'/'+item.name;
  if(item.isDirectory()){await stripShippedComments(file);continue}
  if(!item.isFile())continue;
  const isCss=item.name.endsWith('.css');
  const isLearningModule=file.endsWith('/learn/activities.mjs')||file.endsWith('/learn/activity-data.mjs');
  if(!isCss&&!isLearningModule)continue;
  const source=await readFile(file,'utf8');
  const stripped=source.replace(/\/\*[\s\S]*?\*\//g,'');
  if(stripped!==source)await writeFile(file,stripped);
 }
}
await stripShippedComments('dist');

console.log('Built RVU Kids static pages and optimized font connections.');
