'use strict';
/* Parent-initiated limited offline storage; no caching until the button is pressed. */
(()=>{
 const section=document.getElementById('parent-offline');
 if(!section)return;
 const save=document.getElementById('parent-offline-save');
 const clear=document.getElementById('parent-offline-clear');
 const status=document.getElementById('parent-offline-status');
 let busy=false,state='initial',details=null;
 const language=()=>document.documentElement.lang==='en'?'en':'ar';
 const copy={
  ar:{
   title:'دروس يمكن حفظها بدون إنترنت',
   text:'اختياري للأهل: احفظ درسَي A وB فقط، مع صور الكلمات والتسجيلات المرتبطة بهما. لن يتم تحميل الكتاب كاملًا.',
   save:'حفظ الدرسين على الجهاز',clear:'حذف النسخة المحفوظة',
   initial:'يتطلب التحميل الأول اتصالًا بالإنترنت ومساحة تخزين متاحة.',
   saved:'الدروس جاهزة للاستخدام بدون إنترنت على هذا المتصفح.',
   pending:'جارٍ حفظ صور وتسجيلات درسَي A وB. لا تغلق الصفحة أثناء الحفظ.',
   unsupported:'المتصفح لا يدعم الحفظ بدون إنترنت، أو الموقع غير مفتوح عبر HTTPS.',
   incomplete:'اكتمل جزء من الحفظ، لكن بعض الملفات لم تتحمل. اتصل بالإنترنت وجرّب مرة ثانية.',
   deleted:'تم حذف الملفات المحفوظة من هذا المتصفح.',
   error:'تعذر الحفظ حاليًا. تأكد من الاتصال بالإنترنت والمساحة المتاحة.',
   savedCount:'تم حفظ ',of:' من ',items:' ملف.'
  },
  en:{
   title:'Optional offline lessons',
   text:'Parents can save only lessons A and B with matching word pictures and recorded audio. The full book is not downloaded.',
   save:'Save the two lessons',clear:'Remove saved lessons',
   initial:'First-time download requires an internet connection and available device storage.',
   saved:'The two lessons are ready offline in this browser.',
   pending:'Saving A and B pictures and audio. Keep this page open while files are saved.',
   unsupported:'Offline saving requires a supported browser and a secure HTTPS connection.',
   incomplete:'Some files could not be saved. Reconnect to the internet and retry.',
   deleted:'The stored lesson pack was removed from this browser.',
   error:'Could not save the lessons. Check the connection and available storage.',
   savedCount:'Saved ',of:' of ',items:' files.'
  }
 };
 const t=key=>copy[language()][key];
 const setState=(next,extra)=>{state=next;details=extra||null;render()};
 function render(){
  section.querySelector('h4').textContent=t('title');
  section.querySelector('div>p').textContent=t('text');
  save.textContent=t('save');clear.textContent=t('clear');
  save.disabled=clear.disabled=busy;
  let message=t(state);
  if(details?.saved!==undefined&&details?.total!==undefined)
   message+=' '+t('savedCount')+details.saved+t('of')+details.total+t('items');
  status.textContent=message;
 }
 async function serviceWorker(){
  if(!('serviceWorker' in navigator)||!window.isSecureContext)throw Error('unsupported');
  let registration=await navigator.serviceWorker.getRegistration('/learn/');
  if(!registration)registration=await navigator.serviceWorker.register('/learn/offline-sw.js',{scope:'/learn/'});
  let worker=registration.active||registration.installing||registration.waiting;
  if(!worker)throw Error('Service worker unavailable');
  if(worker.state==='activated')return worker;
  await new Promise((resolve,reject)=>{
   const watchdog=setTimeout(()=>reject(new Error('Worker activation timed out')),12000);
   const check=()=>{if(worker.state==='activated'){clearTimeout(watchdog);resolve()}};
   worker.addEventListener('statechange',check);
   check();
  });
  return registration.active||worker;
 }
 function message(worker,type){
  return new Promise((resolve,reject)=>{
   if(typeof MessageChannel==='undefined')return reject(new Error('MessageChannel unavailable'));
   const channel=new MessageChannel();
   const watchdog=setTimeout(()=>{channel.port1.close();reject(new Error('Offline request timed out'))},90000);
   channel.port1.onmessage=event=>{
    clearTimeout(watchdog);channel.port1.close();resolve(event.data||{ok:false});
   };
   worker.postMessage({type},[channel.port2]);
  });
 }
 async function execute(type){
  if(busy)return;
  busy=true;setState('pending');
  try{
   const worker=await serviceWorker();
   const result=await message(worker,type);
   if(type==='CLEAR_BEGINNER_PACK'){
    try{localStorage.removeItem('rvu-beginner-pack-ready')}catch{}
    setState(result.ok?'deleted':'error');return;
   }
   if(result.ok&&result.saved===result.total){
    try{localStorage.setItem('rvu-beginner-pack-ready','true')}catch{}
    setState('saved',result);
   }else{
    try{localStorage.removeItem('rvu-beginner-pack-ready')}catch{}
    setState('incomplete',result);
   }
  }catch(error){
   setState(error.message==='unsupported'?'unsupported':'error');
  }finally{busy=false;render()}
 }
 save.addEventListener('click',()=>execute('SAVE_BEGINNER_PACK'));
 clear.addEventListener('click',()=>execute('CLEAR_BEGINNER_PACK'));
 document.addEventListener('rvu:parent-language',render);
 try{if(localStorage.getItem('rvu-beginner-pack-ready')==='true')state='saved'}catch{}
 render();
})();
