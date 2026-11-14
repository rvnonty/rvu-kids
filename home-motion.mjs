export const MOTION_SCENES = [
 {id:'hero',selector:'.hero',ar:'أهلًا! يلا نبدأ حكايتنا!',en:'Hello! Our adventure starts here!',actionAr:'اطلب الكتاب',actionEn:'Order the book',href:'#order'},
 {id:'listen',selector:'#listen',ar:'اسمع… وردّد معايا!',en:'Listen… and say it with me!',actionAr:'جرّب النطق',actionEn:'Try the audio',href:'#listen'},
 {id:'together',selector:'#together',ar:'الكتاب والموقع بيكمّلوا بعض!',en:'Your book and website, together!',actionAr:'شوف المميزات',actionEn:'Discover more',href:'#why-different'},
 {id:'features',selector:'#why-different',ar:'كل صفحة فيها حكاية جديدة!',en:'A new story on every page!',actionAr:'شوف الصفحات',actionEn:'Look inside',href:'#preview'},
 {id:'play',selector:'#play',ar:'دورك! نسمع ونختار سوا؟',en:'Your turn! Shall we play?',actionAr:'يلا نلعب',actionEn:'Let’s play',href:'#play'},
 {id:'preview',selector:'#preview',ar:'بص على رسومات كتابنا!',en:'Take a peek inside our book!',actionAr:'قلّب الصفحات',actionEn:'Turn the pages',href:'/preview/'},
 {id:'faq',selector:'#faq',ar:'فيه سؤال؟ هتلاقي إجابته هنا!',en:'Questions? Let’s find out!',actionAr:'شوف الأسئلة',actionEn:'Your questions',href:'#faq'},
 {id:'order',selector:'#order',ar:'جاهزين لأول صفحة؟ الكتاب هنا!',en:'Ready for page one? This way!',actionAr:'اطلب الكتاب',actionEn:'Order the book',href:'#submit-order'}
];
export function chooseMotionScene(regions,point){
 if(!regions.length)return null;
 const containing=regions.find(region=>region.top<=point&&region.bottom>point);
 if(containing)return containing.id;
 return regions.reduce((best,region)=>{
  const distance=Math.min(Math.abs(region.top-point),Math.abs(region.bottom-point));
  return !best||distance<best.distance?{id:region.id,distance}:best;
 },null).id;
}
export function mountMotionWorld({getLanguage=()=>document.documentElement.lang}={}){
 const dock=document.querySelector('#motion-sidekick');
 if(!dock||dock.dataset.mounted==='true')return;
 dock.dataset.mounted='true';
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.querySelector('#motion-toggle'),message=dock.querySelector('.buddy-message'),go=dock.querySelector('.buddy-go');
 const panel=dock.querySelector('.buddy-panel'),minimize=dock.querySelector('.buddy-minimize'),restore=dock.querySelector('.buddy-restore');
 const homeParent=dock.parentNode,homeNext=dock.nextSibling;
 const heroSlot=matchMedia('(min-width:561px)').matches?document.querySelector('.hero-buddy-slot'):null;
 const slot=document.createElement('div');slot.className='order-buddy-slot';document.querySelector('.order-book')?.append(slot);
 const scenes=MOTION_SCENES.map(scene=>({...scene,element:document.querySelector(scene.selector)})).filter(scene=>scene.element);
 const visible=new Set(),running=new Set();let current='hero',previousY=scrollY,frame=0,paused=reduce.matches,hidden=false,pointerX=innerWidth/2,pointerY=innerHeight/2;
 try{paused=paused||localStorage.getItem('rvu-home-motion')==='off'}catch{}
 const english=()=>getLanguage()==='en';
 function labels(){
  const scene=scenes.find(s=>s.id===current)||scenes[0];if(!scene)return;
  message.textContent=english()?scene.en:scene.ar;go.innerHTML='<span>'+(english()?scene.actionEn:scene.actionAr)+'</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';go.href=scene.href;
  dock.setAttribute('aria-label',english()?'Your RVU Kids adventure companion':'رفيق مغامرة RVU Kids');
  dock.querySelector('.buddy-sprite').setAttribute('aria-label',english()?'Say hello to your animated companion':'سلّم على رفيقك المتحرك');
  minimize.setAttribute('aria-label',english()?'Minimize your companion':'تصغير رفيق الرحلة');restore.setAttribute('aria-label',english()?'Show your companion':'إظهار رفيق الرحلة');
  toggle?.setAttribute('aria-label',english()?(paused?'Play animations':'Pause animations'):(paused?'تشغيل الحركة':'إيقاف الحركة'));
 }
 function setPaused(value){
  paused=value;root.classList.toggle('motion-paused',paused);toggle?.setAttribute('aria-pressed',String(!paused));
  if(toggle)toggle.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
  for(const animation of running)if(paused)animation.pause();else animation.play();
  labels();
 }
 function animate(element,keyframes,options){
  if(paused||hidden||reduce.matches||!element.animate)return;
  const animation=element.animate(keyframes,options);running.add(animation);
  animation.finished.then(()=>running.delete(animation),()=>running.delete(animation));return animation;
 }
 function setScene(id,direction){
  if(id===current)return;current=id;dock.dataset.scene=id;dock.dataset.direction=direction;
  dock.classList.remove('scene-changing');void dock.offsetWidth;dock.classList.add('scene-changing');
  labels();
 }
 function placeDock(){
  if(current==='order'&&slot){
   if(dock.parentNode!==slot)slot.append(dock);
   dock.classList.add('at-order');dock.classList.remove('at-hero');
  }else if(current==='hero'&&heroSlot){
   if(dock.parentNode!==heroSlot)heroSlot.append(dock);
   dock.classList.add('at-hero');dock.classList.remove('at-order');
  }else{
   if(dock.parentNode!==homeParent)homeParent.insertBefore(dock,homeNext);
   dock.classList.remove('at-order','at-hero');
  }
 }
 function update(){
  frame=0;if(hidden)return;
  const height=innerHeight,total=Math.max(1,document.documentElement.scrollHeight-height);
  root.style.setProperty('--world-progress',String(Math.min(1,Math.max(0,scrollY/total))));
  const direction=scrollY<previousY?'up':'down';
  const regions=scenes.map(scene=>{const r=scene.element.getBoundingClientRect();return {id:scene.id,top:r.top,bottom:r.bottom}});
  setScene(chooseMotionScene(regions,height*.48)||'hero',direction);placeDock();previousY=scrollY;
  if(!paused){
   dock.style.setProperty('--look-x',Math.max(-4,Math.min(4,(pointerX-innerWidth/2)/120))+'px');
   dock.style.setProperty('--look-y',Math.max(-3,Math.min(3,(pointerY-height/2)/130))+'px');
   for(const element of visible){const r=element.getBoundingClientRect();element.style.setProperty('--scene-progress',String(Math.max(0,Math.min(1,(height-r.top)/(height+r.height)))))}
  }
 }
 function schedule(){if(!frame&&!hidden)frame=requestAnimationFrame(update)}
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   entry.target.classList.toggle('is-in-view',entry.isIntersecting);
   if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);
  }
  schedule();
 },{threshold:0,rootMargin:'60px 0px'});
 scenes.forEach((scene,index)=>{
  scene.element.classList.add('motion-scene');observer.observe(scene.element);
  for(let n=0;n<6;n++){
   const petal=document.createElement('span');petal.className='motion-petal';petal.setAttribute('aria-hidden','true');
   petal.style.cssText='--petal-x:'+([3,93,7,90,2,96][n])+'%;--petal-y:'+([13,23,68,79,45,51][n])+'%;--petal-color:'+(['#79d3b4','#f5b85c','#ee9a85','#7fcbe1'][((n+index)%4)])+';--petal-rotate:'+(n*37)+'deg;--petal-delay:'+(-n*.8)+'s;--petal-time:'+(6+n)+'s';
   scene.element.append(petal);
  }
 });
 const benefits=document.querySelector('.benefits');if(benefits){benefits.classList.add('motion-scene');observer.observe(benefits)}
 const revealObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   const now=performance.now(),last=Number(entry.target.dataset.lastReveal||0);if(now-last<1100)continue;
   entry.target.dataset.lastReveal=String(now);
   const from=scrollY<previousY?-36:46;
   animate(entry.target,[{opacity:.35,translate:'0 '+from+'px',rotate:'-1.5deg',scale:.96},{opacity:1,translate:'0 0',rotate:'0deg',scale:1}],{duration:900,easing:'cubic-bezier(.16,.85,.25,1)'});
  }
 },{threshold:.13});
 document.querySelectorAll('.listen-copy,.sound-lab,.connection-card,.feature-scene,.mini-game,.page-shortcut,.preview-card,.section-top,.celebrate-note').forEach(element=>revealObserver.observe(element));
 function burst(origin){
  if(paused||hidden)return;
  const r=origin.getBoundingClientRect();
  for(let n=0;n<16;n++){
   const particle=document.createElement('span');particle.className='motion-confetti';particle.setAttribute('aria-hidden','true');
   const angle=(n/16)*Math.PI*2,spread=55+(n%4)*19;
   particle.style.cssText='left:'+(r.left+r.width/2)+'px;top:'+(r.top+r.height/2)+'px;--confetti-color:'+(['#ffd34f','#14b8ac','#f27c64','#77b8f0'][n%4]);document.body.append(particle);
   const animation=animate(particle,[{translate:'0 0',rotate:'0deg',opacity:1,scale:1},{translate:Math.cos(angle)*spread+'px '+(Math.sin(angle)*spread-35)+'px',rotate:(n*47)+'deg',opacity:0,scale:.3}],{duration:1100+(n%3)*100,easing:'cubic-bezier(.15,.6,.3,1)'});
   if(animation)animation.finished.then(()=>particle.remove(),()=>particle.remove());else particle.remove();
  }
 }
 document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
  if(button.dataset.answer==='apple'){
   burst(button);dock.classList.add('is-cheering');
   animate(panel,[{translate:'0 0'},{translate:'0 -14px'},{translate:'0 0'}],{duration:1000,easing:'ease-in-out'});
   setTimeout(()=>dock.classList.remove('is-cheering'),3000);
  }
 }));
 const sprite=dock.querySelector('.buddy-sprite');
 sprite.setAttribute('role','button');sprite.tabIndex=0;
 sprite.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();sprite.click()}});
 sprite.addEventListener('click',()=>{
  dock.classList.remove('is-greeting');void dock.offsetWidth;dock.classList.add('is-greeting');burst(dock.querySelector('.buddy-sprite'));
 });
 minimize.addEventListener('click',()=>{dock.classList.add('is-collapsed');minimize.setAttribute('aria-expanded','false');restore.focus()});
 restore.addEventListener('click',()=>{dock.classList.remove('is-collapsed');minimize.setAttribute('aria-expanded','true');minimize.focus()});
 toggle?.addEventListener('click',()=>{setPaused(!paused);try{localStorage.setItem('rvu-home-motion',paused?'off':'on')}catch{}});
 reduce.addEventListener('change',event=>setPaused(event.matches));
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pointermove',event=>{pointerX=event.clientX;pointerY=event.clientY;schedule()},{passive:true});
 window.addEventListener('rvu:languagechange',labels);
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;root.classList.toggle('motion-sleep',hidden);if(hidden){cancelAnimationFrame(frame);frame=0;for(const a of running)a.pause()}else{if(!paused)for(const a of running)a.play();schedule()}});
 window.addEventListener('pageshow',schedule);setPaused(paused);labels();schedule();
}
