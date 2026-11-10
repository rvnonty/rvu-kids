import {getPictureCues,pictureSource} from './scene-data.mjs';

const curriculum=window.RVU_CURRICULUM;
const allWords=curriculum?.alphabet?.flatMap(lesson=>lesson.words)||[];
const ar=()=>document.documentElement.lang!=='en';
const t=(a,b)=>ar()?a:b;
const make=(tag,cls,value)=>{
 const el=document.createElement(tag);
 if(cls)el.className=cls;
 if(value!==undefined)el.textContent=value;
 return el;
};
const progressKey='rvu-story-progress-v1';
const albumKey='rvu-star-album-enabled';
function completedLessons(){
 try{
  const data=JSON.parse(localStorage.getItem(progressKey)||'{}');
  return {
   alphabet:new Set(Array.isArray(data?.completed?.alphabet)?data.completed.alphabet:[]),
   sentences:new Set(Array.isArray(data?.completed?.sentences)?data.completed.sentences:[])
  };
 }catch{return {alphabet:new Set(),sentences:new Set()}}
}
function albumEnabled(){try{return localStorage.getItem(albumKey)==='true'}catch{return false}}
function setAlbumEnabled(value){try{localStorage.setItem(albumKey,String(value))}catch{}}
function lessonUrl(type,id){return '/learn/'+type+'/'+id+'/'}
function starShape(){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 48 48');
 svg.setAttribute('aria-hidden','true');svg.classList.add('rvu-sticker-star');
 const polygon=document.createElementNS('http://www.w3.org/2000/svg','path');
 polygon.setAttribute('d','M24 4 30.4 17.1 44.8 19.2 34.4 29.3 36.8 43.7 24 36.9 11.2 43.7 13.6 29.3 3.2 19.2 17.6 17.1Z');
 svg.append(polygon);return svg;
}
function galleryCard(type,lesson,done){
 const a=make('a','rvu-sticker-card'+(done?' earned':''));
 a.href=lessonUrl(type,lesson.id);
 const picture=make('span','rvu-sticker-seal');picture.append(starShape());
 const heading=make('strong','rvu-sticker-name',type==='alphabet'?lesson.letter:lesson.title);
 if(type==='sentences'){heading.dir='ltr';heading.lang='en'}
 const label=make('span','rvu-sticker-caption',done?t('نجمة الدرس','Lesson star'):t('لسه قدامك','Ready to explore'));
 a.setAttribute('aria-label',(type==='alphabet'?lesson.letter:lesson.title)+' — '+label.textContent);
 a.append(picture,heading,label);
 return a;
}
function mountAlbum(){
 const root=document.getElementById('rvu-star-album');
 if(!root)return;
 const enabled=albumEnabled(),finished=completedLessons();
 const total=finished.alphabet.size+finished.sentences.size;
 const panel=make('section','rvu-album-panel');
 const top=make('div','rvu-album-heading');
 const info=make('div');
 info.append(make('span','rvu-visual-kicker',t('اختياري، بدون نقاط أو منافسة','Optional, no points or competition')));
 info.append(make('h1',null,t('ألبوم نجوم المغامرة','Adventure star album')));
 info.append(make('p',null,t('كل درس تنهيه له نجمة ورقية. الألبوم اختيارك، والنجوم محفوظة على جهازك فقط.','Each completed lesson has a paper star. The album is optional and stored only on this device.')));
 const toggle=make('label','rvu-album-toggle');
 const checkbox=make('input');checkbox.type='checkbox';checkbox.checked=enabled;
 toggle.append(checkbox,make('span',null,t('تفعيل ألبوم النجوم','Enable star album')));
 const summary=make('strong','rvu-album-total');
 top.append(info,toggle);
 const gallery=make('div','rvu-sticker-gallery');
 const render=()=>{
  gallery.replaceChildren();
  gallery.hidden=!checkbox.checked;
  const count=completedLessons();
  summary.textContent=checkbox.checked?t('النجوم اللي جمعتها: ','Stars collected: ')+(count.alphabet.size+count.sentences.size):
   t('الألبوم متوقف — الدروس المكتملة محفوظة','Album off — lesson completion is still saved');
  if(!checkbox.checked)return;
  for(const [type,items,title] of [
   ['alphabet',curriculum.alphabet,t('عالم الحروف','Alphabet World')],
   ['sentences',curriculum.sentences,t('المواقف اليومية','Everyday English')]
  ]){
   const group=make('section','rvu-sticker-group');
   group.append(make('h2',null,title));
   const grid=make('div','rvu-sticker-grid');
   items.forEach(lesson=>grid.append(galleryCard(type,lesson,count[type].has(lesson.id))));
   group.append(grid);gallery.append(group);
  }
 };
 checkbox.addEventListener('change',()=>{setAlbumEnabled(checkbox.checked);render()});
 panel.append(top,summary,gallery);
 root.replaceChildren(panel);render();
 document.addEventListener('rvu:lesson-completed',render);
}
function mountAlbumLink(){
 const page=document.body.dataset.page;
 if(page!=='hub'&&page!=='lesson')return;
 const target=page==='hub'?document.querySelector('.rvu-play-teaser'):
  document.querySelector('.storybook-finish');
 if(!target)return;
 const link=make('a','rvu-album-link');
 link.href='/learn/stickers/';
 link.append(starShape(),make('span',null,albumEnabled()?t('ألبوم النجوم','Star album'):t('ألبوم النجوم الاختياري','Optional star album')));
 if(page==='hub')target.after(link);else target.append(link);
}
function pictureButton(cue,lesson,playButton){
 const button=playButton(cue.clipType,lesson.id,cue.utterance);
 if(!button)return null;
 button.classList.add('rvu-scene-object');
 button.textContent='';
 const img=make('img','rvu-scene-item');
 img.src=pictureSource(cue.image);
 img.alt='';img.loading='lazy';img.decoding='async';img.width=160;img.height=160;
 img.addEventListener('error',()=>{img.replaceWith(make('span','rvu-scene-fallback',cue.image[0].toUpperCase()))},{once:true});
 button.append(img);
 button.setAttribute('aria-label',t('اسمع ','Listen to ')+cue.utterance);
 return button;
}
function activeLesson(){
 if(document.body.dataset.page!=='lesson')return null;
 const parts=location.pathname.split('/').filter(Boolean);
 if(parts[0]!=='learn'||!['alphabet','sentences'].includes(parts[1])||!parts[2])return null;
 const type=parts[1],lesson=curriculum[type==='alphabet'?'alphabet':'sentences'].find(item=>item.id===parts[2]);
 return lesson?{type,lesson}:null;
}
function mountInteractiveScene(playButton){
 const active=activeLesson();
 if(!active)return;
 const {type,lesson}=active;
 const card=document.querySelector('.lesson-card');
 if(!card)return;
 const cues=getPictureCues(type,lesson,allWords);
 if(!cues.length)return;
 const root=make('section','rvu-visual-scene');
 root.setAttribute('aria-label',t('مشهد تفاعلي لدرس ','Interactive lesson scene: ')+(lesson.title||lesson.letter));
 const intro=make('div','rvu-scene-intro');
 intro.append(make('span','rvu-visual-kicker',t('المشهد التفاعلي','Interactive picture scene')));
 intro.append(make('h2','rvu-scene-title',type==='alphabet'?t('اكتشف صور حرف ','Explore the pictures for ')+lesson.letter:t('الصور بتتكلم','Pictures that speak')));
 intro.append(make('p',null,t('المس أي صورة علشان تسمعها وتتحرك. تقدر تعيد الاستماع على سرعتك المختارة.','Tap a picture to hear it and see it move. Repeat at your chosen playback speed.')));
 const stage=make('div','rvu-scene-stage');
 stage.dataset.theme=type==='alphabet'?'garden':['school','home','garden','room'][lesson.id.length%4];
 const background=make('div','rvu-scene-landscape');
 background.setAttribute('aria-hidden','true');
 background.append(make('span','rvu-scene-sun'),make('span','rvu-scene-hill first'),make('span','rvu-scene-hill second'));
 const character=make('span','rvu-scene-character character-portrait '+(type==='alphabet'?'lizard':'girl'));
 character.setAttribute('aria-hidden','true');
 const objects=make('div','rvu-scene-items');
 const announcement=make('p','rvu-scene-announcement',t('اختار صورة وابدأ الاستماع','Choose a picture to listen'));
 announcement.setAttribute('aria-live','polite');announcement.setAttribute('role','status');
 let previous=null;
 cues.forEach((cue,i)=>{
  const button=pictureButton(cue,lesson,playButton);
  if(!button)return;
  button.style.setProperty('--scene-index',String(i));
  if(button.disabled){button.title=t('تسجيل النطق قيد المراجعة','Audio is being reviewed');button.classList.add('rvu-scene-unavailable')}
  button.addEventListener('click',()=>{
   if(button.disabled)return;
   if(previous)previous.classList.remove('is-touched');
   previous=button;button.classList.add('is-touched');
   announcement.textContent=cue.utterance;
   announcement.lang='en';announcement.dir='ltr';
   character.classList.remove('rvu-scene-wave');
   void character.offsetWidth;
   character.classList.add('rvu-scene-wave');
  });
  objects.append(button);
 });
 stage.append(background,character,objects);
 root.append(intro,stage,announcement);
 const guide=card.querySelector('.storybook-guide')||card.querySelector('.voice-picker');
 if(guide)guide.after(root);else card.prepend(root);
 const total=objects.children.length;
 if(total<1)root.remove();
}
function makePictureChoice(cue){
 const btn=make('button','rvu-picture-choice');btn.type='button';
 btn.setAttribute('aria-label',t('الصورة: ','Picture: ')+cue.image);
 const img=make('img');img.alt='';img.src=pictureSource(cue.image);
 img.loading='lazy';img.decoding='async';img.width=120;img.height=120;
 img.addEventListener('error',()=>img.replaceWith(make('span','rvu-scene-fallback',cue.image[0].toUpperCase())),{once:true});
 btn.append(img);return btn;
}
function mountPictureFirstChallenge(playButton){
 const active=activeLesson();
 if(!active)return;
 const {type,lesson}=active;
 const card=document.querySelector('.lesson-card');
 if(!card)return;
 const cues=getPictureCues(type,lesson,allWords);
 const playable=cues.filter(cue=>{
  const button=playButton(cue.clipType,lesson.id,cue.utterance);
  return button&&!button.disabled;
 });
 if(playable.length<2)return;
 const section=make('section','rvu-picture-challenge');
 section.setAttribute('aria-label',t('لعبة الصور والصوت','Listen and choose the picture game'));
 section.append(make('span','rvu-visual-kicker',t('الصور والصوت أولًا','Pictures and sounds first')));
 section.append(make('h2',null,t('اسمع واختار الصورة','Listen and choose the picture')));
 section.append(make('p','rvu-picture-help',t('مش محتاج تقرأ إنجليزي. اضغط اسمع وبعدين اختار الصورة.','No English reading required. Tap Listen, then choose the picture.')));
 const toolbar=make('div','rvu-picture-toolbar');
 const step=make('span','rvu-picture-step');
 const answerAudio=make('div','rvu-picture-audio');
 toolbar.append(answerAudio,step);
 const grid=make('div','rvu-picture-options');
 const feedback=make('p','rvu-picture-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const next=make('button','rvu-picture-next',t('الصورة اللي بعدها','Next picture'));
 next.type='button';next.hidden=true;
 let index=0;
 function render(){
  const cue=playable[index];
  step.textContent=(index+1)+' / '+playable.length;
  answerAudio.replaceChildren();grid.replaceChildren();feedback.textContent='';next.hidden=true;
  const audio=playButton(cue.clipType,lesson.id,cue.utterance);
  if(audio){audio.classList.add('rvu-picture-listen');audio.textContent=t('اسمع السؤال','Listen');answerAudio.append(audio)}
  const others=playable.filter(item=>item.id!==cue.id).slice(0,3);
  const choices=[cue,...others].sort((a,b)=>((a.id*7+index*3)%11)-((b.id*7+index*3)%11));
  choices.forEach(choice=>{
   const btn=makePictureChoice(choice);
   btn.addEventListener('click',()=>{
    if(choice.id===cue.id){
     btn.classList.add('is-correct');
     grid.querySelectorAll('button').forEach(option=>{option.disabled=true});
     feedback.textContent=t('صح! استمع مرة تانية أو اختار الصورة اللي بعدها.','Correct! Listen again or choose the next picture.');
     next.hidden=false;
     document.dispatchEvent(new CustomEvent('rvu:activity-feedback',{detail:{ok:true}}));
    }else{
     btn.classList.add('is-retry');
     btn.disabled=true;
     feedback.textContent=t('جرّب صورة تانية، واسمع السؤال مرة كمان.','Try another picture and listen again.');
     document.dispatchEvent(new CustomEvent('rvu:activity-feedback',{detail:{ok:false}}));
    }
   });
   grid.append(btn);
  });
 }
 next.addEventListener('click',()=>{index=(index+1)%playable.length;render()});
 section.append(toolbar,grid,feedback,next);
 const scene=card.querySelector('.rvu-visual-scene');
 if(scene)scene.after(section);else card.prepend(section);
 render();
}
function mountFlipBook(){
 if(document.body.dataset.page!=='preview')return;
 const strip=document.querySelector('.preview-five');
 const sources=[...strip?.querySelectorAll('figure')||[]].map(figure=>({
  src:figure.querySelector('img')?.getAttribute('src'),
  alt:figure.querySelector('img')?.alt||'',
  caption:figure.querySelector('figcaption')?.textContent||''
 })).filter(item=>item.src);
 if(!strip||sources.length<2)return;
 const viewer=make('section','rvu-flipbook');
 viewer.setAttribute('aria-label',t('تقليب صفحات الكتاب','Flip through the book'));
 viewer.append(make('span','rvu-visual-kicker',t('معاينة ورقية تفاعلية','Interactive paper-book preview')));
 viewer.append(make('h2',null,t('قلّب صفحات الكتاب','Turn the pages of the book')));
 viewer.append(make('p','rvu-flip-help',t('خمس صفحات حقيقية منفصلة. استخدم الأسهم أو اسحب الصفحة.','Five separate real pages. Use the arrows or swipe to turn.')));
 const frame=make('div','rvu-flip-frame');
 frame.tabIndex=0;
 frame.setAttribute('role','group');
 frame.setAttribute('aria-label',t('صفحات الكتاب القابلة للتقليب','Turnable book pages'));
 const book=make('div','rvu-flip-page');
 const img=make('img','rvu-flip-current');
 img.alt=sources[0].alt;img.src=sources[0].src;img.width=900;img.height=1273;
 book.append(img);frame.append(book);
 const controls=make('div','rvu-flip-controls');
 const prev=make('button','rvu-flip-arrow',t('الصفحة السابقة','Previous page'));
 const next=make('button','rvu-flip-arrow',t('الصفحة التالية','Next page'));
 prev.type='button';next.type='button';
 const caption=make('p','rvu-flip-caption');caption.setAttribute('aria-live','polite');
 const progress=make('span','rvu-flip-count');
 controls.append(prev,caption,next,progress);
 let current=0,turning=false,fromX=null;
 function update(){
  caption.textContent=sources[current].caption;
  progress.textContent=(current+1)+' / '+sources.length;
  prev.disabled=current===0;next.disabled=current===sources.length-1;
 }
 function turn(nextIndex){
  if(turning||nextIndex<0||nextIndex>=sources.length||nextIndex===current)return;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const previous=sources[current];
  current=nextIndex;update();
  if(reduced){img.src=sources[current].src;img.alt=sources[current].alt;return}
  turning=true;
  const sheet=make('div','rvu-flip-sheet');
  const old=make('img');old.src=previous.src;old.alt='';old.width=900;old.height=1273;sheet.append(old);
  sheet.dataset.direction=nextIndex>current-1?'forward':'backward';
  book.append(sheet);
  img.src=sources[current].src;img.alt=sources[current].alt;
  const cleanup=()=>{sheet.remove();turning=false};
  sheet.addEventListener('animationend',cleanup,{once:true});
  if(typeof window.requestAnimationFrame==='function')window.requestAnimationFrame(()=>sheet.classList.add('is-turning'));
  else sheet.classList.add('is-turning');
 }
 prev.addEventListener('click',()=>turn(current-1));next.addEventListener('click',()=>turn(current+1));
 frame.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();turn(current+1)}
  if(e.key==='ArrowLeft'){e.preventDefault();turn(current-1)}
 });
 frame.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')fromX=e.clientX});
 frame.addEventListener('pointerup',e=>{
  if(fromX===null)return;
  const distance=e.clientX-fromX;fromX=null;
  if(Math.abs(distance)>55)turn(current+(distance<0?1:-1));
 });
 frame.addEventListener('pointercancel',()=>{fromX=null});
 viewer.append(frame,controls);
 strip.before(viewer);update();
}
export function mountAdventureExtras({playButton}={}){
 if(!curriculum)return;
 mountAlbum();
 mountAlbumLink();
 if(typeof playButton==='function'){
  mountInteractiveScene(playButton);
  mountPictureFirstChallenge(playButton);
 }
 mountFlipBook();
}
