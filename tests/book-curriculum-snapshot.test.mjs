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
const expectedDifferences={
 c:{site:['cup'],book:['carrot']},d:{site:['doll'],book:['drum']},
 e:{site:['ear','elbow'],book:['engine','envelope']},
 f:{site:['fork'],book:['fox']},i:{site:['island'],book:['igloo']},
 j:{site:['jam'],book:['jeep']},k:{site:['kangaroo'],book:['king']},
 n:{site:['night'],book:['nurse']},o:{site:['ocean','otter'],book:['owl','ox']},
 p:{site:['pen'],book:['pencil']},r:{site:['rain'],book:['rose']},
 s:{site:['sock','spoon'],book:['snake','strawberry']}
};
const alphabet=Array.from({length:26},(_,i)=>String.fromCharCode(i+97));
test('exact printed book word baseline is reviewed and complete',()=>{
 assert.deepEqual(Object.keys(printed).sort(),alphabet);
 const total=Object.values(printed).reduce((n,words)=>n+words.length,0);
 assert.equal(total,101);
});
test('known vocabulary fidelity discrepancies are explicitly tracked (not approved)',()=>{
 const differences={};
 for(const unit of actual){
  const book=new Set(printed[unit.id]),site=new Set(unit.words);
  const extra=unit.words.filter(x=>!book.has(x)).sort();
  const missing=printed[unit.id].filter(x=>!site.has(x)).sort();
  if(extra.length||missing.length)differences[unit.id]={site:extra,book:missing};
 }
 assert.deepEqual(JSON.parse(JSON.stringify(differences)),expectedDifferences);
 assert.equal(Object.keys(differences).length,12);
 assert.equal(Object.values(differences).reduce((n,item)=>n+item.site.length,0),15);
 // This passing test means the known discrepancies are still *tracked*,
 // not that the site's alphabet content matches the book.
});
