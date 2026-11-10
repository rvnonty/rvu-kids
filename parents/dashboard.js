'use strict';
/* Parent dashboard: on-device progress only, with no accounts or tracking. */
(()=>{
 const curriculum=window.RVU_CURRICULUM;
 const root=document.getElementById('parent-dashboard');
 if(!root||!curriculum)return;
 const progressKey='rvu-story-progress-v1';
 const labels={
  ar:{eyebrow:'مساحة الأهل · بيانات على جهازك',title:'تابعوا التقدّم بهدوء',intro:'هنا تشوفوا الدروس التي تمت زيارتها أو إكمالها. البيانات محفوظة على هذا الجهاز فقط، ومش تقييم لمستوى الطفل.',
   backToPlay:'ارجع لمغامرة الطفل',visited:'حروف اتفتحت',letters:'حروف مكتملة',sentences:'مواقف مكتملة',stars:'نجوم مكتسبة',
   nextHeading:'نكمل منين؟',nextLink:'افتح الدرس التالي',lastHeading:'آخر درس اتفتح',localNote:'التقدّم محلي داخل المتصفح؛ مش متزامن بين الأجهزة.',
   settings:'إعدادات التعلّم',speed:'سرعة النطق الافتراضية',speed70:'بطيء جدًا · 0.70×',speed85:'بطيء · 0.85×',speed100:'طبيعي · 1.00×',speed115:'أسرع · 1.15×',
   motion:'قلّل الحركة والمؤثرات البصرية',album:'تشغيل ألبوم النجوم الاختياري',reset:'ابدأ التقدّم من جديد',
   buyEyebrow:'للأهل فقط',buyTitle:'الكتاب الورقي والطلب',buyText:'النسخة المطبوعة تضم 96 صفحة. السعر الحالي 200 جنيه مصري، والشحن حسب المحافظة. الشراء منفصل عن ألعاب الطفل.',
   preview:'شوف الصفحات الخمس المختارة',order:'اذهب لصفحة طلب الكتاب',
   nextLetter:'الحرف المقترح التالي: ',nextUnit:'الموقف المقترح التالي: ',allDone:'كل الدروس مكتملة! راجعوا أي درس تحبوه.',lastNone:'لسه ما اتفتحش أي درس على الجهاز ده.',
   lastLetter:'آخر حرف اتفتح: ',lastUnit:'آخر موقف اتفتح: ',resetConfirm:'تمسح علامات الزيارة والإنجاز لكل الدروس من الجهاز ده؟ الإجراء مش ممكن التراجع عنه.',
   resetDone:'تم تصفير التقدّم المحلي، من غير تغيير إعدادات الصوت أو الحركة.',settingsSaved:'تم حفظ الإعداد على الجهاز.',lastOpened:'آخر درس اتفتح: '},
  en:{eyebrow:'Parent space · On-device progress',title:'Follow progress without pressure',intro:'See visited and completed lessons. Progress is stored only in this browser and is not a measure of your child’s ability.',
   backToPlay:'Return to the child adventure',visited:'Letters visited',letters:'Letters completed',sentences:'Situations completed',stars:'Stars earned',
   nextHeading:'What comes next?',nextLink:'Open the next lesson',lastHeading:'Last opened lesson',localNote:'Progress stays on this device; it does not sync across devices.',
   settings:'Learning settings',speed:'Default pronunciation speed',speed70:'Very slow · 0.70×',speed85:'Slow · 0.85×',speed100:'Normal · 1.00×',speed115:'Faster · 1.15×',
   motion:'Reduce motion and visual effects',album:'Enable the optional star-sticker album',reset:'Start progress over',
   buyEyebrow:'For parents only',buyTitle:'Printed book and ordering',buyText:'The printed book has 96 pages. Current price: EGP 200, with shipping dependent on governorate. Ordering is separate from children’s games.',
   preview:'See five selected preview pages',order:'Go to the book order page',
   nextLetter:'Suggested next letter: ',nextUnit:'Suggested next situation: ',allDone:'All lessons completed! Review anything you like.',lastNone:'No lesson has been opened on this device yet.',
   lastLetter:'Last opened letter: ',lastUnit:'Last opened situation: ',resetConfirm:'Clear all visited and completed lessons on this device? This cannot be undone.',
   resetDone:'Local progress was cleared; voice and motion settings remain unchanged.',settingsSaved:'Setting saved on this device.',lastOpened:'Last opened lesson: '}
 };
 const $=id=>document.getElementById(id);
 const getLang=()=>document.documentElement.lang==='en'?'en':'ar';
 const tx=key=>labels[getLang()][key];
 const read=(key)=>{try{return localStorage.getItem(key)}catch{return null}};
 const write=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
 const progress=()=>{
  try{
   const s=JSON.parse(read(progressKey)||'null')||{};
   const checked=(kind,type)=>new Set((Array.isArray(s?.[kind]?.[type])?s[kind][type]:[]).filter(
    id=>curriculum[type].some(lesson=>lesson.id===id)));
   return {visited:{alphabet:checked('visited','alphabet'),sentences:checked('visited','sentences')},
    completed:{alphabet:checked('completed','alphabet'),sentences:checked('completed','sentences')},lastVisited:s.lastVisited||null};
  }catch{return {visited:{alphabet:new Set(),sentences:new Set()},completed:{alphabet:new Set(),sentences:new Set()},lastVisited:null}}
 };
 function lessonHref(type,id){return '/learn/'+type+'/'+id+'/'}
 function lessonLabel(type,id){
  const lesson=curriculum[type].find(x=>x.id===id);
  if(!lesson)return id;
  return type==='alphabet'?lesson.letter:(getLang()==='ar'?(lesson.titleAr||lesson.title):lesson.title);
 }
 function render(){
  const state=progress(),al=curriculum.alphabet.length,su=curriculum.sentences.length;
  $('parent-letter-visited').textContent=state.visited.alphabet.size+' / '+al;
  $('parent-letter-completed').textContent=state.completed.alphabet.size+' / '+al;
  $('parent-unit-completed').textContent=state.completed.sentences.size+' / '+su;
  $('parent-stars-count').textContent=String(state.completed.alphabet.size+state.completed.sentences.size);
  $('parent-letter-meter').style.width=(100*state.completed.alphabet.size/al)+'%';
  $('parent-unit-meter').style.width=(100*state.completed.sentences.size/su)+'%';
  const nextLetter=curriculum.alphabet.find(x=>!state.completed.alphabet.has(x.id));
  const nextUnit=curriculum.sentences.find(x=>!state.completed.sentences.has(x.id));
  const next=nextLetter?['alphabet',nextLetter]:nextUnit?['sentences',nextUnit]:null;
  $('parent-next-description').textContent=next?(next[0]==='alphabet'?tx('nextLetter'):tx('nextUnit'))+
   lessonLabel(next[0],next[1].id):tx('allDone');
  const link=$('parent-next-link');
  link.href=next?lessonHref(next[0],next[1].id):'/learn/';
  link.textContent=tx('nextLink');
  let last=state.lastVisited;
  if(!last||!curriculum[last.type]?.some(x=>x.id===last.id)){
   const firstUnit=curriculum.sentences.find(x=>state.visited.sentences.has(x.id));
   const firstLetter=curriculum.alphabet.find(x=>state.visited.alphabet.has(x.id));
   last=firstUnit?{type:'sentences',id:firstUnit.id}:firstLetter?{type:'alphabet',id:firstLetter.id}:null;
  }
  $('parent-last-description').textContent=last?(last.type==='alphabet'?tx('lastLetter'):tx('lastUnit'))+lessonLabel(last.type,last.id):tx('lastNone');
 }
 function settings(){
  const chosen=Number(read('rvu-playback-speed')||'1');
  $('parent-playback-speed').value=[0.7,0.85,1,1.15].includes(chosen)?String(chosen):'1';
  $('parent-reduce-motion').checked=read('rvu-motion-off')==='true';
  $('parent-sticker-album').checked=read('rvu-star-album-enabled')==='true';
 }
 function translate(){
  document.querySelectorAll('[data-parent]').forEach(element=>{
   if(labels[getLang()][element.dataset.parent])element.textContent=tx(element.dataset.parent);
  });
  render();
 }
 function notice(key){$('parent-settings-feedback').textContent=tx(key)}
 $('parent-playback-speed').addEventListener('change',event=>{
  const val=Number(event.target.value);
  if(![0.7,0.85,1,1.15].includes(val))return;
  write('rvu-playback-speed',String(val));notice('settingsSaved');
 });
 $('parent-reduce-motion').addEventListener('change',event=>{
  const off=event.target.checked;write('rvu-motion-off',String(off));
  document.documentElement.classList.toggle('rvu-motion-off',off);notice('settingsSaved');
 });
 $('parent-sticker-album').addEventListener('change',event=>{
  write('rvu-star-album-enabled',String(event.target.checked));notice('settingsSaved');
 });
 $('parent-reset-progress').addEventListener('click',()=>{
  if(!window.confirm(tx('resetConfirm')))return;
  try{localStorage.removeItem(progressKey)}catch{}
  render();notice('resetDone');
 });
 document.addEventListener('rvu:parent-language',translate);
 window.addEventListener('storage',event=>{
  if([progressKey,'rvu-playback-speed','rvu-motion-off','rvu-star-album-enabled'].includes(event.key)){
   settings();render();
  }
 });
 document.documentElement.classList.toggle('rvu-motion-off',read('rvu-motion-off')==='true');
 settings();translate();
})();
