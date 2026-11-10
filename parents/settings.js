'use strict';
(()=>{
 const root=document.getElementById('parent-guide');
 if(!root)return;
 try{
  localStorage.removeItem('rvu-story-progress-v1');
  localStorage.removeItem('rvu-star-album-enabled');
 }catch{}
 const copy={
  ar:{
   eyebrow:'دليل عام لكل أولياء الأمور',title:'تعلم مفتوح، من غير حسابات',
   intro:'كل طفل يقدر يفتح أي حرف أو موقف ويتعلم بالصور والصوت مباشرة. مفيش حسابات للأطفال، ولا نحفظ داخل الموقع سجل فتح الدروس أو نتائج الألعاب أو الإنجازات.',
   backToPlay:'افتح عالم التعلّم',letters:'حرف وصور ناطقة',exploreLetters:'استكشف الحروف',
   situations:'درس مواقف إنجليزية',exploreSituations:'استكشف المواقف',
   freeTitle:'مفتوح للجميع',freeDescription:'من غير تسجيل أو تقدّم محفوظ',start:'جرّب حرف A',
   settings:'التحكم في الصوت والحركة على جهازك',
   settingsNote:'الاختيارات دي تخص المتصفح اللي بتستخدمه فقط، ومش بتغيّر الموقع عند أي حد تاني.',
   speed:'سرعة النطق',speed70:'بطيء جدًا 0.70×',speed85:'بطيء 0.85×',
   speed100:'طبيعي 1.00×',speed115:'أسرع 1.15×',motion:'قلّل الحركة والمؤثرات',
   saved:'تم حفظ اختيارك على المتصفح ده فقط.'
  },
  en:{
   eyebrow:'A public guide for all parents',title:'Open learning, no accounts',
   intro:'Every child can open any letter or everyday situation and learn through pictures and recorded voices. There are no child accounts, and the site does not save lesson history, game results or achievements.',
   backToPlay:'Open the learning world',letters:'Letters and speaking pictures',exploreLetters:'Explore letters',
   situations:'Everyday English lessons',exploreSituations:'Explore situations',
   freeTitle:'Open to everyone',freeDescription:'No sign-up or saved lesson progress',start:'Try letter A',
   settings:'Audio and motion on your own device',
   settingsNote:'These preferences affect only this browser and never change the website for another visitor.',
   speed:'Pronunciation speed',speed70:'Very slow 0.70×',speed85:'Slow 0.85×',
   speed100:'Normal 1.00×',speed115:'Faster 1.15×',motion:'Reduce motion and effects',
   saved:'Preference saved on this browser only.'
  }
 };
 const speed=document.getElementById('parent-playback-speed');
 const motion=document.getElementById('parent-reduce-motion');
 const feedback=document.getElementById('parent-settings-feedback');
 const language=()=>document.documentElement.lang==='en'?'en':'ar';
 const t=key=>copy[language()][key];
 const read=key=>{try{return localStorage.getItem(key)}catch{return null}};
 const write=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
 const show=()=>{feedback.textContent=t('saved')};
 function translate(){
  root.querySelectorAll('[data-public]').forEach(element=>{
   const value=t(element.dataset.public);
   if(value)element.textContent=value;
  });
  if(feedback.textContent)show();
 }
 speed.value=['0.7','0.85','1','1.15'].includes(read('rvu-playback-speed'))?read('rvu-playback-speed'):'1';
 motion.checked=read('rvu-motion-off')==='true';
 speed.addEventListener('change',()=>{
  if(!['0.7','0.85','1','1.15'].includes(speed.value))return;
  write('rvu-playback-speed',speed.value);
  show();
 });
 motion.addEventListener('change',()=>{
  write('rvu-motion-off',String(motion.checked));
  document.documentElement.classList.toggle('rvu-motion-off',motion.checked);
  show();
 });
 document.documentElement.classList.toggle('rvu-motion-off',motion.checked);
 document.addEventListener('rvu:parent-language',translate);
 translate();
})();
