/* Parent-opted beginner offline pack. Deliberately does not cache the book PDF
   or the two specifically flagged Fish/Fork clips. Change version when approved audio changes. */
const CACHE='rvu-learning-a-b-v1';
const PREVIOUS_PREFIX='rvu-learning-a-b-';
const WORDS=['apple','ant','airplane','alligator','ball','bear','banana','boat'];
const FILES=[
 '/learn/','/learn/alphabet/','/learn/alphabet/a/','/learn/alphabet/b/',
 '/learn/content.js','/learn/learn.js','/learn/learn.css',
 '/learn/storybook.mjs','/learn/next-adventures.mjs',
 '/learn/scene-data.mjs','/learn/activities.mjs','/learn/activity-data.mjs',
 '/learn/activities.css','/learn/next-adventures.css',
 '/learn/story-journey.mjs','/learn/story-moments.mjs',
 '/learn/story-journey.css','/assets/cover.webp',
 ...WORDS.map(word=>'/assets/words/'+word+'.svg'),
 ...['female','male'].flatMap(voice=>
   Array.from({length:14},(_,index)=>
    '/assets/audio/'+voice+'/'+String(index).padStart(3,'0')+'.mp3'))
];
const ALLOWED=new Set(FILES);
self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const key of await caches.keys())
   if(key.startsWith(PREVIOUS_PREFIX)&&key!==CACHE)await caches.delete(key);
  await self.clients.claim();
 })());
});
async function savePack(){
 const cache=await caches.open(CACHE);
 const errors=[];
 let saved=0;
 for(const path of FILES){
  try{
   const response=await fetch(path,{cache:'reload'});
   if(!response.ok||response.type==='opaque')throw new Error('HTTP '+response.status);
   await cache.put(path,response.clone());
   saved++;
  }catch{errors.push(path)}
 }
 return {ok:errors.length===0,saved,total:FILES.length,failures:errors.length};
}
self.addEventListener('message',event=>{
 if(!['SAVE_BEGINNER_PACK','CLEAR_BEGINNER_PACK'].includes(event.data?.type))return;
 const port=event.ports?.[0];
 event.waitUntil((async()=>{
  let result;
  try{
   result=event.data.type==='SAVE_BEGINNER_PACK'?
    await savePack():{ok:true,removed:await caches.delete(CACHE),cleared:true};
  }catch(error){result={ok:false,error:String(error.message||error)}}
  port?.postMessage(result);
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(request.mode==='navigate'&&url.pathname.startsWith('/learn/')){
  event.respondWith((async()=>{
   try{const network=await fetch(request);if(network.ok)return network}catch{}
   return (await caches.match(request,{ignoreSearch:true}))||Response.error();
  })());
  return;
 }
 if(!ALLOWED.has(url.pathname))return;
 event.respondWith((async()=>{
  const cached=await caches.match(request,{ignoreSearch:true});
  return cached||fetch(request);
 })());
});
