import {mkdir,copyFile,cp,rm} from 'node:fs/promises';

await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});

for(const file of ['index.html','style.css','app.js','favicon.svg','robots.txt','_headers','CNAME','sitemap.xml'])
  await copyFile(file,`dist/${file}`);

for(const dir of ['assets','learn','preview','books','parents'])
  await cp(dir,`dist/${dir}`,{recursive:true});

console.log('Built RVU Kids storefront, lessons, and separate draft audio review studio. Owner-approved dual-voice audio is linked in child-facing lessons.');
