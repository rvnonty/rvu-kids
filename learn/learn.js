'use strict';
const C=window.RVU_CURRICULUM;
if(!C)throw Error('Curriculum unavailable');
const alphabet=C.alphabet,units=C.sentences;
const ALL_WORDS=alphabet.flatMap(lesson=>lesson.words);
const AUDIO_ROWS=[["letter-name","a","A"],["letter-sound","a","A"],["word","a","apple"],["word","a","ant"],["word","a","airplane"],["word","a","alligator"],["alphabet-sentence","a","I see an apple."],["letter-name","b","B"],["letter-sound","b","B"],["word","b","ball"],["word","b","bear"],["word","b","banana"],["word","b","boat"],["alphabet-sentence","b","I see a ball."],["letter-name","c","C"],["letter-sound","c","C"],["word","c","cat"],["word","c","car"],["word","c","cake"],["word","c","cup"],["alphabet-sentence","c","This is a cat."],["letter-name","d","D"],["letter-sound","d","D"],["word","d","dog"],["word","d","duck"],["word","d","doll"],["word","d","door"],["alphabet-sentence","d","I see a dog."],["letter-name","e","E"],["letter-sound","e","E"],["word","e","elephant"],["word","e","egg"],["word","e","ear"],["word","e","elbow"],["alphabet-sentence","e","This is an elephant."],["letter-name","f","F"],["letter-sound","f","F"],["word","f","fish"],["word","f","frog"],["word","f","flower"],["word","f","fork"],["alphabet-sentence","f","I see a fish."],["letter-name","g","G"],["letter-sound","g","G"],["word","g","goat"],["word","g","grapes"],["word","g","gift"],["word","g","guitar"],["alphabet-sentence","g","This is a goat."],["letter-name","h","H"],["letter-sound","h","H"],["word","h","hat"],["word","h","house"],["word","h","horse"],["word","h","hand"],["alphabet-sentence","h","I see a hat."],["letter-name","i","I"],["letter-sound","i","I"],["word","i","island"],["word","i","iguana"],["word","i","ice cream"],["word","i","insect"],["alphabet-sentence","i","I see an iguana."],["letter-name","j","J"],["letter-sound","j","J"],["word","j","juice"],["word","j","jacket"],["word","j","jellyfish"],["word","j","jam"],["alphabet-sentence","j","This is a jacket."],["letter-name","k","K"],["letter-sound","k","K"],["word","k","kite"],["word","k","key"],["word","k","kitten"],["word","k","kangaroo"],["alphabet-sentence","k","I see a kite."],["letter-name","l","L"],["letter-sound","l","L"],["word","l","lion"],["word","l","lemon"],["word","l","leaf"],["word","l","lamp"],["alphabet-sentence","l","This is a lion."],["letter-name","m","M"],["letter-sound","m","M"],["word","m","moon"],["word","m","milk"],["word","m","monkey"],["word","m","mouse"],["alphabet-sentence","m","This is a monkey."],["letter-name","n","N"],["letter-sound","n","N"],["word","n","nest"],["word","n","nose"],["word","n","net"],["word","n","night"],["alphabet-sentence","n","I see a nest."],["letter-name","o","O"],["letter-sound","o","O"],["word","o","orange"],["word","o","octopus"],["word","o","ocean"],["word","o","otter"],["alphabet-sentence","o","I see an octopus."],["letter-name","p","P"],["letter-sound","p","P"],["word","p","pig"],["word","p","pen"],["word","p","pizza"],["word","p","panda"],["alphabet-sentence","p","This is a panda."],["letter-name","q","Q"],["letter-sound","q","Q"],["word","q","queen"],["word","q","quilt"],["word","q","quail"],["alphabet-sentence","q","This is a queen."],["letter-name","r","R"],["letter-sound","r","R"],["word","r","rabbit"],["word","r","robot"],["word","r","rain"],["word","r","rainbow"],["alphabet-sentence","r","I see a rainbow."],["letter-name","s","S"],["letter-sound","s","S"],["word","s","sun"],["word","s","star"],["word","s","sock"],["word","s","spoon"],["alphabet-sentence","s","This is a star."],["letter-name","t","T"],["letter-sound","t","T"],["word","t","tiger"],["word","t","train"],["word","t","tree"],["word","t","turtle"],["alphabet-sentence","t","I see a train."],["letter-name","u","U"],["letter-sound","u","U"],["word","u","umbrella"],["word","u","uncle"],["word","u","up"],["word","u","under"],["alphabet-sentence","u","This is an umbrella."],["letter-name","v","V"],["letter-sound","v","V"],["word","v","van"],["word","v","vase"],["word","v","violin"],["word","v","vegetables"],["alphabet-sentence","v","This is a van."],["letter-name","w","W"],["letter-sound","w","W"],["word","w","whale"],["word","w","watermelon"],["word","w","window"],["word","w","watch"],["alphabet-sentence","w","I see a whale."],["letter-name","x","X"],["letter-sound","x","X"],["word","x","x-ray"],["word","x","xylophone"],["alphabet-sentence","x","This is an x-ray."],["alphabet-sentence","x","This is a xylophone."],["letter-name","y","Y"],["letter-sound","y","Y"],["word","y","yo-yo"],["word","y","yogurt"],["word","y","yellow"],["word","y","yak"],["alphabet-sentence","y","This is a yo-yo."],["letter-name","z","Z"],["letter-sound","z","Z"],["word","z","zebra"],["word","z","zoo"],["word","z","zipper"],["word","z","zero"],["alphabet-sentence","z","This is a zebra."],["everyday-sentence","feelings","I'm happy."],["everyday-sentence","feelings","I'm sad."],["everyday-sentence","feelings","I'm angry."],["everyday-sentence","feelings","I'm scared."],["everyday-sentence","hungry","I'm hungry."],["everyday-sentence","hungry","Can I have a snack, please?"],["everyday-sentence","thirsty","I'm thirsty."],["everyday-sentence","thirsty","Can I have some water, please?"],["everyday-sentence","bathroom","I need to go to the bathroom."],["everyday-sentence","bathroom","Can I go to the bathroom, please?"],["everyday-sentence","bathroom","I wash my hands."],["everyday-sentence","my-family","This is my family."],["everyday-sentence","my-family","This is my mom."],["everyday-sentence","my-family","This is my dad."],["everyday-sentence","my-family","This is my brother."],["everyday-sentence","my-family","This is my sister."],["everyday-sentence","hello-about-me","Hello!"],["everyday-sentence","hello-about-me","My name is ______."],["everyday-sentence","hello-about-me","What's your name?"],["everyday-sentence","hello-about-me","Goodbye!"],["everyday-sentence","at-school","I'm at school."],["everyday-sentence","at-school","This is my teacher."],["everyday-sentence","at-school","I have a book."],["everyday-sentence","at-school","I have a pencil."],["everyday-sentence","can-i-have","Can I have _____, please?"],["everyday-sentence","can-i-have","Can I have the ball, please?"],["everyday-sentence","can-i-have","Can I have the book, please?"],["everyday-sentence","can-i-have","Can I have some water, please?"],["everyday-sentence","likes-and-dislikes","I like pizza."],["everyday-sentence","likes-and-dislikes","I like bananas."],["everyday-sentence","likes-and-dislikes","I don't like milk."],["everyday-sentence","likes-and-dislikes","I don't like yogurt."],["everyday-sentence","can-you-help","Can you help me, please?"],["everyday-sentence","can-you-help","I don't understand."],["everyday-sentence","can-you-help","Say it again, please."],["everyday-sentence","can-you-help","Please open the box."],["everyday-sentence","can-you-help","Please close the door."],["everyday-sentence","polite-words","Please."],["everyday-sentence","polite-words","Thank you."],["everyday-sentence","polite-words","I'm sorry."],["everyday-sentence","polite-words","Excuse me."],["everyday-sentence","polite-words","You're welcome."],["everyday-sentence","lets-play","Let's play."],["everyday-sentence","lets-play","Can I play with you?"],["everyday-sentence","lets-play","My turn."],["everyday-sentence","lets-play","Your turn."],["everyday-sentence","lets-play","Let's share."],["everyday-sentence","my-body","My head hurts."],["everyday-sentence","my-body","My tummy hurts."],["everyday-sentence","my-body","My hand hurts."],["everyday-sentence","my-body","I'm tired."],["everyday-sentence","my-body","I'm sick."],["everyday-sentence","daily-routine","I wake up."],["everyday-sentence","daily-routine","I brush my teeth."],["everyday-sentence","daily-routine","I get dressed."],["everyday-sentence","daily-routine","I eat breakfast."],["everyday-sentence","daily-routine","I go to school."],["everyday-sentence","daily-routine","I go to bed."],["everyday-sentence","stay-safe","Stop."],["everyday-sentence","stay-safe","Wait."],["everyday-sentence","stay-safe","No, thank you."],["everyday-sentence","stay-safe","Help me, please."],["everyday-sentence","stay-safe","I need my mom."],["everyday-sentence","stay-safe","I need my dad."]];
const icons={
apple:'🍎',ant:'🐜',airplane:'✈️',alligator:'🐊',ball:'⚽',bear:'🐻',banana:'🍌',boat:'⛵',
cat:'🐱',car:'🚗',cake:'🎂',cup:'🥤',dog:'🐶',duck:'🦆',doll:'🪆',door:'🚪',
elephant:'🐘',egg:'🥚',ear:'👂',elbow:'💪',fish:'🐟',frog:'🐸',flower:'🌻',fork:'🍴',
goat:'🐐',grapes:'🍇',gift:'🎁',guitar:'🎸',hat:'👒',house:'🏠',horse:'🐴',hand:'✋',
island:'🏝️',iguana:'🦎','ice cream':'🍦',insect:'🐞',juice:'🧃',jacket:'🧥',jellyfish:'🪼',jam:'🍯',
kite:'🪁',key:'🔑',kitten:'🐈',kangaroo:'🦘',lion:'🦁',lemon:'🍋',leaf:'🍃',lamp:'💡',
moon:'🌙',milk:'🥛',monkey:'🐒',mouse:'🐁',nest:'🪺',nose:'👃',net:'🥅',night:'🌌',
orange:'🍊',octopus:'🐙',ocean:'🌊',otter:'🦦',pig:'🐷',pen:'🖊️',pizza:'🍕',panda:'🐼',
queen:'👑',quilt:'🧵',quail:'',rabbit:'🐇',robot:'🤖',rain:'🌧️',rainbow:'🌈',
sun:'☀️',star:'⭐',sock:'🧦',spoon:'🥄',tiger:'🐯',train:'🚂',tree:'🌳',turtle:'🐢',
umbrella:'☂️',uncle:'',up:'⬆️',under:'⬇️',van:'🚐',vase:'🏺',violin:'🎻',vegetables:'🥦',
whale:'🐳',watermelon:'🍉',window:'🪟',watch:'⌚','x-ray':'🩻',xylophone:'', 'yo-yo':'🪀',
yogurt:'🥣',yellow:'🟡',yak:'',zebra:'🦓',zoo:'',zipper:'🤐',zero:'0️⃣',
bathroom:'🚻',wash:'🫧',hands:'👐',family:'👨‍👩‍👧‍👦',mom:'👩',dad:'👨',
brother:'👦',sister:'👧',teacher:'👩‍🏫',book:'📖',pencil:'✏️',school:'🏫',water:'💧'
};
const i18n={
ar:{hub:'التعلّم',preview:'المعاينة',book:'الكتاب',listen:'الاستماع',alph:'الحروف والكلمات',sent:'Everyday English — الجمل',words:'كلمات الدرس',sentences:'جمل الدرس',pages:'أرقام الصفحات المطبوعة في الكتاب',say:'اسم الحرف في الكتاب',remember:'اختبار صغير',question:'اضغط على الكلمة المطلوبة',correct:'إجابة صحيحة!',retry:'جرّب تاني',next:'التالي',prev:'السابق',all:'كل الحروف',allSent:'كل الوحدات',buy:'اطلب الكتاب',practice:'شوف واسمع وكرر مع ولي الأمر',learn:'مكتبة التعلّم',units:'الوحدات',previewPages:'صفحات مختارة',live:'المحتوى مطابق للمنهج المعتمد',learning:'اتعلّم مع كتابك',childHint:'استخدم الصور مع الكتاب الأصلي لتثبيت معنى الكلمات.',sample:'لمن يشاهد النموذج فقط',castWelcome:'صحابك في مغامرة التعلّم!',more:'افتح الوحدة التالية',begin:'ابدأ',switch:'English'},
en:{hub:'Learning Hub',preview:'Preview',book:'The Book',listen:'Audio',alph:'Alphabet & Words',sent:'Everyday English — Sentences',words:'Lesson Words',sentences:'Target Sentences',pages:'Printed page numbers in your book',say:'Letter name in the book',remember:'A little word check',question:'Choose the requested word',correct:'Well done!',retry:'Try again',next:'Next',prev:'Previous',all:'All letters',allSent:'All units',buy:'Order the Book',practice:'Look, say and practice with a parent',learn:'Learning Hub',units:'Units',previewPages:'Selected pages',live:'Matches the approved curriculum',learning:'Learn alongside your book',childHint:'Use the illustrations alongside the printed book to learn each word.',sample:'Preview only',castWelcome:'Your friends on every adventure!',more:'Open the next lesson',begin:'Start',switch:'العربية'}
};
const getParam=new URLSearchParams(location.search).get('lang');
let lang=getParam==='en'||getParam==='ar'?getParam:(sessionStorage.getItem('rvu-lang')||'ar');
sessionStorage.setItem('rvu-lang',lang);
const t=k=>i18n[lang][k]||k;
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
function link(url,text,cls){const a=el('a',cls,text);a.href=url;return a}
function renderNavLang(){
 const nav=document.querySelector('.sitebar nav');if(!nav)return;
 const sw=el('button','lang-switch',t('switch'));sw.type='button';sw.setAttribute('aria-label',lang==='ar'?'Switch to English':'التغيير إلى العربية');sw.addEventListener('click',()=>{const next=lang==='ar'?'en':'ar';sessionStorage.setItem('rvu-lang',next);const url=new URL(location.href);url.searchParams.set('lang',next);location.assign(url.href)});nav.append(sw);
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 const v=nav.querySelectorAll('a');
 if(v.length>=3){v[0].textContent=t('hub');v[1].textContent=t('preview');v[2].textContent=t('book')}
}
function urlLetter(a){return '/learn/alphabet/'+a.id+'/'}
function urlUnit(u){return '/learn/sentences/'+u.id+'/'}
function escaped(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function cardLetter(a){
 const z=link(urlLetter(a),undefined,'tile-letter');z.innerHTML='<strong>'+a.letter+'</strong><small>'+a.letter.toLowerCase()+'</small>';z.setAttribute('aria-label','Letter '+a.letter);return z
}
function printedPages(pages){return pages.map(page=>page-3)}
function cardUnit(u,i){
 const a=link(urlUnit(u),undefined,'unit-card');a.innerHTML='<small>UNIT '+String(i+1).padStart(2,'0')+' · '+(lang==='ar'?'صفحات ':'PAGES ')+printedPages(u.pages).join('–')+'</small><h3 dir="ltr" lang="en">'+escaped(u.title)+'</h3><p>'+escaped(lang==='ar'?u.titleAr:'A lesson from your book')+'</p><span class="tile-arrow">↗</span>';return a;
}
function hub(){
 const grid=document.querySelector('#letter-grid');if(grid){grid.replaceChildren();alphabet.forEach(a=>grid.append(cardLetter(a)))}
 const unitsGrid=document.querySelector('#unit-grid');if(unitsGrid){unitsGrid.replaceChildren();units.forEach((u,i)=>unitsGrid.append(cardUnit(u,i)))}
}

const illustratedWords=new Set(ALL_WORDS);
const voiceRows=new Map(AUDIO_ROWS.map((r,i)=>[r[0]+'|'+r[1]+'|'+r[2],i]));
const audioUrl=(id,voice)=>'/assets/audio/'+voice+'/'+String(id).padStart(3,'0')+'.mp3';
const cachedAudio=new Map();
const CACHE_LIMIT=4;
const SPEED_OPTIONS=[
 [0.7,'بطيء جدًا','Very slow'],
 [0.85,'بطيء','Slow'],
 [1,'طبيعي','Normal'],
 [1.15,'أسرع','Faster']
];
const storedSpeed=Number(localStorage.getItem('rvu-playback-speed'));
let playbackSpeed=SPEED_OPTIONS.some(option=>option[0]===storedSpeed)?storedSpeed:1;
function applyPlaybackSpeed(player){
 player.playbackRate=playbackSpeed;
 if('preservesPitch' in player)player.preservesPitch=true;
}
let activeButton=null;
function audioFor(url){
 if(cachedAudio.has(url)){
  const existing=cachedAudio.get(url);
  cachedAudio.delete(url);cachedAudio.set(url,existing);applyPlaybackSpeed(existing);return existing;
 }
 const player=new Audio();player.preload='auto';player.src=url;applyPlaybackSpeed(player);
 cachedAudio.set(url,player);
 if(cachedAudio.size>CACHE_LIMIT){
  for(const [key,candidate] of cachedAudio){
   if(candidate!==currentAudio){cachedAudio.delete(key);candidate.preload='none';candidate.removeAttribute('src');candidate.load();break}
  }
 }
 return player;
}
function stopAudio(){
 if(currentAudio){
  currentAudio.pause();currentAudio.currentTime=0;
  currentAudio=null;
 }
 if(activeButton){activeButton.classList.remove('audio-playing');activeButton=null}
}
const REPORTED_WRONG_WORD_AUDIO=new Set(['fish','fork']);
let preferredVoice=localStorage.getItem('rvu-voice')==='male'?'male':'female';
let currentAudio=null;
function pronunciationSpeedPicker(){
 const field=el('label','pronunciation-speed');
 const label=el('span','speed-label',lang==='ar'?'سرعة النطق':'Pronunciation speed');
 const select=el('select','speed-select');
 select.setAttribute('aria-label',label.textContent);
 for(const [rate,ar,en] of SPEED_OPTIONS){
  const option=el('option',null,(lang==='ar'?ar:en)+' · '+rate+'×');
  option.value=String(rate);
  select.append(option);
 }
 select.value=String(playbackSpeed);
 select.addEventListener('change',()=>{
  const next=Number(select.value);
  if(!SPEED_OPTIONS.some(option=>option[0]===next))return;
  playbackSpeed=next;
  localStorage.setItem('rvu-playback-speed',String(next));
  for(const player of cachedAudio.values())applyPlaybackSpeed(player);
  document.querySelectorAll('.speed-select').forEach(control=>{control.value=String(next)});
 });
 field.append(label,select);
 return field;
}
function voicePicker(){
 const section=el('section','voice-picker');
 section.setAttribute('aria-label',lang==='ar'?'اختيار صوت النطق':'Choose the lesson voice');
 section.append(el('span','voice-label',lang==='ar'?'اختار الصوت':'Choose voice'));
 for(const [id,kind,ar,en] of [
  ['female','girl','بنت','Girl'],
  ['male','boy','ولد','Boy']
 ]){
  const b=el('button','voice-choice');b.type='button';b.dataset.voice=id;
  b.setAttribute('aria-pressed',String(preferredVoice===id));
  b.setAttribute('aria-label',lang==='ar'?'صوت '+ar:en+' voice');
  const portrait=el('span','character-portrait voice-avatar '+kind);
  portrait.setAttribute('aria-hidden','true');
  const label=el('span','voice-choice-label',lang==='ar'?ar:en);
  b.append(portrait,label);
  b.addEventListener('click',()=>{
   preferredVoice=id;localStorage.setItem('rvu-voice',id);stopAudio();
   document.querySelectorAll('[data-voice]').forEach(node=>
    node.setAttribute('aria-pressed',String(node.dataset.voice===id))
   );
  });
  section.append(b);
 }
 section.append(pronunciationSpeedPicker());
 return section;
}
function playButton(type,lesson,value){
 const id=voiceRows.get(type+'|'+lesson+'|'+value);if(id===undefined)return null;
 const b=el('button','audio-play',lang==='ar'?'🔊 اسمع':'🔊 Listen');b.type='button';
 b.setAttribute('aria-label',(lang==='ar'?'استمع إلى ':'Listen to ')+value);
 const blocked=type==='word'&&REPORTED_WRONG_WORD_AUDIO.has(value);
 if(blocked){
  b.disabled=true;b.textContent=lang==='ar'?'النطق قيد التصحيح':'Pronunciation under correction';
  b.setAttribute('aria-label',b.textContent+' — '+value);
  return b;
 }
 const prepare=()=>{
  const connection=navigator.connection;
  if(connection?.saveData||/2g/.test(connection?.effectiveType||''))return;
  audioFor(audioUrl(id,preferredVoice));
 };
 b.addEventListener('pointerenter',prepare,{passive:true});
 b.addEventListener('focus',prepare);
 b.addEventListener('click',()=>{
  stopAudio();
  const player=audioFor(audioUrl(id,preferredVoice));
  currentAudio=player;activeButton=b;
  player.currentTime=0;
  b.classList.add('audio-playing');
  const restore=()=>{
   b.classList.remove('audio-playing');
   if(currentAudio===player){currentAudio=null;activeButton=null}
  };
  player.addEventListener('ended',restore,{once:true});
  player.addEventListener('error',restore,{once:true});
  player.play().catch(()=>{
   restore();b.textContent=lang==='ar'?'جرّب تاني':'Retry audio';
  });
 });
 return b;
}
function renderWordCard(word,lesson,i){
 const card=el('article','word-card');
 const zoom=el('button','word-zoom');zoom.type='button';
 zoom.setAttribute('aria-label',(lang==='ar'?'تكبير صورة ':'Enlarge picture of ')+word);
 zoom.setAttribute('aria-pressed','false');zoom.append(wordVisual(word));
 zoom.addEventListener('click',()=>{const enlarged=zoom.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(enlarged))});
 card.append(zoom);
 const label=el('strong','english-word',word);label.lang='en';label.dir='ltr';card.append(label);
 const play=playButton('word',lesson,word);if(play)card.append(play);
 card.append(el('span','word-counter',String(i+1).padStart(2,'0')));
 return card;
}
function wordLibrary(){
 const root=document.getElementById('word-library');if(!root)return;
 root.replaceChildren(
  el('h1',null,lang==='ar'?'كلمات الكتاب حسب الصفحات والحروف':'Book words by page and letter'),
  el('p','word-help',lang==='ar'?'كل صفحتين متقابلتين لهما نفس كلمات الحرف. اختار حرف أو رقم أي صفحة من الصفحتين علشان تسمع الكلمات وتشوف صورها.':'Facing pages share one set of letter words. Choose a letter or either printed page number to view its vocabulary.'),
  voicePicker()
 );
 const picker=el('section','spread-picker');
 const control=el('div','spread-controls');
 const letterControl=el('label','spread-field');
 letterControl.append(el('span',null,lang==='ar'?'اختار الحرف والصفحتين':'Choose letter and facing pages'));
 const letterSelect=el('select','spread-select');
 letterSelect.id='letter-spread-select';
 for(const item of alphabet){
  const option=el('option',null,(lang==='ar'?'حرف ':'Letter ')+item.letter+' — '+(lang==='ar'?'صفحتا ':'Pages ')+printedPages(item.pages).join('–'));
  option.value=item.id;letterSelect.append(option);
 }
 letterControl.append(letterSelect);control.append(letterControl);
 const numberControl=el('label','spread-field');
 numberControl.append(el('span',null,lang==='ar'?'أو اكتب رقم الصفحة':'Or enter a page number'));
 const pageInput=el('input','spread-page-number');pageInput.type='number';
 pageInput.min='1';pageInput.max='52';pageInput.step='1';pageInput.inputMode='numeric';
 pageInput.id='printed-page-input';pageInput.placeholder='1–52';
 numberControl.append(pageInput);control.append(numberControl);
 const go=el('button','spread-go',lang==='ar'?'اعرض الصفحة':'Show page');go.type='button';control.append(go);
 picker.append(control);
 const message=el('p','spread-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');picker.append(message);
 const letters=el('div','spread-letter-tiles');
 letters.setAttribute('aria-label',lang==='ar'?'اختيار سريع للحروف':'Quick letter selection');
 const tiles=new Map();
 for(const item of alphabet){
  const b=el('button','spread-letter-button');
  b.type='button';b.dataset.letter=item.id;
  b.append(el('strong',null,item.letter),el('small',null,printedPages(item.pages).join('–')));
  b.setAttribute('aria-label',(lang==='ar'?'حرف ':'Letter ')+item.letter+' — '+(lang==='ar'?'صفحتا ':'Pages ')+printedPages(item.pages).join(' و '));
  letters.append(b);tiles.set(item.id,b);
 }
 picker.append(letters);root.append(picker);
 const display=el('section','spread-result');display.id='selected-book-spread';root.append(display);
 const initialHash=()=>decodeURIComponent(location.hash.replace(/^#/,'')).toLowerCase();
 function showSpread(id,changeHash=true){
  const item=alphabet.find(a=>a.id===id);if(!item)return;
  const pages=printedPages(item.pages);
  letterSelect.value=item.id;
  pageInput.value=String(pages[0]);
  message.textContent='';
  for(const [key,b] of tiles)b.setAttribute('aria-pressed',String(key===id));
  display.replaceChildren();
  const heading=el('h2','spread-title',(lang==='ar'?'حرف ':'Letter ')+item.letter+' — '+(lang==='ar'?'الصفحتان ':'Pages ')+pages.join('–'));
  heading.id='spread-heading';display.append(heading);
  const info=el('p','spread-intro',lang==='ar'?'الكلمات الموجودة في الصفحتين '+pages.join(' و ')+':':'Vocabulary shared by pages '+pages.join(' & ')+':');
  display.append(info);
  const grid=el('div','word-grid library-grid');
  item.words.forEach((word,i)=>grid.append(renderWordCard(word,item.id,i)));
  display.append(grid);
  const lesson=link(urlLetter(item),lang==='ar'?'افتح درس حرف '+item.letter+' كاملًا':'Open the complete '+item.letter+' lesson','spread-lesson-link');
  display.append(lesson);
  if(changeHash)history.replaceState(null,'','#letter-'+item.id);
 }
 letterSelect.addEventListener('change',()=>showSpread(letterSelect.value));
 for(const item of alphabet)tiles.get(item.id).addEventListener('click',()=>showSpread(item.id));
 function selectByPage(){
  const n=Number(pageInput.value);
  const item=alphabet.find(a=>printedPages(a.pages).includes(n));
  if(!Number.isInteger(n)||!item){
   message.textContent=lang==='ar'?'اختار رقم صفحة من 1 إلى 52.':'Enter a page number from 1 to 52.';
   return;
  }
  showSpread(item.id);
 }
 go.addEventListener('click',selectByPage);
 pageInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();selectByPage()}});
 window.addEventListener('hashchange',()=>{
  const match=/^letter-([a-z])$/.exec(initialHash());
  if(match)showSpread(match[1],false);
 });
 const match=/^letter-([a-z])$/.exec(initialHash());
 const pageQuery=new URLSearchParams(location.search).get('page');
 const byPage=alphabet.find(a=>printedPages(a.pages).includes(Number(pageQuery)));
 showSpread(match?.[1]||byPage?.id||'a',false);
}

