'use strict';
const C=window.RVU_CURRICULUM;
if(!C)throw Error('Curriculum unavailable');
const alphabet=C.alphabet,units=C.sentences;
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
ar:{hub:'التعلّم',preview:'المعاينة',book:'الكتاب',listen:'الاستماع',pending:'نعمل على إضافة الصوت الأمريكي بعد مراجعة كل تسجيل. الأزرار الصوتية لن تظهر قبل تجهيز الملفات الحقيقية.',alph:'الحروف والكلمات',sent:'Everyday English — الجمل',words:'كلمات الدرس',sentences:'جمل الدرس',pages:'أرقام الصفحات المطبوعة في الكتاب',say:'اسم الحرف في الكتاب',sound:'صوت الحرف',hint:'اسم الحرف مختلف عن صوت الحرف؛ النطق الصوتي سيتم اعتماده بصورة منفصلة.',remember:'اختبار صغير',question:'اضغط على الكلمة المطلوبة',correct:'إجابة صحيحة!',retry:'جرّب تاني',next:'التالي',prev:'السابق',all:'كل الحروف',allSent:'كل الوحدات',buy:'اطلب الكتاب',practice:'شوف واسمع وكرر مع ولي الأمر',learn:'مكتبة التعلّم',units:'الوحدات',previewPages:'صفحات مختارة',live:'المحتوى مطابق للمنهج المعتمد',learning:'اتعلّم مع كتابك',childHint:'استخدم الصور في الكتاب الأصلي لتأكيد المعنى؛ الرموز هنا للتذكير وليست بديلًا عن رسومات الكتاب.',audioUnavailable:'الصوت لم يُنشر بعد. لن نستخدم صوت الجهاز كأنه تسجيل أمريكي معتمد.',sample:'لمن يشاهد النموذج فقط',more:'افتح الوحدة التالية',begin:'ابدأ',switch:'English'},
en:{hub:'Learning Hub',preview:'Preview',book:'The Book',listen:'Audio',pending:'Natural American English audio will appear after every recording has been reviewed. We will not show fake playback buttons.',alph:'Alphabet & Words',sent:'Everyday English — Sentences',words:'Lesson Words',sentences:'Target Sentences',pages:'Printed page numbers in your book',say:'Letter name in the book',sound:'Letter sound',hint:'A letter name is not the same as its phonics sound. Phonics audio will be reviewed separately.',remember:'A little word check',question:'Choose the requested word',correct:'Well done!',retry:'Try again',next:'Next',prev:'Previous',all:'All letters',allSent:'All units',buy:'Order the Book',practice:'Look, say and practice with a parent',learn:'Learning Hub',units:'Units',previewPages:'Selected pages',live:'Matches the approved curriculum',learning:'Learn alongside your book',childHint:'Check the actual book illustrations for meaning. These small pictograms are memory cues, not replacements for the book artwork.',audioUnavailable:'Audio has not been published yet. We will not substitute a device-generated voice for reviewed American English audio.',sample:'Preview only',more:'Open the next lesson',begin:'Start',switch:'العربية'}
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
 const a=link(urlUnit(u),undefined,'unit-card');a.innerHTML='<small>UNIT '+String(i+1).padStart(2,'0')+' · '+(lang==='ar'?'صفحات ':'PAGES ')+printedPages(u.pages).join('–')+'</small>'<h3 dir="ltr">'+escaped(u.title)+'</h3><p>'+escaped(lang==='ar'?u.titleAr:'A lesson from your book')+'</p><span class="tile-arrow">↗</span>';return a;
}
function hub(){
 const grid=document.querySelector('#letter-grid');if(grid){grid.replaceChildren();alphabet.forEach(a=>grid.append(cardLetter(a)))}
 const unitsGrid=document.querySelector('#unit-grid');if(unitsGrid){unitsGrid.replaceChildren();units.forEach((u,i)=>unitsGrid.append(cardUnit(u,i)))}
}
function speakBadge(){const box=el('aside','audio-notice');box.append(el('span','audio-mark','◌'));box.append(el('p',null,t('audioUnavailable')));return box}
function wordVisual(w){const icon=icons[w]||'';const box=el('div','word-visual'+(icon?'':' no-icon'),icon||w[0].toUpperCase());box.setAttribute('aria-hidden','true');return box}
function lessonBreadcrumb(target){
 const c=el('nav','crumbs');c.setAttribute('aria-label','Breadcrumb');c.append(link('/', 'RVU Kids'));c.append(document.createTextNode(' / '));c.append(link('/learn/',t('hub')));c.append(document.createTextNode(' / '+target));return c
}
function lessonTemplate(type,d,idx){
 const root=document.querySelector('#lesson-root');root.replaceChildren();
 const head=el('section','lesson-top');head.append(lessonBreadcrumb(type==='alphabet'?t('alph'):t('sent')));
 const shell=el('div','lesson-card');
 const caption=el('span','lesson-kicker',(type==='alphabet'?'ALPHABET & WORDS':'EVERYDAY ENGLISH')+' · '+t('pages')+': '+printedPages(d.pages).join('–'));
 const heading=el('h1','lesson-title',type==='alphabet'?d.letter+' '+d.letter.toLowerCase():d.title);heading.dir='ltr';
 const sub=el('p','lesson-sub',type==='alphabet'?(lang==='ar'?'حرف '+d.letter:'Letter '+d.letter):(lang==='ar'?d.titleAr:'Unit '+String(idx+1).padStart(2,'0')));
 shell.append(caption,heading,sub);
 if(type==='alphabet'){
  if(d.id==='a'||d.id==='m'){const page=el('img','real-page');page.src=d.id==='a'?'/assets/letter-a.webp':'/assets/letter-m.webp';page.alt='Actual teaching page from Rvu Alphabet Book — letter '+d.letter;page.loading='lazy';shell.append(page)}
  const syll=el('div','letter-name');syll.append(el('span',null,t('say')+': '));const b=el('b',null,d.letterName);b.dir='ltr';syll.append(b);shell.append(syll);
  shell.append(el('p','phonics-note',t('hint')));
 }
 const title=el('h2','minor-heading',type==='alphabet'?t('words'):t('sentences'));shell.append(title);
 if(type==='alphabet'){
  const g=el('div','word-grid');d.words.forEach((w,i)=>{const item=el('article','word-card');item.append(wordVisual(w));const s=el('strong','english-word',w);s.lang='en';s.dir='ltr';item.append(s);const num=el('span','word-counter',String(i+1).padStart(2,'0'));item.append(num);g.append(item)});shell.append(g)
 }else{
  if(d.id==='feelings'){const image=el('img','real-page');image.src='/assets/feelings.webp';image.alt='Actual feelings page from Rvu Alphabet Book';image.loading='lazy';shell.append(image)}
  if(d.words.length){const labels=el('div','support-words');labels.append(el('p',null,lang==='ar'?'كلمات موجودة في الدرس:':'Vocabulary in this lesson:'));d.words.forEach(w=>labels.append(el('span',null,w)));shell.append(labels)}
 }
 if(d.sentences?.length){if(type==='alphabet')shell.append(el('h2','minor-heading',t('sentences')));const g=el('div','phrase-grid');d.sentences.forEach((s,i)=>{const c=el('div','phrase-card');c.append(el('span','number',String(i+1).padStart(2,'0')));const p=el('strong','phrase-text',s);p.lang='en';p.dir='ltr';c.append(p);g.append(c)});shell.append(g)}
 shell.append(speakBadge());
 if(type==='alphabet'){const practice=buildPractice(d);if(practice)shell.append(practice)}
 const prev=type==='alphabet'?alphabet[idx-1]:units[idx-1],next=type==='alphabet'?alphabet[idx+1]:units[idx+1];
 const nav=el('nav','lesson-nav');nav.setAttribute('aria-label','Lesson navigation');nav.append(link(prev?(type==='alphabet'?urlLetter(prev):urlUnit(prev)):(type==='alphabet'?'/learn/alphabet/':'/learn/sentences/'),'← '+(prev?(type==='alphabet'?prev.letter:prev.title):t('learn'))));nav.append(link(type==='alphabet'?'/learn/alphabet/':'/learn/sentences/',type==='alphabet'?t('all'):t('allSent')));nav.append(link(next?(type==='alphabet'?urlLetter(next):urlUnit(next)):(type==='alphabet'?'/learn/sentences/':'/learn/'),(next?(type==='alphabet'?next.letter:next.title):t('learn'))+' →'));shell.append(nav);
 head.append(shell);root.append(head)
}
function buildPractice(d){
 const usable=d.words.filter(w=>Boolean(icons[w]));
 if(usable.length<2)return null;
 const box=el('section','quiz');box.append(el('span','lesson-kicker','WORD CHECK'));box.append(el('h2',null,t('remember')));
 const prompt=el('p','quiz-prompt');const options=el('div','quiz-options');const feedback=el('p','quiz-feedback');feedback.setAttribute('role','status');
 const next=el('button','button quiz-next',t('next'));next.type='button';next.hidden=true;
 let index=0;
 function show(){
  const w=usable[index];prompt.replaceChildren();prompt.append(document.createTextNode(lang==='ar'?'اختار الكلمة اللي بتعبّر عنها الصورة: ':'Choose the word matching this picture: '));const picture=el('span','quiz-picture',icons[w]);picture.setAttribute('role','img');picture.setAttribute('aria-label',w);prompt.append(picture);feedback.textContent='';options.replaceChildren();next.hidden=true;
  const choice=[...d.words].sort((a,b)=>((a.length*7+index*11)%17)-((b.length*7+index*11)%17));
  choice.forEach(option=>{const b=el('button','quiz-choice',option);b.type='button';b.lang='en';b.addEventListener('click',()=>{if(option===w){feedback.textContent=t('correct');b.classList.add('right');options.querySelectorAll('button').forEach(x=>x.disabled=true);next.hidden=false}else{feedback.textContent=t('retry');b.classList.add('wrong')}});options.append(b)});
 }
 next.addEventListener('click',()=>{index=(index+1)%usable.length;show()});box.append(prompt,options,feedback,next);show();return box;
}
function lessons(){
 const path=location.pathname.split('/').filter(Boolean);
 if(path[1]==='alphabet'&&path[2]){const idx=alphabet.findIndex(l=>l.id===path[2]);if(idx>=0){lessonTemplate('alphabet',alphabet[idx],idx);return}}
 if(path[1]==='sentences'&&path[2]){const aliases={'healthy-habits':'bathroom','kind-words':'can-you-help','good-manners':'polite-words'};const slug=aliases[path[2]]||path[2];const idx=units.findIndex(u=>u.id===slug);if(idx>=0){lessonTemplate('sentences',units[idx],idx);return}}
 if(path[1]==='sentences'&&!path[2]){const root=document.querySelector('#lesson-root');root.innerHTML='<section class="hero compact"><span class="eyebrow">Everyday English</span><h1>'+t('sent')+'</h1><p>'+t('practice')+'</p></section>';const g=el('div','unit-grid');units.forEach((u,i)=>g.append(cardUnit(u,i)));root.append(g);return}
 const root=document.querySelector('#lesson-root');root.innerHTML='<section class="lesson-card"><h1>Lesson not found</h1><a href="/learn/">Learning Hub</a></section>';
}
function preview(){
 const figs=[...document.querySelectorAll('.preview-five figure')];
 let index=0;const dlg=el('dialog','page-dialog');const btn=el('button','dialog-close','×');btn.type='button';btn.setAttribute('aria-label','Close preview');const image=el('img','dialog-image');const cap=el('p','dialog-caption');const controls=el('div','dialog-controls');const prev=el('button','button ghost','←');const next=el('button','button ghost','→');prev.type='button';next.type='button';controls.append(prev,next);dlg.append(btn,image,cap,controls);document.body.append(dlg);
 function show(i){index=(i+figs.length)%figs.length;image.src=figs[index].querySelector('img').src;image.alt=figs[index].querySelector('img').alt;cap.textContent=(index+1)+' / '+figs.length+' — '+figs[index].querySelector('figcaption').textContent}
 btn.addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(index+1);else if(e.key==='ArrowLeft')show(index-1)});
 figs.forEach((figure,i)=>{figure.tabIndex=0;figure.setAttribute('role','button');figure.setAttribute('aria-label','Preview page '+(i+1));const open=()=>{show(i);dlg.showModal()};figure.addEventListener('click',open);figure.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})})
}

