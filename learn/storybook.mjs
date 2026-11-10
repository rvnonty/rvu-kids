/* RVU Kids Storybook Adventure — learning map, characters, and progress. */
(() => {
 'use strict';
 const curriculum=window.RVU_CURRICULUM;
 if(!curriculum)return;
 const isAr=document.documentElement.lang!=='en';
 const text=(ar,en)=>isAr?ar:en;
 const storeKey='rvu-story-progress-v1';
 const types={alphabet:curriculum.alphabet,sentences:curriculum.sentences};
 let memory={visited:{alphabet:[],sentences:[]},completed:{alphabet:[],sentences:[]}};
 function readProgress(){
  try{
   const saved=JSON.parse(localStorage.getItem(storeKey)||'null');
   if(!saved||typeof saved!=='object')return memory;
   for(const group of ['visited','completed']){
    if(!saved[group]||typeof saved[group]!=='object')saved[group]={};
    for(const type of ['alphabet','sentences']){
     const valid=new Set(types[type].map(item=>item.id));
     saved[group][type]=Array.isArray(saved[group][type])?
      [...new Set(saved[group][type].filter(id=>valid.has(id)))]:[];
    }
   }
   memory=saved;return saved;
  }catch{return memory}
 }
 function saveProgress(type,id,group){
  if(!types[type]||!types[type].some(item=>item.id===id))return;
  const data=readProgress();
  if(!data[group][type].includes(id))data[group][type].push(id);
  if(group==='completed'&&!data.visited[type].includes(id))data.visited[type].push(id);
  if(group==='visited')data.lastVisited={type,id};
  memory=data;
  try{localStorage.setItem(storeKey,JSON.stringify(data))}catch{}
 }
 function node(tag,className,textContent){
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(textContent!==undefined)element.textContent=textContent;
  return element;
 }
 function href(type,id){return '/learn/'+type+'/'+id+'/'}
 function progressStats(type){
  const data=readProgress();
  return {visited:new Set(data.visited[type]),completed:new Set(data.completed[type])};
 }
 function renderAlphabetMap(){
  const root=document.getElementById('letter-grid');
  if(!root||root.classList.contains('storybook-map'))return;
  const stats=progressStats('alphabet'),letters=types.alphabet;
  root.classList.add('storybook-map');
  root.setAttribute('role','group');
  root.setAttribute('aria-label',text('خريطة مغامرة الحروف من A إلى Z','Alphabet adventure map from A to Z'));
  const intro=node('div','storybook-map-intro');
  const copy=node('div','storybook-map-copy');
  copy.append(
   node('span','storybook-kicker',text('رحلة من 26 محطة','26 stops to explore')),
   node('h3','storybook-map-title',text('كل حرف محطة جديدة','Every letter is a new adventure')),
   node('p','storybook-map-description',text('اختار محطة، اتفرج على الصورة، اسمع الكلمة، وارجع في أي وقت تكمل رحلتك.','Choose a stop, explore its illustration, hear the word, and continue anytime.'))
  );
  const progress=node('div','storybook-map-progress');
  const count=node('strong','storybook-progress-number',stats.completed.size+' / '+letters.length);
  const meter=node('div','storybook-progress-track');
  meter.setAttribute('role','progressbar');
  meter.setAttribute('aria-label',text('الحروف المكتملة','Completed letters'));
  meter.setAttribute('aria-valuemin','0');
  meter.setAttribute('aria-valuemax',String(letters.length));
  meter.setAttribute('aria-valuenow',String(stats.completed.size));
  const fill=node('span','storybook-progress-fill');
  fill.style.width=(100*stats.completed.size/letters.length)+'%';
  meter.append(fill);
  const pending=letters.find(item=>!stats.completed.has(item.id));
  const resume=node('a','storybook-resume',pending?text('ابدأ أو كمّل الرحلة','Start or continue'):text('راجع الحروف من الأول','Review the letters'));
  resume.href=href('alphabet',(pending||letters[0]).id);
  progress.append(node('span','storybook-progress-label',text('محطات خلصتها','Stations completed')),count,meter,resume);
  intro.append(copy,progress);
  root.before(intro);
  root.replaceChildren();
  letters.forEach((lesson,index)=>{
   const visited=stats.visited.has(lesson.id),completed=stats.completed.has(lesson.id);
   const station=node('a','storybook-station');
   station.href=href('alphabet',lesson.id);
   station.dataset.status=completed?'completed':visited?'visited':'new';
   station.style.setProperty('--station-accent',['#f5dfae','#dff2e7','#f5cfbf','#d9edf6'][index%4]);
   const indexLabel=node('span','storybook-station-index',String(index+1).padStart(2,'0'));
   const letter=node('strong','storybook-station-letter',lesson.letter);
   const visual=node('span','storybook-station-picture');
   const word=lesson.words[0]||lesson.letter;
   const image=node('img','storybook-station-image');
   image.src='/assets/words/'+word.replaceAll(' ','-')+'.svg';
   image.alt='';
   image.width=112;image.height=112;image.loading='lazy';image.decoding='async';
   image.addEventListener('error',()=>{visual.replaceChildren(node('span','storybook-picture-fallback',lesson.letter.toLowerCase()))},{once:true});
   visual.append(image);
   const name=node('span','storybook-station-word',word);
   name.lang='en';name.dir='ltr';
   const caption=node('span','storybook-station-status',completed?text('مكتملة','Completed'):visited?text('تمت زيارتها','Visited'):text('اكتشف المحطة','Discover'));
   station.setAttribute('aria-label',text('محطة ','Stop ')+(index+1)+' - '+lesson.letter+' - '+word+' - '+caption.textContent);
   station.append(indexLabel,letter,visual,name,caption);
   root.append(station);
  });
  drawMapRoute(root);
 }
 function drawMapRoute(root){
  if(typeof window.requestAnimationFrame!=='function'||typeof document.createElementNS!=='function')return;
  const namespace='http://www.w3.org/2000/svg';
  const route=document.createElementNS(namespace,'svg');
  route.setAttribute('class','storybook-route-line');
  route.setAttribute('aria-hidden','true');
  const line=document.createElementNS(namespace,'path');
  route.append(line);
  root.prepend(route);
  const draw=()=>{
   const stations=[...root.querySelectorAll('.storybook-station')];
   if(!root.clientWidth||!root.clientHeight||stations.length<2)return;
   route.setAttribute('viewBox','0 0 '+root.clientWidth+' '+root.clientHeight);
   const coordinates=stations.map(station=>[
    station.offsetLeft+station.offsetWidth/2,
    station.offsetTop+station.offsetHeight/2
   ]);
   const path=coordinates.map((pair,i)=>(i===0?'M':'L')+pair[0]+' '+pair[1]).join(' ');
   line.setAttribute('d',path);
  };
  window.requestAnimationFrame(draw);
  if(typeof window.ResizeObserver==='function'){
   const observer=new window.ResizeObserver(draw);
   observer.observe(root);
  }else{
   window.addEventListener('resize',()=>window.requestAnimationFrame(draw),{passive:true});
  }
 }
 const messages={
  welcome:[text('أهلًا بيك في عالم الحروف! اختار أول محطة ونبدأ الحكاية.','Welcome to the alphabet world! Choose your first stop.'),'boy'],
  explain:[text('بص على الصورة، اسمع الكلمة بسرعة تناسبك، وكررها براحتك.','Look at the picture, listen at your own speed, and say the word again.'),'girl'],
  success:[text('أحسنت! إجابة صحيحة. جرّب كمان سؤال أو كمّل الرحلة.','Well done! That is correct. Try another question or keep exploring.'),'lizard'],
  retry:[text('جرب مرة تانية. تقدر تسمع الكلمة بهدوء قبل ما تختار.','Try again. Listen carefully to the word before choosing.'),'girl'],
  point:[text('بص للمشهد واسمع الجملة، وبعدين اختار الصورة المناسبة.','Look at the scene, hear the sentence, then choose a picture.'),'girl'],
  finish:[text('خلصت المحطة! تقدر تكمل اللي بعدها أو تراجع اللي اتعلمته.','Station complete! Move to the next stop or review what you learned.'),'boy']
 };
 let guide=null;
 function setGuideMood(mood){
  if(!guide||!messages[mood])return;
  const [message,character]=messages[mood];
  guide.dataset.mood=mood;
  const face=guide.querySelector('.storybook-guide-face');
  if(face){
   face.className='storybook-guide-face character-portrait '+character;
   void face.offsetWidth;
   face.classList.add('guide-moment');
  }
  const line=guide.querySelector('.storybook-guide-text');
  if(line&&line.textContent!==message)line.textContent=message;
 }
 function makeGuide(mood){
  const panel=node('aside','storybook-guide');
  panel.setAttribute('aria-label',text('مرشد مغامرة RVU Kids','RVU Kids story guide'));
  const portrait=node('span','storybook-guide-face character-portrait boy');
  portrait.setAttribute('aria-hidden','true');
  const bubble=node('div','storybook-guide-bubble');
  bubble.append(node('strong','storybook-guide-title',text('صحابك في المغامرة','Your storybook friends')));
  const message=node('p','storybook-guide-text');
  message.setAttribute('role','status');
  message.setAttribute('aria-live','polite');
  bubble.append(message);
  panel.append(portrait,bubble);
  guide=panel;
  setGuideMood(mood);
  return panel;
 }
 function mountGuide(){
  const page=document.body.dataset.page;
  if(page==='hub'||page==='alphabet-index'){
   const hero=document.querySelector('.hero');
   if(hero)hero.append(makeGuide('welcome'));
  }else if(page==='lesson'){
   const card=document.querySelector('.lesson-card');
   if(card){
    const audio=card.querySelector('.voice-picker');
    const component=makeGuide('explain');
    if(audio)audio.after(component);else card.prepend(component);
   }else{
    const hero=document.querySelector('.hero');
    if(hero)hero.append(makeGuide('welcome'));
   }
  }else if(page==='words'){
   const card=document.getElementById('word-library');
   if(card)card.insertBefore(makeGuide('explain'),card.querySelector('.spread-picker'));
  }
 }
 function markCurrentVisit(){
  const parts=location.pathname.split('/').filter(Boolean);
  if(parts[0]!=='learn'||!['alphabet','sentences'].includes(parts[1])||!parts[2])return null;
  const type=parts[1],id=parts[2];
  if(!types[type].some(item=>item.id===id))return null;
  saveProgress(type,id,'visited');
  return {type,id};
 }
 function addLessonCompletion(info){
  if(!info||document.body.dataset.page!=='lesson')return;
  const card=document.querySelector('.lesson-card');
  if(!card)return;
  const entry=types[info.type],index=entry.findIndex(item=>item.id===info.id);
  if(index<0)return;
  const next=entry[index+1],completed=progressStats(info.type).completed.has(info.id);
  const section=node('section','storybook-finish');
  section.setAttribute('aria-label',text('تقدم الدرس','Lesson progress'));
  const content=node('div','storybook-finish-content');
  content.append(
   node('span','storybook-kicker',text('رحلتك التعليمية','Your learning journey')),
   node('h2','storybook-finish-title',completed?text('المحطة مكتملة','Station completed'):text('خلصت الدرس؟','Finished the lesson?')),
   node('p','storybook-finish-detail',text('لما تخلص الاستماع والتدريب، سجّل المحطة كمكتملة.','After listening and practicing, mark this station as completed.'))
  );
  const buttons=node('div','storybook-finish-actions');
  const done=node('button','storybook-finish-button',completed?text('تم إنجاز المحطة','Station complete'):text('أنهيت المحطة','Mark as completed'));
  done.type='button';done.disabled=completed;
  done.addEventListener('click',()=>{
   saveProgress(info.type,info.id,'completed');
   done.disabled=true;done.textContent=text('تم إنجاز المحطة','Station complete');
   section.classList.add('is-complete');
   content.querySelector('.storybook-finish-title').textContent=text('المحطة مكتملة','Station completed');
   setGuideMood('finish');
   document.dispatchEvent(new CustomEvent('rvu:lesson-completed',{detail:{type:info.type,id:info.id}}));
  });
  buttons.append(done);
  if(next){
   const onward=node('a','storybook-next-link',text('المحطة التالية','Next station')+' '+(info.type==='alphabet'?next.letter:''));
   onward.href=href(info.type,next.id);
   buttons.append(onward);
  }
  section.append(content,buttons);
  if(completed)section.classList.add('is-complete');
  const nav=card.querySelector('.lesson-nav');
  if(nav)nav.before(section);else card.append(section);
 }
 const current=markCurrentVisit();
 renderAlphabetMap();
 mountGuide();
 addLessonCompletion(current);
 document.addEventListener('rvu:activity-feedback',event=>{
  if(event.detail&&typeof event.detail.ok==='boolean')setGuideMood(event.detail.ok?'success':'retry');
 });
 document.addEventListener('rvu:story-stage',event=>{
  if(event.detail?.state==='point')setGuideMood('point');
 });
})();
