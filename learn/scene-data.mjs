/* Picture cues use the existing illustrated words from the printed curriculum.
   They are visual prompts, not literal illustrations of every spoken sentence. */
export const SENTENCE_PICTURES=Object.freeze({
 feelings:['sun','rain','tiger','bear'],
 hungry:['apple','banana'],
 thirsty:['cup','juice'],
 bathroom:['door','hand','cup'],
 'my-family':['house','flower','hat','ball','doll'],
 'hello-about-me':['sun','flower','rainbow','moon'],
 'at-school':['house','hat','pen','book'],
 'can-i-have':['apple','ball','pen','cup'],
 'likes-and-dislikes':['pizza','banana','milk','yogurt'],
 'can-you-help':['robot','question','rainbow','door','house'],
 'polite-words':['flower','gift','rain','hat','sun'],
 'lets-play':['ball','kite','robot','doll','boat'],
 'my-body':['hat','banana','hand','moon','flower'],
 'daily-routine':['sun','hand','jacket','egg','house','moon'],
 'stay-safe':['hand','watch','rain','bear','flower','hat']
});
const FALLBACK=['sun','apple','ball','flower','rainbow','moon','house','hat','cup','dog','boat','tree'];
export function pictureSource(word){return '/assets/words/'+String(word).replaceAll(' ','-')+'.svg'}
export function getPictureCues(type,lesson,wordList){
 const approved=new Set(wordList);
 if(type==='alphabet'){
  return (lesson.words||[]).map((word,index)=>({
   id:index,word,utterance:word,clipType:'word',image:approved.has(word)?word:'sun'
  }));
 }
 if(type!=='sentences')return [];
 const candidates=SENTENCE_PICTURES[lesson.id]||[];
 return (lesson.sentences||[]).map((utterance,index)=>{
  const candidate=candidates[index];
  const alternative=FALLBACK.find(word=>approved.has(word)&&!candidates.includes(word));
  const image=approved.has(candidate)?candidate:(alternative||'sun');
  return {id:index,word:image,utterance,clipType:'everyday-sentence',image};
 });
}