function wordVisual(w){
 const box=el('div','word-visual story-visual');
 if(illustratedWords.has(w)){
  const image=el('img','word-image');image.src='/assets/words/'+w.replaceAll(' ','-')+'.svg';
  image.alt=w;image.loading='lazy';image.decoding='async';image.width=192;image.height=192;box.append(image);
 }else{box.append(el('span','word-icon',icons[w]||w[0].toUpperCase()))}
 return box;
}
function createCast(compact=false){
 const cast=el('div','storybook-cast'+(compact?' compact-cast':''));
 cast.setAttribute('aria-label',lang==='ar'?'أبطال RVU Kids من الغلاف الأصلي':'Original RVU Kids book characters');
 for(const [type,arLabel,enLabel] of [
  ['boy','الولد صاحب الهودي الأزرق','The boy in his blue hoodie'],
  ['lizard','الليزرد الزرقاء الكيوت','The cute blue lizard'],
  ['girl','البنت بفستانها الوردي','The girl in her pink dress']
 ]){
  const portrait=el('span','character-portrait '+type);
  portrait.setAttribute('role','img');
  portrait.setAttribute('aria-label',lang==='ar'?arLabel:enLabel);
  cast.append(portrait);
 }
 const caption=el('span','cast-note',t('castWelcome'));cast.append(caption);
 return cast;
}
function decorateLearning(){
 const staticCast=document.querySelector('.hero .storybook-cast');
 if(staticCast){
  const label=staticCast.querySelector('[data-storybook-cast-caption]');if(label)label.textContent=t('castWelcome');
  return;
 }
 if(document.body.dataset.page==='alphabet-index'){
  const hero=document.querySelector('.hero');if(hero)hero.append(createCast());
 }
}
function lessonBreadcrumb(target){
 const c=el('nav','crumbs');c.setAttribute('aria-label','Breadcrumb');c.append(link('/', 'RVU Kids'));c.append(document.createTextNode(' / '));c.append(link('/learn/',t('hub')));c.append(document.createTextNode(' / '+target));return c
}
function lessonTemplate(type,d,idx){
 const root=document.querySelector('#lesson-root');root.replaceChildren();
 const head=el('section','lesson-top');head.append(lessonBreadcrumb(type==='alphabet'?t('alph'):t('sent')));
 const shell=el('div','lesson-card');
 shell.style.setProperty('--rvu-lesson-accent',['#fdd76b','#97d6c6','#f3aca5','#8fc5e6','#e0c2f3','#ecc686'][idx%6]);
 const caption=el('span','lesson-kicker',(type==='alphabet'?'ALPHABET & WORDS':'EVERYDAY ENGLISH')+' · '+t('pages')+': '+printedPages(d.pages).join('–'));
 const heading=el('h1','lesson-title',type==='alphabet'?d.letter+' '+d.letter.toLowerCase():d.title);heading.dir='ltr';heading.lang='en';
 const sub=el('p','lesson-sub',type==='alphabet'?(lang==='ar'?'حرف '+d.letter:'Letter '+d.letter):(lang==='ar'?d.titleAr:'Unit '+String(idx+1).padStart(2,'0')));
 shell.append(caption,heading,sub,createCast(true),voicePicker());
  if(type==='alphabet'){
   const pages=printedPages(d.pages);
   const jump=link('/learn/words/#letter-'+d.id,
     lang==='ar'?'شوف كلمات الصفحتين '+pages.join('–')+' بالصور':'See pictures for pages '+pages.join('–'),
     'spread-lesson-link lesson-words-link');
   const jumpIcon=el('span','lesson-words-icon','📖');jumpIcon.setAttribute('aria-hidden','true');
   jump.prepend(jumpIcon);
   shell.append(jump);
  }
 if(type==='alphabet'){
  if(d.id==='a'||d.id==='m'){const page=el('img','real-page');page.src=d.id==='a'?'/assets/letter-a.webp':'/assets/letter-m.webp';page.alt='Actual teaching page from Rvu Alphabet Book — letter '+d.letter;page.loading='lazy';shell.append(page)}
  const letterCard=el('div','letter-name');
  const nameText=el('div','letter-name-copy');
  nameText.append(el('span','letter-name-label',t('say')));
  const value=el('b','letter-name-value',d.letterName);value.dir='ltr';value.lang='en';
  nameText.append(value);letterCard.append(nameText);
  const nameSound=playButton('letter-name',d.id,d.letter);
  if(nameSound){const action=el('div','letter-name-action');action.append(nameSound);letterCard.append(action)}
  shell.append(letterCard);
 }
 const title=el('h2','minor-heading',type==='alphabet'?t('words'):t('sentences'));shell.append(title);
 if(type==='alphabet'){
  const g=el('div','word-grid');d.words.forEach((w,i)=>g.append(renderWordCard(w,d.id,i)));shell.append(g)
 }else{
  if(d.id==='feelings'){const image=el('img','real-page');image.src='/assets/feelings.webp';image.alt='Actual feelings page from Rvu Alphabet Book';image.loading='lazy';shell.append(image)}
  if(d.words.length){const labels=el('div','support-words');labels.append(el('p',null,lang==='ar'?'كلمات موجودة في الدرس:':'Vocabulary in this lesson:'));d.words.forEach(w=>{const word=el('span',null,w);word.lang='en';word.dir='ltr';labels.append(word)});shell.append(labels)}
 }
 if(d.sentences?.length){if(type==='alphabet')shell.append(el('h2','minor-heading',t('sentences')));const g=el('div','phrase-grid');d.sentences.forEach((s,i)=>{const c=el('div','phrase-card');c.append(el('span','number',String(i+1).padStart(2,'0')));const p=el('strong','phrase-text',s);p.lang='en';p.dir='ltr';c.append(p);const play=playButton(type==='alphabet'?'alphabet-sentence':'everyday-sentence',d.id,s);if(play)c.append(play);g.append(c)});shell.append(g)}

 const gameMount=el('div','rvu-game-mount');shell.append(gameMount);
 if(!document.querySelector('link[data-rvu-game-style]')){
   const sheet=el('link');sheet.rel='stylesheet';sheet.href='/learn/activities.css';
   sheet.dataset.rvuGameStyle='true';document.head.append(sheet);
 }
 import('/learn/activities.mjs').then(module=>{
   module.mountActivities(gameMount,{type,lesson:d,lang,playButton,wordVisual});
 }).catch(()=>{gameMount.remove()});
 const prev=type==='alphabet'?alphabet[idx-1]:units[idx-1],next=type==='alphabet'?alphabet[idx+1]:units[idx+1];
 const nav=el('nav','lesson-nav');nav.setAttribute('aria-label','Lesson navigation');nav.append(link(prev?(type==='alphabet'?urlLetter(prev):urlUnit(prev)):(type==='alphabet'?'/learn/alphabet/':'/learn/sentences/'),'← '+(prev?(type==='alphabet'?prev.letter:prev.title):t('learn'))));nav.append(link(type==='alphabet'?'/learn/alphabet/':'/learn/sentences/',type==='alphabet'?t('all'):t('allSent')));nav.append(link(next?(type==='alphabet'?urlLetter(next):urlUnit(next)):(type==='alphabet'?'/learn/sentences/':'/learn/'),(next?(type==='alphabet'?next.letter:next.title):t('learn'))+' →'));shell.append(nav);
 head.append(shell);root.append(head)
}