function translateStatic(){
 if(lang!=='en')return;
 if(document.body.dataset.page==='alphabet-index'){
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='Every letter.<br><em>Its own little world.</em>';hero.querySelector('p').textContent='Explore A–Z and the exact words and sentences from Rvu Alphabet Book. Reviewed pronunciation recordings will be added separately.';const a=hero.querySelectorAll('.hero-actions a');if(a[0])a[0].textContent='Back to Learning Hub';if(a[1])a[1].textContent='Book Preview'}
  const title=document.querySelector('#letters-title');if(title)title.textContent='Choose a letter';const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 printed pages, made to order.';cta.querySelector('a').textContent='Order the book'}
 }
 if(document.body.dataset.page==='hub'){
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='A book to hold.<br><em>A world to explore.</em>';hero.querySelector('p').textContent='Discover letter lessons and Everyday English alongside the printed Rvu Alphabet Book. The learning paths are ready; reviewed pronunciation audio will be added separately.';const a=hero.querySelectorAll('.hero-actions a');if(a[0])a[0].textContent='Explore Lessons';if(a[1])a[1].textContent='Preview Five Real Pages'}
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
  const sections=[['See','Illustrated scenes help children connect letters, words and meaning.'],['Try','Trace, write, match, choose and review inside the printed book.'],['Keep learning','Explore our Alphabet and Everyday English lessons. Reviewed audio will be added separately.']];document.querySelectorAll('.three article').forEach((article,i)=>{if(sections[i]){article.querySelector('h3').textContent=sections[i][0];article.querySelector('p').textContent=sections[i][1]}});
  const h=document.querySelector('.product-copy');if(h){const paras=h.querySelectorAll('p');if(paras[0])paras[0].textContent='A colorful 96-page workbook for ages 3–6, combining letters, handwriting, activities, and Everyday English.';if(paras[1])paras[1].textContent='Shipping is calculated by governorate. Printing takes approximately one day after payment verification.';const links=h.querySelectorAll('.hero-actions a');if(links[0])links[0].textContent='Order the Book';if(links[1])links[1].textContent='Preview Five Pages';if(links[2])links[2].textContent='Explore Learning Hub'}
  const c=document.querySelector('.cta');if(c){c.querySelector('h2').textContent='Made especially for your child';c.querySelector('p').textContent='Printing starts only after we verify payment.';c.querySelector('a').textContent='Start your order'}
 }
}

renderNavLang();
translateStatic();
const p=document.body.dataset.page;if(p==='hub'||p==='alphabet-index')hub();if(p==='lesson')lessons();if(p==='preview')preview();
