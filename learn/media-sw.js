'use strict';
const CACHE_NAME='rvu-kids-media-v2';
const MAX_MEDIA_FILES=640;
const MEDIA_PATH=/^\/assets\/(?:audio\/(?:female|male)\/\d{3}\.mp3|words\/[a-z0-9-]+\.svg|(?:cover|letter-a|practice-a|feelings|letter-m)\.webp)$/;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const names=await caches.keys();
 await Promise.all(names.filter(name=>name.startsWith('rvu-kids-media-')&&name!==CACHE_NAME).map(name=>caches.delete(name)));
 await self.clients.claim();
})()));
async function respondToRange(response,range){
 if(!range||response.status!==200)return response;
 const match=/^bytes=(\d*)-(\d*)$/.exec(range.trim());
 if(!match)return response;
 const body=await response.arrayBuffer(),size=body.byteLength;
 const suffix=!match[1]&&match[2]?Number(match[2]):null;
 let start=suffix!==null?Math.max(0,size-suffix):Number(match[1]||0);
 let end=suffix!==null?size-1:match[2]?Math.min(Number(match[2]),size-1):size-1;
 if(!size||start>=size||start>end)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
 const headers=new Headers(response.headers);
 headers.set('Content-Range',`bytes ${start}-${end}/${size}`);
 headers.set('Content-Length',String(end-start+1));
 headers.set('Accept-Ranges','bytes');
 headers.delete('Content-Encoding');
 return new Response(body.slice(start,end+1),{status:206,statusText:'Partial Content',headers});
}
async function mediaResponse(request,url){
 const key=new Request(url.origin+url.pathname,{credentials:'same-origin'});
 const range=request.headers.get('range');
 try{
  const cache=await caches.open(CACHE_NAME);
  const saved=await cache.match(key);
  if(saved)return respondToRange(saved,range);
  const response=await fetch(key,{cache:'reload'});
  if(!response.ok||response.status!==200)return response;
  try{
   await cache.put(key,response.clone());
   const keys=await cache.keys();
   if(keys.length>MAX_MEDIA_FILES)await Promise.all(keys.slice(0,keys.length-MAX_MEDIA_FILES).map(old=>cache.delete(old)));
  }catch{}
  return respondToRange(response,range);
 }catch{return fetch(request)}
}
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||!MEDIA_PATH.test(url.pathname))return;
 event.respondWith(mediaResponse(request,url));
});
