/* Picture cues use the existing illustrated words from the printed curriculum.
   They are visual prompts, not literal illustrations of every spoken sentence. */
export const SENTENCE_PICTURES=Object.freeze({
 feelings:['sun','flower','tiger','bear'],
 hungry:['apple','banana'],
 thirsty:['orange','juice'],
 bathroom:['door','hand','house'],
 'my-family':['house','flower','hat','ball','kitten'],
 'hello-about-me':['sun','flower','rainbow','moon'],
 'at-school':['house','hat','pencil','kitten'],
 'can-i-have':['apple','ball','pencil','orange'],
 'likes-and-dislikes':['pizza','banana','milk','yogurt'],
 'can-you-help':['robot','pencil','rainbow','door','house'],
 'polite-words':['flower','gift','rose','hat','sun'],
 'lets-play':['ball','kite','robot','kitten','boat'],
 'my-body':['hat','banana','hand','moon','flower'],
 'daily-routine':['sun','hand','jacket','egg','house','moon'],
 'stay-safe':['hand','watch','rose','bear','flower','hat']
});
const FALLBACK=['sun','apple','ball','flower','rainbow','moon','house','hat','cup','dog','boat','tree'];
export function pictureSource(word){return '/assets/stickers/'+String(word).replaceAll(' ','-')+'.webp'}
export function getPictureCues(type,lesson,wordList){
 const approved=new Set(wordList);
 if(type==='alphabet'){
  return (lesson.words||[]).map((word,index)=>({
   id:index,word,utterance:word,clipType:'word',image:approved.has(word)?word:'sun'
  }));
 }
 if(type!=='sentences')return [];
 const candidates=SENTENCE_PICTURES[lesson.id]||[];
 const used=new Set();
 return (lesson.sentences||[]).map((utterance,index)=>{
  const preferred=candidates[index];
  const image=(approved.has(preferred)&&!used.has(preferred)?preferred:null)
   ||FALLBACK.find(word=>approved.has(word)&&!used.has(word))
   ||wordList.find(word=>!used.has(word))
   ||'sun';
  used.add(image);
  return {id:index,word:image,utterance,clipType:'everyday-sentence',image};
 });
}
