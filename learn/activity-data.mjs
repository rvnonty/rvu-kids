
export const SCENES={
 feelings:[['😄','أنت فرحان.','You feel happy.',0],['😔','أنت زعلان.','You feel sad.',1],['😨','أنت خايف.','You feel scared.',3]],
 hungry:[['🍽️','حاسس بالجوع.','You feel hungry.',0],['🍌','عايز تطلب سناك بأدب.','Politely ask for a snack.',1]],
 thirsty:[['💧','أنت عطشان.','You are thirsty.',0],['🚰','اطلب شوية مية بأدب.','Politely ask for water.',1]],
 bathroom:[['🚻','محتاج تروح الحمام.','You need the bathroom.',0],['🙋','استأذن قبل ما تروح الحمام.','Ask permission to use the bathroom.',1],['🧼','بعد الحمام بتغسل إيدك.','Wash your hands afterward.',2]],
 'my-family':[['👨‍👩‍👧','بتعرف صاحبك على العيلة.','Introduce your family.',0],['👩','بتعرفه على ماما.','Introduce your mom.',1],['👨','بتعرفه على بابا.','Introduce your dad.',2]],
 'hello-about-me':[['👋','سلم على صاحبك.','Greet your friend.',0],['🙂','قول اسمك.','Say your name.',1],['👋','جاء وقت الوداع.','Say goodbye.',3]],
 'at-school':[['🏫','أنت في المدرسة.','You are at school.',0],['👩‍🏫','عرّف صاحبك بالمدرس.','Introduce your teacher.',1],['📘','قول إن معاك كتاب.','Say you have a book.',2]],
 'can-i-have':[['🙋','اطلب حاجة بأدب.','Ask for something politely.',0],['⚽','اطلب الكرة بأدب.','Politely ask for the ball.',1],['📘','اطلب الكتاب بأدب.','Politely ask for the book.',2]],
 'likes-and-dislikes':[['🍕','بتحب البيتزا.','You like pizza.',0],['🍌','بتحب الموز.','You like bananas.',1],['🥛','مش بتحب اللبن.','You do not like milk.',2]],
 'can-you-help':[['🙋','محتاج مساعدة.','You need some help.',0],['❓','مش فاهم.','You do not understand.',1],['🔁','اطلب سماع الكلام مرة تانية.','Ask someone to say it again.',2]],
 'polite-words':[['🎁','صاحبك ساعدك: اشكره.','Someone helped you: thank them.',1],['💗','عايز تعتذر.','You want to apologize.',2],['🙂','حد شكرك: رد بأدب.','Someone thanked you: reply kindly.',4],['🚶','عايز تلفت الانتباه بأدب.','Get someone’s attention politely.',3]],
 'lets-play':[['🧸','اطلب تلعب مع صاحبك.','Ask to play together.',1],['🔄','دلوقتي دورك.','It is your turn.',2],['🤝','اقترح تشارك اللعب.','Suggest sharing.',4]],
 'my-body':[['🤕','راسك بتوجعك.','Your head hurts.',0],['😴','حاسس بالتعب.','You feel tired.',3],['🤒','أنت مريض.','You feel sick.',4]],
 'daily-routine':[['🌞','قمت من النوم.','You wake up.',0],['🪥','بتغسل سنانك.','You brush your teeth.',1],['🛏️','جاء وقت النوم.','You go to bed.',5]],
 'stay-safe':[['🛑','اطلب من حد يقف.','Ask someone to stop.',0],['⏳','اطلب من حد يستنى.','Ask someone to wait.',1],['🆘','اطلب مساعدة.','Ask for help.',3]]
};
export const REPORTED_BAD_WORDS=new Set(['fish','fork']);
const strip=w=>w.replace(/[.,!?;:]+$/u,'').toLowerCase().replace(/[^\p{L}\p{N}'’\-]/gu,'');
const tokenize=s=>s.trim().split(/\s+/u);
export function shuffle(items,seed=1){
 const out=[...items];let state=(seed|0)>>>0;
 for(let i=out.length-1;i>0;i--){
  state=(Math.imul(state,1664525)+1013904223)>>>0;
  const j=state%(i+1);[out[i],out[j]]=[out[j],out[i]];
 }
 if(out.length>1&&out.every((v,i)=>v===items[i]))out.push(out.shift());
 return out;
}
export function makeActivityData(type,lesson){
 const sentences=lesson.sentences||[],words=lesson.words||[];
 const scene=(SCENES[lesson.id]||[]).map(([emoji,ar,en,index],i)=>({
  emoji,ar,en,answer:sentences[index],
  choices:shuffle([sentences[index],...shuffle(sentences.filter(x=>x!==sentences[index]),i+71).slice(0,3)],i+31)
 }));
 const missing=sentences.map((sentence,i)=>{
  const tokens=tokenize(sentence);
  if(tokens.length<2)return null;
  const eligible=tokens.map((token,n)=>({token,n,clean:strip(token)})).filter(x=>x.clean.length>1&&!/_/.test(x.token));
  if(!eligible.length)return null;
  const eligibleStrong=eligible.filter(x=>!/^(i|a|an|the|to|is|it|my|me|in|on|at|do)$/i.test(x.clean));
  const chosen=eligibleStrong.at(-1)||eligible.at(-1);
  const extras=[...new Set(sentences.flatMap(tokenize).map(strip).concat(['please','book','school','happy','play','you','thank','wait']))].filter(x=>x.length>1&&x!==chosen.clean);
  return {
   answer:chosen.clean,
   masked:tokens.map((tok,n)=>n===chosen.n?'_____':tok).join(' '),
   sentence,choices:shuffle([chosen.clean,...shuffle(extras,i+25).slice(0,3)],i+91)
  };
 }).filter(Boolean).slice(0,6);
 const reorder=sentences.map((sentence,i)=>{
  const tokens=tokenize(sentence);
  if(tokens.length<2||tokens.length>8||/_/.test(sentence))return null;
  return {sentence,tokens,shuffled:shuffle(tokens.map((_,n)=>n),i+101)};
 }).filter(Boolean).slice(0,5);
 const listening=sentences.map((answer,i)=>({answer,choices:shuffle([answer,...shuffle(sentences.filter(x=>x!==answer),i+21).slice(0,3)],i+15)})).slice(0,6);
 const wordListening=words.filter(w=>!REPORTED_BAD_WORDS.has(w)).map((answer,i)=>({
  answer,choices:shuffle([answer,...shuffle(words.filter(x=>x!==answer),i+29).slice(0,3)],i+57)
 }));
 const pictures=words.map((answer,i)=>({
  answer,choices:shuffle([answer,...shuffle(words.filter(x=>x!==answer),i+41).slice(0,3)],i+13)
 }));
 const spelling=words.filter(x=>x.length<=9).slice(0,4).map((word,i)=>({
  word,shuffled:shuffle([...word].map((_,n)=>n),i+113)
 }));
 return {type,lessonId:lesson.id,scene,missing,reorder,listening,wordListening,pictures,spelling};
}
