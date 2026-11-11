/* RVU Kids Storybook Adventure — learning map, characters, and progress. */
(() => {
 'use strict';
 const curriculum=window.RVU_CURRICULUM;
 if(!curriculum)return;
 const isAr=document.documentElement.lang!=='en';
 const text=(ar,en)=>isAr?ar:en;
 const types={alphabet:curriculum.alphabet,sentences:curriculum.sentences};
 try{
  localStorage.removeItem('rvu-story-progress-v1');
  localStorage.removeItem('rvu-star-album-enabled');
 }catch{}
 function node(tag,className,textContent){
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(textContent!==undefined)element.textContent=textContent;
  return element;
 }
 function href(type,id){return '/learn/'+type+'/'+id+'/'}
 function renderAlphabetMap(){
  const root=document.getElementById('letter-grid');
  if(!root||root.dataset.storybookReady==='true')return;
  root.dataset.storybookReady='true';
  const letters=types.alphabet;
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
  const actions=node('div','storybook-map-actions');
  const begin=node('a','storybook-resume',text('ابدأ بحرف A','Start with A'));
  begin.href=href('alphabet',letters[0].id);
  actions.append(begin);
  intro.append(copy,actions);
  const previous=root.previousElementSibling;
  if(previous?.classList?.contains('storybook-map-intro'))previous.replaceChildren(...intro.children);
  else root.before(intro);
  const staticStops=[...root.querySelectorAll('.storybook-stop')];
  if(root.dataset.staticLetters==='true'&&staticStops.length===letters.length){
   staticStops.forEach((stop,index)=>{
    const lesson=letters[index],word=lesson.words[0]||lesson.letter;
    const station=stop.querySelector('.storybook-station');
    const status=stop.querySelector('.storybook-station-status');
    const listen=stop.querySelector('.storybook-station-listen');
    const label=text('اكتشف الحرف','Explore this letter');
    stop.dataset.status='explore';station.dataset.status='explore';
    status.textContent=label;
    station.setAttribute('aria-label',text('محطة ','Stop ')+(index+1)+' - '+lesson.letter+' - '+word+' - '+label);
    const playable=window.RVU_WORD_AUDIO?.available(lesson.id,word)===true;
    listen.disabled=!playable;
    listen.textContent=playable?text('اسمع','Listen'):text('الصوت قيد المراجعة','Audio under review');
    listen.setAttribute('aria-label',playable?
     text('اسمع نطق كلمة ','Hear the word ')+word:
     text('نطق كلمة ','Pronunciation for ')+word+text(' قيد المراجعة',' is being reviewed'));
    if(playable)listen.addEventListener('click',()=>{
     window.RVU_WORD_AUDIO.play(lesson.id,word);
     stop.classList.remove('is-listening');
     void stop.offsetWidth;
     stop.classList.add('is-listening');
    });
   });
   drawMapRoute(root);
   return;
  }
  root.replaceChildren();
  letters.forEach((lesson,index)=>{
   const stop=node('div','storybook-stop');
   stop.dataset.status='explore';
   stop.style.setProperty('--station-accent',['#f5dfae','#dff2e7','#f5cfbf','#d9edf6'][index%4]);
   const station=node('a','storybook-station');
   station.href=href('alphabet',lesson.id);
   station.dataset.status='explore';
   const indexLabel=node('span','storybook-station-index',String(index+1).padStart(2,'0'));
   const letter=node('strong','storybook-station-letter',lesson.letter);
   const visual=node('span','storybook-station-picture');
   const word=lesson.words[0]||lesson.letter;
   const image=node('img','storybook-station-image');
   image.src='/assets/words/'+word.replaceAll(' ','-')+'.svg';
   image.alt='';
   image.width=112;image.height=112;image.loading=index<6?'eager':'lazy';image.decoding='async';
   image.addEventListener('error',()=>{visual.replaceChildren(node('span','storybook-picture-fallback',lesson.letter.toLowerCase()))},{once:true});
   visual.append(image);
   const name=node('span','storybook-station-word',word);
   name.lang='en';name.dir='ltr';
   const caption=node('span','storybook-station-status',text('اكتشف الحرف','Explore this letter'));
   station.setAttribute('aria-label',text('محطة ','Stop ')+(index+1)+' - '+lesson.letter+' - '+word+' - '+caption.textContent);
   station.append(indexLabel,letter,visual,name,caption);
   const listen=node('button','storybook-station-listen',text('اسمع','Listen'));
   listen.type='button';
   const playable=window.RVU_WORD_AUDIO?.available(lesson.id,word)===true;
   listen.disabled=!playable;
   listen.setAttribute('aria-label',playable?
    text('اسمع نطق كلمة ','Hear the word ')+word:
    text('نطق كلمة ','Pronunciation for ')+word+text(' قيد المراجعة',' is being reviewed'));
   if(playable)listen.addEventListener('click',()=>{
    window.RVU_WORD_AUDIO.play(lesson.id,word);
    stop.classList.remove('is-listening');
    void stop.offsetWidth;
    stop.classList.add('is-listening');
   });
   if(!playable)listen.textContent=text('الصوت قيد المراجعة','Audio under review');
   stop.append(station,listen);
   root.append(stop);
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
   const stations=[...root.querySelectorAll('.storybook-stop')];
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
   if(hero){
    const existing=hero.querySelector('.storybook-guide');
    if(existing){
     guide=existing;
     guide.setAttribute('aria-label',text('مرشد مغامرة RVU Kids','RVU Kids story guide'));
     const title=guide.querySelector('.storybook-guide-title');
     if(title)title.textContent=text('صحابك في المغامرة','Your storybook friends');
     setGuideMood('welcome');
    }else hero.append(makeGuide('welcome'));
   }
  }else if(page==='lesson'){
   const card=document.querySelector('.lesson-card');
   if(card){
    const audio=card.querySelector('.voice-picker');
    const component=makeGuide('explain');
    if(audio)audio.after(component);else card.prepend(component);
   }else{
    const hero=document.querySelector('.hero');
    if(hero){
    const existing=hero.querySelector('.storybook-guide');
    if(existing){
     guide=existing;
     guide.setAttribute('aria-label',text('مرشد مغامرة RVU Kids','RVU Kids story guide'));
     const title=guide.querySelector('.storybook-guide-title');
     if(title)title.textContent=text('صحابك في المغامرة','Your storybook friends');
     setGuideMood('welcome');
    }else hero.append(makeGuide('welcome'));
   }
   }
  }else if(page==='words'){
   const card=document.getElementById('word-library');
   if(card)card.insertBefore(makeGuide('explain'),card.querySelector('.spread-picker'));
  }
 }
 function currentLesson(){
  const parts=location.pathname.split('/').filter(Boolean);
  if(parts[0]!=='learn'||!['alphabet','sentences'].includes(parts[1])||!parts[2])return null;
  const type=parts[1],id=parts[2];
  return types[type].some(item=>item.id===id)?{type,id}:null;
 }
 function mountNextLesson(info){
  if(!info||document.body.dataset.page!=='lesson')return;
  const card=document.querySelector('.lesson-card');
  if(!card)return;
  const lessons=types[info.type];
  const next=lessons[lessons.findIndex(item=>item.id===info.id)+1];
  const section=node('section','storybook-finish');
  section.setAttribute('aria-label',text('اكمل الاستكشاف','Continue exploring'));
  const content=node('div','storybook-finish-content');
  content.append(
   node('span','storybook-kicker',text('مغامرة مفتوحة للجميع','Open learning for everyone')),
   node('h2','storybook-finish-title',text('تجرب حرفًا جديدًا؟','Explore another lesson?')),
   node('p','storybook-finish-detail',text('كل درس متاح لأي طفل، من غير حساب ولا تسجيل إنجاز.','All lessons are available without an account or saved progress.'))
  );
  const actions=node('div','storybook-finish-actions');
  if(next){
   const onward=node('a','storybook-next-link',text('الدرس التالي','Next lesson')+' '+(info.type==='alphabet'?next.letter:''));
   onward.href=href(info.type,next.id);
   actions.append(onward);
  }
  const overview=node('a','storybook-next-link',text('اختار درس تاني','Choose another lesson'));
  overview.href=info.type==='alphabet'?'/learn/alphabet/':'/learn/sentences/';
  actions.append(overview);
  section.append(content,actions);
  const nav=card.querySelector('.lesson-nav');
  if(nav)nav.before(section);else card.append(section);
 }
 renderAlphabetMap();
 mountGuide();
 mountNextLesson(currentLesson());
 document.addEventListener('rvu:activity-feedback',event=>{
  if(event.detail&&typeof event.detail.ok==='boolean')setGuideMood(event.detail.ok?'success':'retry');
 });
 document.addEventListener('rvu:story-stage',event=>{
  if(event.detail?.state==='point')setGuideMood('point');
 });
})();
