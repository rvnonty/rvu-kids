import {mountMotionWorld} from './home-motion.mjs?v=20261113-world';
export function buildOrderMessage(copies,language='ar'){
 if(!Number.isInteger(copies)||copies<1||copies>20)throw new RangeError('Choose between 1 and 20 copies');
 return language==='en'?['Hello RVU Kids! I would like to order Rvu Alphabet Book.','Copies: '+copies,'Please share the order and delivery details.']:['أهلًا RVU Kids! عاوز أطلب Rvu Alphabet Book.','عدد النسخ: '+copies,'من فضلك ابعتلي تفاصيل الطلب والتوصيل.'];
}
export function buildOrderUrl(copies,language='ar'){
 const fields=buildOrderMessage(copies,language);
 return 'https://wa.me/201012809358?text='+encodeURIComponent(fields.join('\n'));
}
const en = {
skip:'Skip to content',announcement:'A book to hold. A world to explore together.',navInside:'Discover the book',navTogether:'Book + website',navLearn:'Learn & play',navPreview:'Look inside',navOrder:'Order the book ↗',age:'For little explorers, ages 3–6',
heroTitle:'A little book.<br><em>A BIG adventure!</em>',heroOrderAction:'Order the book ↗',heroTry:'Try listening & playing ↓',onlineTag:'Listen, play & explore!',heroDescription:'A first English adventure, one picture at a time. A 100-page illustrated workbook, with a companion website for American English audio, letters, words and play.',heroLearn:'Try learning & listening <span aria-hidden="true">↗</span>',heroPreview:'Discover the book ↓',heroNote:'Their book friends, every step of the way.<br><strong>Look · listen · repeat · try</strong>',phoneListen:'Listen & repeat',phoneCaption:'From the page to play',pagesBadge:'pages of<br>discovery',actualCover:'Created with imagination by',benefit1:'Illustrated letters & words',benefit2:'Pages to explore & practise',benefit3:'Everyday English units',benefit4:'Audio & interactive activities',
listenEyebrow:'Give it a little listen',listenTitle:'Listen clearly.<br><em>Repeat at their pace.</em>',listenIntro:'American English words and sentences to practise together. Choose a voice, set a comfortable speed, and hear the same word again whenever you like.',listenFeature1:'Choose a girl or boy voice',listenFeature2:'Normal or slower playback, with replay',listenFeature3:'Separate letter name, letter sound, word and sentence',openLesson:'Keep exploring letter A ↗',labTitle:'A little taste of the letter A adventure',labKicker:'Look at the picture. Hear the word.',voiceFemale:'Girl',voiceMale:'Boy',speedLabel:'Audio speed',speedNormal:'Normal',speedSlow:'Slow',speedVerySlow:'Very slow',letterName:'Letter name',letterSound:'Letter sound',wordLabel:'The word',sentenceLabel:'The sentence',audioReady:'Press a listen button and say it with us.',
togetherEyebrow:'One adventure, on paper and on screen',togetherTitle:'The same lesson.<br><em>More ways to learn.</em>',togetherIntro:'The book is a place for pencils and practice. The website adds listening and interaction. Open the same letter or lesson pages and keep learning together.',paperLabel:'01 / IN THE BOOK',paperTitle:'Pick up a pencil. Give it a try.',paperText:'Explore letters, connect words to pictures, and practise tracing, writing and choosing.',screenLabel:'02 / ON THE WEBSITE',screenTitle:'Listen. Repeat. Join in.',screenText:'Hear the same words and sentences, choose a playback speed, and try picture and listening games.',pageShortcutTitle:'Already have the book open?',pageShortcutText:'Choose the printed page number or letter to find its words, pictures and audio.',pageShortcutAction:'Find your page’s words ↗',
whyEyebrow:'From their first letter to a little sentence',whyTitle:'Every page.<br><em>A new little beginning.</em>',whyIntro:'Illustrated worlds, varied activities, and words to use together in everyday life.',whyLettersTitle:'Letters with a story',whyLettersText:'Uppercase and lowercase A–Z, with words connected to pictures and meaning.',whyWordsTitle:'Little hands. Plenty of practice.',whyWordsText:'Trace, write, match and choose, at a pace that suits your child’s readiness.',whySentencesTitle:'English from their everyday world',whySentencesText:'15 units about feelings, family, food, play, polite words and other familiar situations.',celebrateText:'<strong>Celebrate every little step!</strong> Reviews, challenges and a final certificate in the book to celebrate their effort together.',
playEyebrow:'Keep learning through play',playTitle:'Beyond the page,<br><em>the adventure continues.</em>',playIntro:'Illustrated lessons, listening, picture choices and word-order games, with characters encouraging another try. Open a lesson on a phone or computer and jump right in.',tag1:'No account needed',tag2:'Letters & everyday situations',tag3:'Pictures, audio & interaction',playAction:'Enter the learning world ↗',gameEyebrow:'Try a little game',gameTitle:'Where is the apple?',gameHint:'Listen to the word, then choose its picture.',gameMore:'More games in the lesson ↗',
previewEyebrow:'Take a closer look',previewTitle:'Real pages.<br><em>From the real book.</em>',previewIntro:'Selected pages from the actual book. Tap a page to enlarge it, or open the page-turning preview.',flipAction:'Turn the book’s pages ↗',digitalPreview:'Exactly five real pages: cover, letter A, A practice, Feelings, and letter M.',
faqEyebrow:'Before the first adventure',faqTitle:'Little questions.<br>A confident beginning.',faq1q:'What age is the book for?',faq1a:'Children ages 3–6, alongside a parent or guardian. Begin with pictures and listening, then introduce writing and activities as your child is ready.',faq2q:'Is this a printed book or a file?',faq2a:'You order a printed, 96-page Rvu Alphabet Book. The website complements it with lessons, audio and activities.',faq3q:'How do we use the book with the website?',faq3a:'Open the letter or everyday situation you are exploring, or choose a printed page in the word library. Look in the book, listen online, and try the activity together.',faq4q:'Is the audio available? Can we slow it down?',faq4a:'Yes. Listen to American English words and sentences, choose a girl or boy voice and a comfortable speed, and replay as needed. This sample separates the letter name and sound; the full lessons offer words and sentences to practise.',faq5q:'Do we need an account or our child’s details?',faq5a:'No. Lessons are open without accounts or progress tracking. We do not request a child’s name or personal details to use the website.',faq6q:'How do I order the book?',faq6a:'Choose “Order the book on WhatsApp”, review the prepared message and press Send. We will arrange the order and delivery details in that conversation.',
orderEyebrow:'One book. So many beginnings.',orderTitle:'Start the first page.<br><em>Keep exploring together.</em>',orderIntro:'A book that opens the door to curiosity, and a website to keep learning through pictures, listening and play. We will arrange your order and delivery details on WhatsApp.',quantityLabel:'Number of copies',submitOrder:'Order the book on WhatsApp ↗',orderLearn:'Or try a lesson now ↗',orderPrivacy:'No payment on this website. No child’s personal details requested.',orderBookNote:'Little beginnings.<br>One step at a time.',footerLine:'Small beginnings. Growing curiosity.',footerPlace:'Printed with love in Mansoura, Egypt'
};
if(typeof document!=='undefined'){
const ar = Object.fromEntries([...document.querySelectorAll('[data-i18n]')].map(el=>[el.dataset.i18n,el.innerHTML]));
const previews=[['letter-a','حرف A وحكايته','The letter A','حروف وكلمات مصوّرة','Letters & illustrated words'],['practice-a','وقت التجربة','Time to try','تتبّع، كتابة واختيار','Trace, write & choose'],['feelings','نتكلم عن مشاعرنا','Let’s talk about feelings','إنجليزي من الحياة اليومية','Everyday English'],['letter-m','حرف M وحكايته','The letter M','moon · milk · monkey · mouse','moon · milk · monkey · mouse']];
const readStorage=(key,storage=localStorage)=>{try{return storage.getItem(key)}catch{return null}};
const writeStorage=(key,value,storage=localStorage)=>{try{storage.setItem(key,value)}catch{}};
const requestedLang=new URLSearchParams(location.search).get('lang');
let lang=['ar','en'].includes(requestedLang)?requestedLang:(readStorage('rvu-lang',sessionStorage)==='en'?'en':'ar');
const isEn=()=>lang==='en';
let preferredVoice=readStorage('rvu-voice')==='male'?'male':'female';
let playbackSpeed=[1,0.85,0.7].includes(Number(readStorage('rvu-playback-speed')))?Number(readStorage('rvu-playback-speed')):1;
let activeAudio=null,activeButton=null,audioToken=0,activePreview=0;
const audioCache=new Map();
function stopAudio(){
 audioToken++;
 if(activeAudio){activeAudio.pause();activeAudio.currentTime=0;activeAudio=null}
 if(activeButton){activeButton.classList.remove('is-playing');activeButton.setAttribute('aria-pressed','false');activeButton=null}
}
function setStatus(state){
 const text={ready:[ar.audioReady,en.audioReady],playing:['اسمع وكرّر على مهلك.','Listen, then repeat at your pace.'],error:['الصوت مش متاح دلوقتي. جرّب تاني أو افتح الدرس.','Audio is unavailable right now. Try again or open the lesson.']};
 document.querySelector('#audio-status').textContent=text[state][isEn()?1:0];
}
async function playAudio(button){
 const wasPlaying=activeButton===button;
 stopAudio();
 if(wasPlaying){setStatus('ready');return}
 const token=audioToken;
 const url='/assets/audio/'+preferredVoice+'/'+button.dataset.audio+'.mp3';
 let player=audioCache.get(url);
 if(!player){player=new Audio(url);player.preload='none';audioCache.set(url,player)}
 activeAudio=player;activeButton=button;
 player.playbackRate=playbackSpeed;
 if('preservesPitch' in player)player.preservesPitch=true;
 button.classList.add('is-playing');button.setAttribute('aria-pressed','true');
 setStatus('playing');
 const done=()=>{if(token===audioToken){stopAudio();setStatus('ready')}};
 player.onended=done;
 player.onerror=()=>{if(token===audioToken){stopAudio();setStatus('error')}};
 try{await player.play()}catch{if(token===audioToken){stopAudio();setStatus('error')}}
}
function renderVoices(){
 document.querySelectorAll('[data-voice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.voice===preferredVoice)));
 document.querySelector('#demo-speed').value=String(playbackSpeed);
}
function showPreviewAt(i){
 activePreview=(i+previews.length)%previews.length;
 const p=previews[activePreview],img=document.querySelector('#preview-image');
 img.src='./assets/'+p[0]+'.webp';img.alt=p[isEn()?2:1];
 document.querySelector('#preview-caption').textContent=(activePreview+1)+' / '+previews.length+' · '+img.alt;
}
function renderPreviews(){
 const grid=document.querySelector('#preview-grid');grid.replaceChildren();
 previews.forEach((p,i)=>{
  const button=document.createElement('button');button.type='button';button.className='preview-card';
  const label=p[isEn()?2:1];button.setAttribute('aria-label',(isEn()?'Enlarge: ':'تكبير: ')+label);
  button.innerHTML='<div class="preview-frame"><img src="./assets/'+p[0]+'.webp" width="900" height="1273" loading="lazy" decoding="async" fetchpriority="low" alt="'+label+'"><span class="preview-zoom" aria-hidden="true">↗</span></div><strong>'+label+'</strong><span>'+p[isEn()?4:3]+'</span>';
  button.addEventListener('click',()=>{stopAudio();showPreviewAt(i);document.querySelector('#preview-dialog').showModal()});grid.append(button);
 });
}
function setLanguage(value){
 stopAudio();lang=value;document.documentElement.lang=lang;document.documentElement.dir=isEn()?'ltr':'rtl';
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=((isEn()?en:ar)[el.dataset.i18n]??ar[el.dataset.i18n]).replace(/[↗↙]/g,'<svg class="ui-arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14"/></svg>')});
 const language=document.querySelector('#language');language.textContent=isEn()?'العربية':'English';language.lang=isEn()?'ar':'en';language.setAttribute('aria-label',isEn()?'Switch to Arabic':'التغيير إلى الإنجليزية');
 document.title=isEn()?'RVU Kids | One book. A whole learning adventure.':'RVU Kids | كتاب وموقع لمغامرة تعلّم واحدة';
 const description=isEn()?'A 100-page illustrated English workbook for ages 3–6, with a companion website for American English listening, words and interactive play.':'كتاب إنجليزي مصوّر من 100 صفحة للأطفال من 3 إلى 6 سنوات، وموقع تفاعلي يكمّل الرحلة بالنطق الأمريكي والحروف والكلمات والألعاب والمواقف اليومية.';
 document.querySelector('meta[name="description"]').content=description;
 document.querySelector('meta[property="og:title"]').content=document.title;
 document.querySelector('meta[property="og:description"]').content=description;
 document.querySelector('.header nav').setAttribute('aria-label',isEn()?'Main navigation':'التنقل الرئيسي');
 document.querySelector('.hero-book-figure .book').setAttribute('aria-label',isEn()?'Open the book preview':'افتح معاينة الكتاب');
 const pictureLabels={apple:['تفاحة من رسومات الكتاب','An apple from the book artwork'],airplane:['طائرة','Airplane'],ant:['نملة','Ant']};
 document.querySelectorAll('.sample-picture[role="img"]').forEach(el=>el.setAttribute('aria-label',pictureLabels.apple[isEn()?1:0]));
 document.querySelectorAll('[data-answer]').forEach(el=>el.setAttribute('aria-label',pictureLabels[el.dataset.answer][isEn()?1:0]));
 document.querySelector('.voice-choices').setAttribute('aria-label',isEn()?'Choose the audio voice':'اختيار صوت النطق');
 document.querySelector('.game-options').setAttribute('aria-label',isEn()?'Choose the apple picture':'اختار صورة التفاحة');
 document.querySelector('.game-listen').setAttribute('aria-label',isEn()?'Listen to apple':'اسمع كلمة apple');
 document.querySelector('#quantity').setAttribute('aria-label',isEn()?'Number of book copies':'عدد نسخ الكتاب');
 for(const [selector,a,e] of [['#preview-close','إغلاق المعاينة','Close preview'],['#preview-previous','الصفحة السابقة','Previous page'],['#preview-next','الصفحة التالية','Next page']])document.querySelector(selector).setAttribute('aria-label',isEn()?e:a);
 document.querySelector('.preview-controls').setAttribute('aria-label',isEn()?'Turn preview pages':'تقليب صفحات المعاينة');
 document.querySelector('#form-message').textContent='';
 document.querySelectorAll('[data-answer]').forEach(el=>{el.classList.remove('is-correct','try-again');el.removeAttribute('aria-pressed')});
 document.querySelector('.mini-game').classList.remove('celebrating');
 renderPreviews();renderVoices();setStatus('ready');
 if(document.querySelector('#preview-dialog').open)showPreviewAt(activePreview);
 writeStorage('rvu-lang',lang,sessionStorage);
 window.dispatchEvent(new Event('rvu:languagechange'));
}
document.querySelector('#language').addEventListener('click',()=>{
 setLanguage(isEn()?'ar':'en');const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);
});
document.querySelectorAll('[data-audio]').forEach(button=>{button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>playAudio(button))});
document.querySelectorAll('[data-voice]').forEach(button=>button.addEventListener('click',()=>{
 stopAudio();preferredVoice=button.dataset.voice;writeStorage('rvu-voice',preferredVoice);renderVoices();setStatus('ready');
}));
document.querySelector('#demo-speed').addEventListener('change',event=>{
 playbackSpeed=Number(event.target.value);writeStorage('rvu-playback-speed',String(playbackSpeed));if(activeAudio)activeAudio.playbackRate=playbackSpeed;
});
document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
 const correct=button.dataset.answer==='apple';
 document.querySelectorAll('[data-answer]').forEach(el=>{el.classList.remove('is-correct','try-again');el.setAttribute('aria-pressed',String(el===button))});
 button.classList.add(correct?'is-correct':'try-again');
 document.querySelector('#game-feedback').textContent=correct?(isEn()?'Well done! Apple — you found it.':'برافو! دي التفاحة — apple.'):(isEn()?'Have another try. Listen to the word and look carefully.':'جرّب تاني. اسمع الكلمة وبص للصور على مهلك.');
 document.querySelector('.mini-game').classList.toggle('celebrating',correct);
}));
const dialog=document.querySelector('#preview-dialog');
document.querySelector('#preview-close').addEventListener('click',()=>dialog.close());
document.querySelector('#preview-previous').addEventListener('click',()=>showPreviewAt(activePreview-1));
document.querySelector('#preview-next').addEventListener('click',()=>showPreviewAt(activePreview+1));
dialog.addEventListener('keydown',event=>{
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPreviewAt(activePreview+(event.key==='ArrowRight'?1:-1))}
});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
const form=document.querySelector('#order-form');
form.addEventListener('submit',event=>{
 event.preventDefault();
 const copies=Number(form.elements.quantity.value);
 if(!Number.isInteger(copies)||copies<1||copies>20)return;
 document.querySelector('#form-message').textContent=isEn()?'WhatsApp will open. Review your message and press Send there.':'واتساب هيفتح. راجع الرسالة واضغط إرسال هناك.';
 const url=buildOrderUrl(copies,lang);
 window.location.assign(url);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAudio();setStatus('ready')}});
window.addEventListener('pagehide',stopAudio);
document.querySelector('#year').textContent=String(new Date().getFullYear());
setLanguage(lang);
mountMotionWorld({getLanguage:()=>lang});

}
