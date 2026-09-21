import {mkdir,copyFile,cp,rm} from 'node:fs/promises';

await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});

for(const file of ['index.html','style.css','app.js','favicon.svg','robots.txt','_headers','CNAME','sitemap.xml'])
  await copyFile(file,`dist/${file}`);

for(const dir of ['assets','learn','preview','books'])
  await cp(dir,`dist/${dir}`,{recursive:true});

console.log('Built full RVU Kids site: storefront, learning hub, preview and product pages. Private server code, tests and unpublished book PDF excluded.');
