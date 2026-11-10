import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const script=readFileSync(new URL('../learn/storybook.mjs',import.meta.url),'utf8');

class Element {
 constructor(tag='div',cls=''){
  this.tagName=tag;
  this.className=cls;
  this.children=[];
  this.parent=null;
  this.dataset={};
  this.attributes={};
  this.handlers={};
  this.style={setProperty(name,value){this[name]=value}};
  this.value='';
  this._text='';
  this.classList={
   add:klass=>{this.className+=' '+klass},
   contains:klass=>this.className.split(/\s+/).includes(klass)
  };
 }
 set textContent(value){this._text=String(value);this.children=[]}
 get textContent(){return this._text+this.children.map(child=>child.textContent).join('')}
 setAttribute(name,value){this.attributes[name]=String(value)}
 addEventListener(type,fn){this.handlers[type]=fn}
 append(...nodes){for(const child of nodes){if(child){child.parent=this;this.children.push(child)}}}
 prepend(...nodes){for(const child of [...nodes].reverse()){child.parent=this;this.children.unshift(child)}}
 replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes)}
 before(node){
  if(!this.parent)return;
  const i=this.parent.children.indexOf(this);
  node.parent=this.parent;this.parent.children.splice(i,0,node);
 }
 after(node){
  if(!this.parent)return;
  const i=this.parent.children.indexOf(this);
  node.parent=this.parent;this.parent.children.splice(i+1,0,node);
 }
 querySelector(selector){
  const klass=selector.startsWith('.')?selector.slice(1):null;
  const walk=element=>{
   if(klass&&element.className.split(/\s+/).includes(klass))return element;
   for(const child of element.children){const found=walk(child);if(found)return found}
   return null;
  };
  return walk(this);
 }
}

const letters='abcdefghijklmnopqrstuvwxyz'.split('').map(id=>({
 id,letter:id.toUpperCase(),words:[id==='a'?'apple':id==='b'?'ball':'cat']
}));
const curriculum={alphabet:letters,sentences:[{id:'feelings',sentences:["I'm happy."]}]};

function mount(page,path,initialStorage={}){
 const values=new Map(Object.entries(initialStorage));
 const listeners={};
 const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
 const map=new Element('div','letter-grid');
 const section=new Element('section','section');section.append(map);
 const hero=new Element('section','hero');
 const card=new Element('section','lesson-card');
 const nav=new Element('nav','lesson-nav');card.append(nav);
 const document={
  body:{dataset:{page}},
  documentElement:{lang:'ar'},
  createElement:tag=>new Element(tag),
  getElementById:id=>id==='letter-grid'&&page==='hub'?map:null,
  querySelector:selector=>selector==='.hero'?hero:selector==='.lesson-card'?card:null,
  addEventListener:(event,handler)=>{listeners[event]=handler}
 };
 runInNewContext(script,{
  window:{RVU_CURRICULUM:curriculum},
  document,
  location:{pathname:path},
  localStorage:storage,
  CustomEvent:class {constructor(type,options){this.type=type;this.detail=options?.detail}}
 },{timeout:1000});
 return {map,hero,card,values,listeners};
}

test('storybook alphabet map renders 26 accessible lesson links with book illustrations',()=>{
 const page=mount('hub','/learn/');
 assert.equal(page.map.children.length,26);
 assert.equal(page.map.children[0].querySelector('.storybook-station').href,'/learn/alphabet/a/');
 assert.equal(page.map.children[25].querySelector('.storybook-station').href,'/learn/alphabet/z/');
 assert.equal(page.map.children[0].querySelector('.storybook-station-image').src,'/assets/words/apple.svg');
 assert.ok(page.map.children[0].querySelector('.storybook-station-listen'));
 assert.ok(page.map.children[0].querySelector('.storybook-station-listen').disabled,'No speech playback without approved word-audio pipeline');
 assert.ok(page.hero.querySelector('.storybook-guide'));
});

test('a lesson visit and explicit completion persist without changing other letters',()=>{
 const page=mount('lesson','/learn/alphabet/a/');
 let state=JSON.parse(page.values.get('rvu-story-progress-v1'));
 assert.ok(state.visited.alphabet.includes('a'));
 assert.ok(!state.completed.alphabet.includes('a'));
 const done=page.card.querySelector('.storybook-finish-button');
 assert.equal(typeof done.handlers.click,'function');
 done.handlers.click();
 state=JSON.parse(page.values.get('rvu-story-progress-v1'));
 assert.ok(state.completed.alphabet.includes('a'));
 assert.ok(!state.completed.alphabet.includes('b'));
 assert.equal(done.disabled,true);
});

test('guide responds to correct answers and gentle retries',()=>{
 const page=mount('lesson','/learn/alphabet/a/');
 const guide=page.card.querySelector('.storybook-guide');
 page.listeners['rvu:activity-feedback']({detail:{ok:true}});
 assert.match(guide.textContent,/أحسنت/);
 page.listeners['rvu:activity-feedback']({detail:{ok:false}});
 assert.match(guide.textContent,/جرب مرة تانية/);
});

test('malformed saved progress does not break the page',()=>{
 const page=mount('hub','/learn/',{'rvu-story-progress-v1':'not JSON'});
 assert.equal(page.map.children.length,26);
});
