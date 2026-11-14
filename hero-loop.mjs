const MEDIA_PATH='/assets/rvu-hero-loop.mp4';
const bookLink=document.querySelector('.hero-book-figure .book');
const hero=document.querySelector('.hero-art');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const saveData=Boolean(navigator.connection?.saveData);

if(bookLink&&hero&&!saveData&&!reducedMotion.matches){
 try{
  const video=document.createElement('video');
  video.className='hero-loop-video';
  video.muted=true;
  video.defaultMuted=true;
  video.autoplay=true;
  video.loop=true;
  video.playsInline=true;
  video.preload='metadata';
  video.poster='/assets/cover-480.webp';
  video.setAttribute('aria-hidden','true');
  video.setAttribute('tabindex','-1');
  video.setAttribute('disablepictureinpicture','');
  video.setAttribute('disableremoteplayback','');

  let visible=true,failed=false;
  const active=()=>!document.hidden&&visible&&!reducedMotion.matches&&!document.documentElement.classList.contains('motion-paused');
  const restorePoster=()=>{
   failed=true;
   hero.dataset.heroMedia='poster';
   bookLink.classList.remove('has-live-video');
   video.pause();
   video.removeAttribute('src');
   video.remove();
  };
  const sync=()=>{
   if(failed)return;
   if(active())video.play().catch(()=>{});
   else video.pause();
  };

  video.addEventListener('playing',()=>{
   if(active()){
    bookLink.classList.add('has-live-video');
    hero.dataset.heroMedia='video';
   }
  });
  video.addEventListener('error',restorePoster,{once:true});
  const webm=document.createElement('source');
  webm.src='/assets/rvu-hero-loop.webm';webm.type='video/webm';
  const mp4=document.createElement('source');
  mp4.src=MEDIA_PATH;mp4.type='video/mp4';
  video.append(webm,mp4);
  bookLink.append(video);
  video.load();
  if('IntersectionObserver' in window){
   const visibility=new IntersectionObserver(entries=>{
    visible=entries[0]?.isIntersecting??true;
    sync();
   },{threshold:.08});
   visibility.observe(hero);
  }
  const state=new MutationObserver(sync);
  state.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',sync);
  reducedMotion.addEventListener?.('change',sync);
  window.addEventListener('pagehide',()=>video.pause(),{once:true});
  sync();
 }catch{
  hero.dataset.heroMedia='poster';
 }
}
