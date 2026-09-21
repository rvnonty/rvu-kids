'use strict';
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const units=[
['feelings','Feelings','المشاعر'],
['hungry','I’m Hungry','أنا جعان'],
['thirsty','I’m Thirsty','أنا عطشان'],
['healthy-habits','Healthy Habits','عادات صحية'],
['my-family','My Family','عيلتي'],
['hello-about-me','Hello & About Me','أنا مين؟'],
['at-school','At School','في المدرسة'],
['polite-words','Polite Words','كلمات مهذبة'],
['likes-and-dislikes','I Like / I Don’t Like','بحب / مش بحب'],
['kind-words','Kind Words & Helpful Hearts','كلام طيب ومساعدة'],
['good-manners','Good Manners','سلوكيات كويسة'],
['lets-play','Let’s Play','يلا نلعب'],
['my-body','My Body & How I Feel','جسمي وإحساسي'],
['daily-routine','Daily Routine','روتيني اليومي'],
['stay-safe','Stay Safe','خليك آمن']
];
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function buildHub(){
 const lg=document.querySelector('#letter-grid'); if(lg) letters.forEach(l=>{const a=document.createElement('a');a.href='/learn/alphabet/'+l.toLowerCase()+'/';a.textContent=l;a.setAttribute('aria-label','Letter '+l);lg.append(a)});
 const ug=document.querySelector('#unit-grid'); if(ug) units.forEach((u,i)=>{const a=document.createElement('a');a.className='unit-card';a.href='/learn/sentences/'+u[0]+'/';a.innerHTML='<small>Unit '+String(i+1).padStart(2,'0')+'</small><h3>'+esc(u[1])+'</h3><p>'+esc(u[2])+'</p>';ug.append(a)});
}
function letterLesson(slug){
 const idx=letters.findIndex(x=>x.toLowerCase()===slug); if(idx<0)return null; const L=letters[idx];
 return {kind:'alphabet',kicker:'Alphabet & Words',title:L+' '+L.toLowerCase(),sub:'Letter '+L,ar:'درس الحرف '+L,index:idx};
}
function sentenceLesson(slug){
 const idx=units.findIndex(u=>u[0]===slug); if(idx<0)return null; const u=units[idx];
 return {kind:'sentences',kicker:'Everyday English',title:u[1],sub:u[2],ar:'Everyday English',index:idx};
}
function renderLesson(){
 const parts=location.pathname.split('/').filter(Boolean); let data=null;
 if(parts[0]==='learn'&&parts[1]==='alphabet')data=letterLesson(parts[2]||'a');
 if(parts[0]==='learn'&&parts[1]==='sentences'&&parts[2])data=sentenceLesson(parts[2]);
 const root=document.querySelector('#lesson-root'); if(!root)return;
 if(!data){root.innerHTML='<section class="lesson-top"><div class="lesson-card"><h1 class="lesson-title">Lesson not found</h1><a class="button" href="/learn/">Back to Learning Hub</a></div></section>';return}
 document.title=data.title+' | RVU Kids';
 let prev='#',next='#',prevText='Previous',nextText='Next';
 if(data.kind==='alphabet'){const i=data.index;prev=i>0?'/learn/alphabet/'+letters[i-1].toLowerCase()+'/':'/learn/';next=i<25?'/learn/alphabet/'+letters[i+1].toLowerCase()+'/':'/learn/sentences/';prevText=i>0?'← '+letters[i-1]:'← Hub';nextText=i<25?letters[i+1]+' →':'Everyday English →'}
 else{const i=data.index;prev=i>0?'/learn/sentences/'+units[i-1][0]+'/':'/learn/';next=i<units.length-1?'/learn/sentences/'+units[i+1][0]+'/':'/learn/';prevText=i>0?'← '+units[i-1][1]:'← Hub';nextText=i<units.length-1?units[i+1][1]+' →':'Hub →'}
 root.innerHTML='<section class="lesson-top"><div class="crumbs"><a href="/">RVU Kids</a> / <a href="/learn/">Learn</a> / '+esc(data.kicker)+'</div><div class="lesson-card"><span class="lesson-kicker">'+esc(data.kicker)+'</span><h1 class="lesson-title">'+esc(data.title)+'</h1><div class="lesson-sub">'+esc(data.sub)+'</div><div class="phase-note"><strong>الصفحة التعليمية جاهزة.</strong><br>الكلمات، الرسومات التفصيلية والصوتيات سيتم إدخالها في المرحلة التالية بعد اعتماد المحتوى والنطق؛ لذلك لن نعرض كلمات مخمّنة أو أصواتًا مؤقتة هنا.</div><div class="lesson-nav"><a href="'+prev+'">'+esc(prevText)+'</a><a href="'+next+'">'+esc(nextText)+'</a></div></div></section>';
}
function renderSentencesIndex(){
 const root=document.querySelector('#lesson-root'); if(!root)return;
 root.innerHTML='<section class="hero compact"><span class="eyebrow">Everyday English</span><h1>15 مواقف.<br><em>إنجليزي من يوم الطفل.</em></h1><p>المسار منفصل عن الحروف عشان الطفل يركز على الجمل والمواقف اليومية. الكلمات والصوتيات هتدخل في المرحلة التالية.</p></section><section class="sentence-list" id="sentence-list"></section>';
 const list=document.querySelector('#sentence-list'); units.forEach((u,i)=>{const a=document.createElement('a');a.href='/learn/sentences/'+u[0]+'/';a.innerHTML='<small>Unit '+String(i+1).padStart(2,'0')+'</small><h3>'+esc(u[1])+'</h3><span>'+esc(u[2])+'</span>';list.append(a)});
}
if(document.body.dataset.page==='hub')buildHub();
if(document.body.dataset.page==='lesson'){const p=location.pathname.split('/').filter(Boolean); if(p[0]==='learn'&&p[1]==='sentences'&&!p[2])renderSentencesIndex(); else renderLesson();}