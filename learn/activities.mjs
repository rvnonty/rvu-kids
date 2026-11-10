import {makeActivityData,shuffle,REPORTED_BAD_WORDS} from './activity-data.mjs';

/* Accessible, tiny game UI. Never uses remote APIs, saved personal data,
   forced timers, sound autoplay, or engagement pressure. */
const say=(lang,ar,en)=>lang==='ar'?ar:en;
function el(tag,cls,text){
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(text!==undefined)node.textContent=text;
 return node;
}
function celebrate(panel){
 panel.classList.remove('rvu-success-pop');
 void panel.offsetWidth;
 panel.classList.add('rvu-success-pop');
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const last=panel.querySelector('.rvu-burst');if(last)last.remove();
 const burst=el('div','rvu-burst');burst.setAttribute('aria-hidden','true');
 const symbols=['⭐','✨','🌟','🎉','💛','🌈','🦋','🎈','✨','🌟'];
 symbols.forEach((symbol,i)=>{
  const piece=el('span','rvu-burst-piece',symbol);
  piece.style.setProperty('--ray',i*36+'deg');
  piece.style.setProperty('--distance',(70+(i%4)*17)+'px');
  piece.style.setProperty('--turn',(i%2?65:-65)+'deg');
  burst.append(piece);
 });
 panel.append(burst);
 burst.addEventListener('animationend',e=>{if(e.target===burst)burst.remove()});
}
function feedback(panel,lang,ok){
 const line=panel.querySelector('.rvu-feedback');if(!line)return;
 line.dataset.result=ok?'correct':'retry';
 line.textContent=ok?
  say(lang,'🎉 صح! برافو عليك! أحسنت!','🎉 Correct! Fantastic work!'):
  say(lang,'قربت! جرب مرة تانية 🌷','Almost there! Try again 🌷');
 if(ok)celebrate(panel);
}
function panel(title,subtitle,icon){
 const section=el('section','rvu-game-panel');
 section.append(el('div','rvu-game-tag',icon+' '+title));
 section.append(el('p','rvu-game-hint',subtitle));
 return section;
}
function choiceGame(title,subtitle,icon,rounds,lang,prepare){
 const box=panel(title,subtitle,icon),counter=el('span','rvu-game-counter');
 const progress=el('div','rvu-game-progress'),fill=el('span','rvu-game-fill');
 progress.setAttribute('role','progressbar');progress.setAttribute('aria-label',say(lang,'تقدم الأسئلة','Question progress'));progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax',String(rounds.length));progress.append(fill);
 const question=el('div','rvu-question'),choices=el('div','rvu-choices'),msg=el('p','rvu-feedback');
 msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');
 const next=el('button','rvu-game-next');next.type='button';next.hidden=true;
 box.append(counter,progress,question,choices,msg,next);
 let current=0;
 function render(){
  const round=rounds[current];
  box.classList.remove('rvu-success-pop');counter.textContent=say(lang,'السؤال ','Question ')+(current+1)+' / '+rounds.length;
  progress.setAttribute('aria-valuenow',String(current+1));fill.style.width=(100*(current+1)/rounds.length)+'%';
  question.replaceChildren();choices.replaceChildren();msg.textContent='';msg.dataset.result='';
  next.hidden=true;
  prepare(round,question);
  round.choices.forEach(value=>{
   const button=el('button','rvu-choice',value);button.type='button';button.lang='en';button.dir='ltr';
   button.addEventListener('click',()=>{
    if(value===round.answer){
     button.classList.add('is-right');
     choices.querySelectorAll('button').forEach(b=>b.disabled=true);
     feedback(box,lang,true);
     next.hidden=false;next.textContent=current===rounds.length-1?
      say(lang,'ممتاز! العب من أول وجديد ↻','Great! Play again ↻'):
      say(lang,'السؤال التالي ←','Next question →');
    }else{
     button.classList.add('is-wrong');button.disabled=true;feedback(box,lang,false);
    }
   });
   choices.append(button);
  });
 }
 next.addEventListener('click',()=>{current=(current+1)%rounds.length;render()});
 render();return box;
}
function orderGame(rounds,lang,playButton,type,lesson){
 const box=panel(say(lang,'رتّب الجملة','Put the sentence in order'),
   say(lang,'المس الكلمات بالترتيب الصحيح. لو محتاج مساعدة افتح التلميح.','Tap the words in the right order. You can open a hint.'),'🧩');
 const counter=el('span','rvu-game-counter'),question=el('div','rvu-question');
 const chosen=el('div','rvu-selected');chosen.setAttribute('aria-label',say(lang,'الكلمات اللي اخترتها','Your selected words'));
 const tiles=el('div','rvu-tiles'),msg=el('p','rvu-feedback');msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');
 const controls=el('div','rvu-game-actions'),again=el('button','rvu-game-reset',say(lang,'امسح وجرب تاني','Start over')),next=el('button','rvu-game-next');
 again.type='button';next.type='button';next.hidden=true;
 controls.append(again,next);box.append(counter,question,chosen,tiles,msg,controls);
 let index=0,picked=[];
 function render(){
  const round=rounds[index];picked=[];question.replaceChildren();chosen.replaceChildren();tiles.replaceChildren();
  box.classList.remove('rvu-success-pop');msg.textContent='';msg.dataset.result='';next.hidden=true;
  counter.textContent=say(lang,'الجملة ','Sentence ')+(index+1)+' / '+rounds.length;
  question.append(el('p','rvu-question-label',say(lang,'تقدر تركّب الجملة الصح؟','Can you put the sentence in order?')));
  const playback=playButton(type==='alphabet'?'alphabet-sentence':'everyday-sentence',lesson.id,round.sentence);
  if(playback)question.append(playback);
  const details=el('details','rvu-clue'),summary=el('summary',null,say(lang,'أظهر تلميحًا','Show a hint'));
  const hint=el('span','rvu-clue-text',round.sentence);hint.lang='en';hint.dir='ltr';
  details.append(summary,hint);question.append(details);
  round.shuffled.forEach(tokenIndex=>{
   const b=el('button','rvu-tile',round.tokens[tokenIndex]);
   b.lang='en';b.dir='ltr';b.type='button';
   b.addEventListener('click',()=>{
    if(b.disabled||!next.hidden)return;
    b.disabled=true;picked.push(round.tokens[tokenIndex]);chosen.append(el('span','rvu-chosen-token',round.tokens[tokenIndex]));
    if(picked.length===round.tokens.length){
     const ok=picked.every((word,i)=>word===round.tokens[i]);
     feedback(box,lang,ok);
     if(ok){next.hidden=false;next.textContent=index===rounds.length-1?
      say(lang,'العب تاني ↻','Play again ↻'):say(lang,'الجملة التالية ←','Next sentence →')}
    }
   });tiles.append(b);
  });
 }
 again.addEventListener('click',render);
 next.addEventListener('click',()=>{index=(index+1)%rounds.length;render()});
 render();return box;
}
function spellingGame(rounds,lang,wordVisual){
 const box=panel(say(lang,'ركّب الكلمة','Build the word'),
   say(lang,'بص للصورة، واختار حروف اسمها بالترتيب.','Look at the picture and tap its letters in order.'),'🔡');
 const counter=el('span','rvu-game-counter'),question=el('div','rvu-question'),chosen=el('div','rvu-selected');
 const tiles=el('div','rvu-tiles'),msg=el('p','rvu-feedback');msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');
 const controls=el('div','rvu-game-actions'),again=el('button','rvu-game-reset',say(lang,'امسح وجرب تاني','Start over')),next=el('button','rvu-game-next');
 again.type='button';next.type='button';next.hidden=true;controls.append(again,next);
 box.append(counter,question,chosen,tiles,msg,controls);
 let index=0,picked=[];
 function render(){
  const round=rounds[index];picked=[];question.replaceChildren();chosen.replaceChildren();tiles.replaceChildren();
  box.classList.remove('rvu-success-pop');msg.textContent='';msg.dataset.result='';next.hidden=true;
  counter.textContent=say(lang,'كلمة ','Word ')+(index+1)+' / '+rounds.length;
  const picture=wordVisual(round.word);picture.classList.add('rvu-game-picture');question.append(picture);
  round.shuffled.forEach(letterIndex=>{
   const character=round.word[letterIndex];
   const b=el('button','rvu-tile',character.toUpperCase());b.type='button';b.lang='en';b.dir='ltr';
   b.addEventListener('click',()=>{
    if(b.disabled||!next.hidden)return;
    b.disabled=true;picked.push(character);
    const chip=el('span','rvu-chosen-token',character.toUpperCase());chip.lang='en';chosen.append(chip);
    if(picked.length===round.word.length){
     const ok=picked.join('')===round.word;
     feedback(box,lang,ok);
     if(ok){next.hidden=false;next.textContent=index===rounds.length-1?
      say(lang,'العب تاني ↻','Play again ↻'):say(lang,'الكلمة التالية ←','Next word →')}
    }
   });tiles.append(b);
  });
 }
 again.addEventListener('click',render);
 next.addEventListener('click',()=>{index=(index+1)%rounds.length;render()});
 render();return box;
}
export function mountActivities(root,{type,lesson,lang,playButton,wordVisual}){
 if(!root||!lesson||!['alphabet','sentences'].includes(type))return;
 const data=makeActivityData(type,lesson);
 const colors=['#fdd76b','#97d6c6','#f3aca5','#8fc5e6','#e0c2f3','#ecc686'];
 const index=lesson.letter?lesson.letter.charCodeAt(0)-65:lesson.id.length;
 root.style.setProperty('--rvu-lesson-accent',colors[index%colors.length]);
 const intro=el('section','rvu-arcade-intro'),deco=el('div','rvu-arcade-deco');
 deco.setAttribute('aria-hidden','true');
 ['✨','🌈','⭐','🦋','🎈','☀️'].forEach((symbol,i)=>{
  const span=el('span','rvu-deco-item',symbol);
  span.style.setProperty('--delay',(i*0.32)+'s');deco.append(span);
 });
 intro.append(deco,el('span','rvu-arcade-eyebrow',say(lang,'🌟 العب واتعلّم','🌟 Play & Learn')));
 intro.append(el('h2',null,say(lang,'مغامرة جديدة مستنياك!','A new learning adventure!')));
 intro.append(el('p',null,say(lang,'تمارين إضافية غير اللي في الكتاب، متنوعة وسهلة. اختار لعبة وخد وقتك براحتك.','Extra games beyond the book. Pick an activity and go at your own pace.')));
 const games=[],add=(symbol,ar,en,node)=>{if(node)games.push({symbol,ar,en,node})};
 if(type==='sentences'){
  if(data.scene.length>=2)add('🎭','اختار الموقف','Everyday situations',choiceGame(
   say(lang,'هنقول إيه؟','What would you say?'),
   say(lang,'شوف الموقف واختار الجملة اللي تناسبه.','Look at the situation and choose the best phrase.'),
   '🎭',data.scene,lang,(round,question)=>{
    question.append(el('span','rvu-scene-emoji',round.emoji),el('p','rvu-scene-prompt',say(lang,round.ar,round.en)));
   }
  ));
  if(data.listening.length>=2)add('🎧','اسمع واختار','Listen and choose',choiceGame(
   say(lang,'سمعت جملة إيه؟','What sentence did you hear?'),
   say(lang,'اضغط اسمع، واختار الجملة المطابقة.','Tap Listen and choose the matching sentence.'),
   '🎧',data.listening,lang,(round,question)=>{
    question.append(el('p','rvu-question-label',say(lang,'اسمع الجملة كويس','Listen carefully')));
    const audio=playButton('everyday-sentence',lesson.id,round.answer);if(audio)question.append(audio);
   }
  ));
  if(data.missing.length)add('🧠','كمّل الجملة','Missing word',choiceGame(
   say(lang,'اختار الكلمة الناقصة','Pick the missing word'),
   say(lang,'اختار كلمة تكمل الجملة بشكل صحيح.','Choose the word that completes the sentence.'),
   '🧠',data.missing,lang,(round,question)=>{
    const p=el('p','rvu-masked-sentence',round.masked);p.lang='en';p.dir='ltr';question.append(p);
   }
  ));
  if(data.reorder.length)add('🧩','رتّب الكلمات','Put words in order',orderGame(data.reorder,lang,playButton,type,lesson));
 }else{
  if(data.pictures.length>=2)add('🖼️','الصورة والكلمة','Picture and word',choiceGame(
   say(lang,'إيه اسم الصورة؟','Name the picture'),
   say(lang,'بص للصورة واختار الكلمة الصحيحة.','Look at the picture and choose its word.'),
   '🖼️',data.pictures,lang,(round,question)=>{
    const picture=wordVisual(round.answer);picture.classList.add('rvu-game-picture');question.append(picture);
   }
  ));
  if(data.wordListening.length>=2)add('🎧','اسمع واختار','Listen and choose',choiceGame(
   say(lang,'اسمع الكلمة','Hear the word'),
   say(lang,'اسمع نطق الكلمة واختار اللي سمعته.','Listen to the word and choose what you heard.'),
   '🎧',data.wordListening,lang,(round,question)=>{
    question.append(el('p','rvu-question-label',say(lang,'اضغط زر الاستماع','Tap Listen')));
    const audio=playButton('word',lesson.id,round.answer);if(audio)question.append(audio);
   }
  ));
  if(data.spelling.length)add('🔡','ركّب الكلمة','Spell the word',spellingGame(data.spelling,lang,wordVisual));
  if(data.reorder.length)add('🧩','رتّب الجملة','Order the sentence',orderGame(data.reorder,lang,playButton,type,lesson));
 }
 if(!games.length)return;
 const section=el('section','rvu-lesson-games');section.id='play-and-practice';
 intro.append(el('span','rvu-arcade-total',say(lang,'اختار لعبة من ','Pick from ')+games.length+say(lang,' ألعاب',' games')));
 const tabs=el('div','rvu-game-tabs');tabs.setAttribute('role','tablist');
 tabs.setAttribute('aria-label',say(lang,'الألعاب المتاحة','Available games'));
 const stage=el('div','rvu-game-stage');
 const select=target=>{
  games.forEach((game,i)=>{
   const active=i===target;
   game.tab.setAttribute('aria-selected',String(active));
   game.tab.tabIndex=active?0:-1;
   game.node.hidden=!active;
  });
 };
 games.forEach((game,i)=>{
  const tab=el('button','rvu-game-tab',game.symbol+' '+say(lang,game.ar,game.en));
  tab.type='button';tab.id='rvu-game-tab-'+i;tab.setAttribute('role','tab');
  tab.setAttribute('aria-controls','rvu-game-panel-'+i);
  tab.addEventListener('click',()=>select(i));
  tab.addEventListener('keydown',e=>{
   if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    e.preventDefault();
    const shift=e.key==='ArrowRight'?1:-1,next=(i+shift+games.length)%games.length;
    select(next);games[next].tab.focus();
   }
  });
  game.tab=tab;game.node.id='rvu-game-panel-'+i;game.node.setAttribute('role','tabpanel');
  game.node.setAttribute('aria-labelledby',tab.id);
  tabs.append(tab);stage.append(game.node);
 });
 section.append(intro,tabs,stage);root.append(section);select(0);
}