function lessons(){
 const path=location.pathname.split('/').filter(Boolean);
 if(path[1]==='alphabet'&&path[2]){const idx=alphabet.findIndex(l=>l.id===path[2]);if(idx>=0){lessonTemplate('alphabet',alphabet[idx],idx);return}}
 if(path[1]==='sentences'&&path[2]){const idx=units.findIndex(u=>u.id===path[2]);if(idx>=0){lessonTemplate('sentences',units[idx],idx);return}}
 if(path[1]==='sentences'&&!path[2]){const root=document.querySelector('#lesson-root');root.innerHTML='<section class="hero compact"><span class="eyebrow">Everyday English</span><h1>'+t('sent')+'</h1><p>'+t('practice')+'</p></section>';const g=el('div','unit-grid');units.forEach((u,i)=>g.append(cardUnit(u,i)));root.append(g);return}
 const root=document.querySelector('#lesson-root');root.innerHTML='<section class="lesson-card"><h1>Lesson not found</h1><a href="/learn/">Learning Hub</a></section>';
}
function preview(){
 const figs=[...document.querySelectorAll('.preview-five figure')];
 let index=0;const dlg=el('dialog','page-dialog');const btn=el('button','dialog-close','×');btn.type='button';btn.setAttribute('aria-label','Close preview');const image=el('img','dialog-image');const cap=el('p','dialog-caption');const controls=el('div','dialog-controls');const prev=el('button','button ghost','←');const next=el('button','button ghost','→');prev.type='button';next.type='button';controls.append(prev,next);dlg.append(btn,image,cap,controls);document.body.append(dlg);
 function show(i){index=(i+figs.length)%figs.length;image.classList.remove('page-turn');image.src=figs[index].querySelector('img').src;image.alt=figs[index].querySelector('img').alt;cap.textContent=(index+1)+' / '+figs.length+' — '+figs[index].querySelector('figcaption').textContent;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){void image.offsetWidth;image.classList.add('page-turn')}}
 btn.addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(index+1);else if(e.key==='ArrowLeft')show(index-1)});
 figs.forEach((figure,i)=>{figure.tabIndex=0;figure.setAttribute('role','button');figure.setAttribute('aria-label','Preview page '+(i+1));const open=()=>{show(i);dlg.showModal()};figure.addEventListener('click',open);figure.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})})
}

