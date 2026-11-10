import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const window={};
runInNewContext(readFileSync(new URL('../learn/content.js',import.meta.url),'utf8'),{window});
const actual=window.RVU_CURRICULUM.alphabet;
const printed={
 a:['apple','ant','airplane','alligator'],
 b:['ball','bear','banana','boat'],
 c:['cat','car','cake','carrot'],
 d:['door','dog','duck','drum'],
 e:['egg','elephant','envelope','engine'],
 f:['fish','flower','frog','fox'],
 g:['goat','grapes','guitar','gift'],
 h:['hat','house','horse','hand'],
 i:['ice cream','insect','iguana','igloo'],
 j:['juice','jacket','jellyfish','jeep'],
 k:['kite','key','king','kitten'],
 l:['leaf','lion','lamp','lemon'],
 m:['moon','monkey','milk','mouse'],
 n:['nest','nurse','net','nose'],
 o:['orange','owl','ox','octopus'],
 p:['pencil','panda','pig','pizza'],
 q:['queen','quail','quilt'],
 r:['rainbow','rabbit','robot','rose'],
 s:['sun','star','strawberry','snake'],
 t:['tree','tiger','train','turtle'],
 u:['up','umbrella','uncle','under'],
 v:['van','vase','violin','vegetables'],
 w:['whale','window','watch','watermelon'],
 x:['x-ray','xylophone'],
 y:['yo-yo','yak','yellow','yogurt'],
 z:['zoo','zebra','zipper','zero']
};
const alphabet=Array.from({length:26},(_,i)=>String.fromCharCode(i+97));
test('exact printed book word baseline is reviewed and complete',()=>{
 assert.deepEqual(Object.keys(printed).sort(),alphabet);
 const total=Object.values(printed).reduce((n,words)=>n+words.length,0);
 assert.equal(total,101);
});
test('all 101 book words match the latest print curriculum with no missing or extra entries',()=>{
 const differences={};
 for(const unit of actual){
  const book=new Set(printed[unit.id]),site=new Set(unit.words);
  const extra=unit.words.filter(x=>!book.has(x)).sort();
  const missing=printed[unit.id].filter(x=>!site.has(x)).sort();
  if(extra.length||missing.length)differences[unit.id]={site:extra,book:missing};
 }
 assert.deepEqual(differences,{});
 assert.equal(Object.keys(differences).length,0);
});

test('printed lesson example sentences match the revised book A through Z',()=>{
 const examples=[
  'I see an apple.','I see a ball.','I see a cat.','I see a dog.','I see an egg.',
  'I see a fish.','I see a goat.','I see a hat.','I see ice cream.','I see juice.',
  'I see a kite.','I see a lion.','I see a monkey.','I see a nest.','I see an orange.',
  'I see a panda.','I see a queen.','I see a rainbow.','I see a star.','I see a tiger.',
  'I see an umbrella.','I see a van.','I see a whale.','I see a xylophone.',
  'I see a yo-yo.','I see a zebra.'
 ];
 assert.deepEqual(actual.map(l=>l.sentences[0]),examples);
});
