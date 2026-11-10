import {approvedMoments} from './story-moments.mjs';
/* Situations use original RVU book characters and approved, pre-recorded sentences. */
const el=(tag,cls,content)=>{
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(content!==undefined)node.textContent=content;
 return node;
};
const svgNode=(name,attrs={})=>{
 const node=document.createElementNS('http://www.w3.org/2000/svg',name);
 for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));
 return node;
};
const text=(ar,en)=>document.documentElement.lang==='en'?en:ar;
const phrasePictures={
 'Please.':'ball','Excuse me.':'door',"You're welcome.":'gift',
 'Thank you.':'gift',"I'm sorry.":'hand',
 'Can I have the ball, please?':'ball',
 'Can I have the book, please?':'book',
 'Can I have some water, please?':'cup',
 'Can you help me, please?':'hand',
 "I don't understand.":'book',
 'Say it again, please.':'teacher',
 'Please open the box.':'door',
 'Please close the door.':'door',
 "I'm at school.":'school',
 'This is my teacher.':'teacher',
 'I have a book.':'book',
 'I have a pencil.':'pencil'
};
const approvedWordArt=new Set(['ball','gift','hand','door']);
function drawArt(name){
 if(approvedWordArt.has(name)){
  const img=el('img','rvu-story-object-image');
  img.src='/assets/words/'+name+'.svg';img.alt='';img.loading='lazy';
  img.width=144;img.height=144;return img;
 }
 const svg=svgNode('svg',{viewBox:'0 0 144 144',class:'rvu-story-object-svg','aria-hidden':'true'});
 const shape=(tag,attrs)=>svg.append(svgNode(tag,attrs));
 if(name==='book'){
  shape('path',{d:'M72 37 Q44 19 17 34 V105 Q47 93 72 112 Q95 93 127 105 V34 Q100 19 72 37Z',fill:'#fff7e1',stroke:'#3a7b67','stroke-width':5,'stroke-linejoin':'round'});
  shape('path',{d:'M72 37V112 M32 48Q52 43 64 50 M80 50Q99 43 114 48 M32 65Q52 60 64 67 M80 67Q99 60 114 65',stroke:'#67a3a1','stroke-width':3,fill:'none','stroke-linecap':'round'});
 }else if(name==='cup'){
  shape('path',{d:'M30 48H106L97 112Q72 123 39 112Z',fill:'#e4f7ff',stroke:'#4b9fc3','stroke-width':5,'stroke-linejoin':'round'});
  shape('path',{d:'M106 60Q133 54 130 77Q127 96 101 94',fill:'none',stroke:'#4b9fc3','stroke-width':8,'stroke-linecap':'round'});
  shape('path',{d:'M37 73H99L95 107Q73 116 44 107Z',fill:'#a3dfff',opacity:.85});
 }else if(name==='pencil'){
  shape('path',{d:'M32 111L26 121L38 117L112 43L98 29Z',fill:'#f3c262',stroke:'#ad7b4e','stroke-width':4,'stroke-linejoin':'round'});
  shape('path',{d:'M98 29L107 20L123 36L112 43Z',fill:'#f5a3a3',stroke:'#ad7b4e','stroke-width':3});
  shape('path',{d:'M27 121L33 108L40 116Z',fill:'#5d4938'});
 }else if(name==='teacher'){
  shape('rect',{x:17,y:24,width:110,height:83,rx:9,fill:'#2c7e66',stroke:'#bc8856','stroke-width':7});
  shape('path',{d:'M45 116H99 M72 107V116',stroke:'#bc8856','stroke-width':8,'stroke-linecap':'round'});
  const letter=svgNode('text',{x:72,y:81,fill:'#fff6d4','font-size':40,'font-family':'sans-serif','font-weight':800,'text-anchor':'middle'});
  letter.textContent='Aa';svg.append(letter);
 }else{
  shape('path',{d:'M18 67L72 24L126 67V120H18Z',fill:'#f7dca8',stroke:'#b88c66','stroke-width':4});
  shape('path',{d:'M13 68L72 18L131 68',fill:'none',stroke:'#ce785d','stroke-width':12,'stroke-linecap':'round','stroke-linejoin':'round'});
  shape('rect',{x:57,y:82,width:30,height:38,rx:4,fill:'#6baea8'});
  for(const x of [29,93])shape('rect',{x,y:75,width:19,height:21,rx:4,fill:'#c8ebf2',stroke:'#77b2b2','stroke-width':3});
 }
 return svg;
}
function lessonFromLocation(){
 const parts=location.pathname.split('/').filter(Boolean);
 if(parts[0]!=='learn'||parts[1]!=='sentences'||!parts[2])return null;
 return window.RVU_CURRICULUM?.sentences?.find(item=>item.id===parts[2])||null;
}
export function mountStoryJourney(playButton){
 const lesson=lessonFromLocation();
 if(!lesson||typeof playButton!=='function')return;
 const moments=approvedMoments(lesson);
 if(!moments.length)return;
 const card=document.querySelector('.lesson-card');
 if(!card||card.querySelector('.rvu-story-journey'))return;
 if(!document.querySelector('link[data-rvu-story-journey]')){
  const link=el('link');link.rel='stylesheet';link.href='/learn/story-journey.css';
  link.dataset.rvuStoryJourney='true';document.head.append(link);
 }
 const root=el('section','rvu-story-journey');
 root.setAttribute('aria-label',text('قصة مصورة تفاعلية','Interactive illustrated story'));
 root.append(el('span','rvu-story-kicker',text('حكاية من يومنا','Everyday Story')));
 root.append(el('h2',null,text('مغامرتنا الصغيرة','Our little adventure')));
 root.append(el('p','rvu-story-description',text('بص على الموقف، اسمع الجملة، واختار الصورة والكلام المناسبين.','Look at the scene, listen to the recorded phrase, and choose what fits.')));
 const stage=el('div','rvu-story-stage');
 const progress=el('div','rvu-story-progress');
 const number=el('span');
 const bar=el('span','rvu-story-bar');const fill=el('i');
 bar.append(fill);progress.append(number,bar);
 const scene=el('div','rvu-story-scene');
 const atmosphere=el('div','rvu-story-atmosphere');
 const cast=el('div','rvu-story-cast');
 const actor=el('span','character-portrait rvu-story-actor');
 const friend=el('span','character-portrait rvu-story-friend');
 for(const avatar of [actor,friend])avatar.setAttribute('aria-hidden','true');
 cast.append(actor,friend);
 const object=el('div','rvu-story-focus');
 const prompt=el('p','rvu-story-prompt');
 scene.append(atmosphere,cast,object,prompt);
 const listening=el('div','rvu-story-listening');
 const options=el('div','rvu-story-options');
 const feedback=el('p','rvu-story-feedback');
 feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const next=el('button','rvu-story-next',text('الموقف التالي','Next situation'));
 next.type='button';next.hidden=true;
 stage.append(progress,scene,listening,options,feedback,next);
 root.append(stage);
 let index=0,locked=false;
 const makeAudio=(phrase,caption)=>{
  const audio=playButton('everyday-sentence',lesson.id,phrase);
  if(!audio)return null;
  audio.classList.add('rvu-story-audio');
  audio.textContent=caption;
  audio.setAttribute('aria-label',text('استمع إلى ','Listen to ')+phrase);
  return audio;
 };
 function draw(){
  locked=false;
  const m=moments[index];
  root.dataset.mood='ready';
  number.textContent=text('الموقف ','Situation ')+(index+1)+' / '+moments.length;
  fill.style.width=((index+1)/moments.length*100)+'%';
  scene.dataset.location=m.scene;
  actor.className='character-portrait rvu-story-actor '+m.actor;
  friend.className='character-portrait rvu-story-friend '+m.friend;
  object.replaceChildren(drawArt(m.object));
  prompt.textContent=text(m.ar,m.en);
  listening.replaceChildren();
  const speech=makeAudio(m.answer,text('اسمع الجملة','Listen to the phrase'));
  if(speech)listening.append(speech);
  options.replaceChildren();
  m.choices.forEach((phrase,i)=>{
   const card=el('div','rvu-story-option');
   card.dataset.choice=String(i);
   const choose=el('button','rvu-story-pick');
   choose.type='button';
   choose.setAttribute('aria-label',text('اختار الإجابة ','Choose the answer ')+phrase);
   choose.append(drawArt(phrasePictures[phrase]||m.object));
   const label=el('span','rvu-story-phrase',phrase);
   label.lang='en';label.dir='ltr';choose.append(label);
   const listen=makeAudio(phrase,text('اسمع الاختيار','Hear option'));
   if(listen){listen.classList.add('rvu-story-option-audio');card.append(choose,listen)}
   else card.append(choose);
   choose.addEventListener('click',()=>{
    if(locked||choose.disabled)return;
    if(phrase===m.answer){
     locked=true;root.dataset.mood='success';choose.classList.add('is-correct');
     options.querySelectorAll('.rvu-story-pick').forEach(button=>button.disabled=true);
     feedback.textContent=text('صح! أحسنت. شوف الموقف اللي بعده.','Correct! Well done. Explore the next situation.');
     next.hidden=false;next.textContent=index===moments.length-1?text('العب القصة من الأول','Play the story again'):text('الموقف التالي','Next situation');
     document.dispatchEvent(new CustomEvent('rvu:activity-feedback',{detail:{ok:true,kind:'story'}}));
    }else{
     choose.classList.add('is-try-again');choose.disabled=true;
     feedback.textContent=text('جرّب اختيار تاني، وتقدر تسمع الجملة مرة كمان.','Try another choice. You can listen to the phrase again.');
     document.dispatchEvent(new CustomEvent('rvu:activity-feedback',{detail:{ok:false,kind:'story'}}));
    }
   });
   options.append(card);
  });
  feedback.textContent='';next.hidden=true;
  document.dispatchEvent(new CustomEvent('rvu:story-stage',{detail:{state:'point'}}));
 }
 next.addEventListener('click',()=>{
  if(!locked)return;index=(index+1)%moments.length;draw();
 });
 const anchor=card.querySelector('.rvu-visual-scene')||card.querySelector('.voice-picker');
 if(anchor)anchor.after(root);else card.prepend(root);
 draw();
}