function translateStatic(){
 if(lang!=='en')return;
 if(document.body.dataset.page==='alphabet-index'){
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='Every letter.<br><em>Its own little world.</em>';hero.querySelector('p').textContent='Explore A–Z and the exact words and sentences from Rvu Alphabet Book. Listen to the approved American-English audio inside lessons.';const a=hero.querySelectorAll('.hero-actions a');if(a[0])a[0].textContent='Back to Learning Hub';if(a[1])a[1].textContent='Book Preview'}
  const title=document.querySelector('#letters-title');if(title)title.textContent='Choose a letter';const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 printed pages, made to order.';cta.querySelector('a').textContent='Order the book'}
 }
 if(document.body.dataset.page==='hub'){
  const playTitle=document.querySelector('[data-play-title]');if(playTitle)playTitle.textContent='Four playful games in every lesson!';
  const summary=document.querySelector('[data-play-description]');if(summary)summary.textContent='Practise real-life situations, word order, pictures and listening. Correct answers bring gentle stars and cheerful celebrations.';
  const button=document.querySelector('[data-play-link]');if(button)button.textContent='Try the polite words game 🎉';
  const title=document.querySelector('[data-hub-parent-title]');if(title)title.textContent='Using the book with a child aged 3–6?';
  const help=document.querySelector('[data-hub-parent-text]');if(help)help.textContent='See our short parent guide for age-appropriate, low-pressure activities.';
  const parentLink=document.querySelector('[data-hub-parent-link]');if(parentLink)parentLink.textContent='Parent guide ↗';
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='A book to hold.<br><em>A world to explore.</em>';hero.querySelector('p').textContent='Discover letter lessons and Everyday English alongside the printed Rvu Alphabet Book. The learning paths are ready; American English audio is ready to play in every lesson.';const a=hero.querySelectorAll('.hero-actions a');if(a[0])a[0].textContent='Explore Lessons';if(a[1])a[1].textContent='Preview Five Real Pages'}
  const cards=document.querySelectorAll('.path-card');if(cards[0]){cards[0].querySelector('small').textContent='LEARNING PATH 01';cards[0].querySelector('p').textContent='26 individual A–Z lessons with the exact words from the approved book.'}if(cards[1]){cards[1].querySelector('small').textContent='LEARNING PATH 02';cards[1].querySelector('p').textContent='15 separate units about everyday communication, organized around the printed book.'}
  const hs=document.querySelectorAll('.section-head h2');if(hs[0])hs[0].textContent='Choose a letter';if(hs[1])hs[1].textContent='Everyday conversations';
  const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 printed pages, made to order, for children ages 3–6.';cta.querySelector('a').textContent='Order the book'}
 }
 if(document.body.dataset.page==='preview'){
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='Five real pages.<br><em>A closer look inside.</em>';hero.querySelector('p').textContent='Five individual physical pages at most—not five double-page spreads. These are selected pages from the actual book.'}
  const captions=['The book cover','Letter A — illustrated words','Letter A — tracing and writing','Everyday English','Letter M — moon, milk, monkey, mouse'];document.querySelectorAll('.preview-five figcaption').forEach((n,i)=>n.textContent=captions[i]);
  const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 pages. Printed on demand in Mit Ghamr, Egypt.';cta.querySelector('a').textContent='Order your copy'}
 }
 if(location.pathname.startsWith('/books/alphabet/')){
  const badges=['pages','alphabet lessons','Everyday English units','years'];document.querySelectorAll('.feature-strip article span').forEach((n,i)=>n.textContent=badges[i]||'');
  const head=document.querySelector('.section .section-head h2');if(head)head.textContent='A printed workbook connected to digital learning';
  const sections=[['See','Illustrated scenes help children connect letters, words and meaning.'],['Try','Trace, write, match, choose and review inside the printed book.'],['Keep learning','Explore our Alphabet and Everyday English lessons. Choose either American voice and press Listen.']];document.querySelectorAll('.three article').forEach((article,i)=>{if(sections[i]){article.querySelector('h3').textContent=sections[i][0];article.querySelector('p').textContent=sections[i][1]}});
  const h=document.querySelector('.product-copy');if(h){const paras=h.querySelectorAll('p');if(paras[0])paras[0].textContent='A colorful 96-page workbook for ages 3–6, combining letters, handwriting, activities, and Everyday English.';if(paras[1])paras[1].textContent='Shipping is calculated by governorate. Printing takes approximately one day after payment verification.';const links=h.querySelectorAll('.hero-actions a');if(links[0])links[0].textContent='Order the Book';if(links[1])links[1].textContent='Preview Five Pages';if(links[2])links[2].textContent='Explore Learning Hub'}
  const c=document.querySelector('.cta');if(c){c.querySelector('h2').textContent='Made especially for your child';c.querySelector('p').textContent='Printing starts only after we verify payment.';c.querySelector('a').textContent='Start your order'}
 }
}

function mountStandaloneSpeedPicker(){
 const page=document.body.dataset.page;
 const parts=location.pathname.split('/').filter(Boolean);
 if(page!=='hub'&&page!=='alphabet-index'&&!(page==='lesson'&&!parts[2]))return;
 const hero=document.querySelector('.hero');
 if(!hero)return;
 const wrapper=el('div','standalone-speed-picker');
 wrapper.append(pronunciationSpeedPicker());
 hero.append(wrapper);
}
renderNavLang();
translateStatic();
decorateLearning();
const p=document.body.dataset.page;if(p==='hub'||p==='alphabet-index')hub();if(p==='lesson')lessons();if(p==='words')wordLibrary();if(p==='preview')preview();
mountStandaloneSpeedPicker();
function enableStoryMotion(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('.word-card,.unit-card,.tile-letter,.path-card,.preview-five figure,.story-character')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('story-visible');observer.unobserve(entry.target)}}},{threshold:0.07,rootMargin:'0px 0px 36px 0px'});
 for(const target of targets){target.classList.add('story-reveal');observer.observe(target)}
}
enableStoryMotion();
