import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {getPictureCues,pictureSource} from '../learn/scene-data.mjs';

const curriculumWindow={};
runInNewContext(readFileSync(new URL('../learn/content.js',import.meta.url),'utf8'),{window:curriculumWindow});
const curriculum=curriculumWindow.RVU_CURRICULUM;
const allWords=curriculum.alphabet.flatMap(lesson=>lesson.words);
const adventureScript=readFileSync(new URL('../learn/next-adventures.mjs',import.meta.url),'utf8')
 .replace(/^import .*$/gm,'').replace(/^export /gm,'')+'\nreturn mountAdventureExtras;';
class FakeElement {
 constructor(tag='div',cls=''){
  this.tagName=tag;this.className=cls;this.children=[];this.parent=null;
  this.dataset={};this.attrs={};this.handlers={};this.style={setProperty(){}};
  this._text='';this.disabled=false;this.hidden=false;this.isConnected=false;
  this.classList={
   add:cls=>{this.className+=' '+cls},
   remove:cls=>{this.className=this.className.split(/\s+/).filter(c=>c!==cls).join(' ')},
   contains:cls=>this.className.split(/\s+/).includes(cls)
  };
 }
 set textContent(value){this._text=String(value);this.children=[]}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 append(...elements){for(const e of elements){if(e){e.parent=this;e.isConnected=true;this.children.push(e)}}}
 prepend(...elements){for(const e of elements.reverse()){if(e){e.parent=this;e.isConnected=true;this.children.unshift(e)}}}
 replaceChildren(...elements){this.children=[];this._text='';this.append(...elements)}
 before(element){
  assert.ok(this.parent);const i=this.parent.children.indexOf(this);
  element.parent=this.parent;element.isConnected=true;this.parent.children.splice(i,0,element);
 }
 after(element){
  assert.ok(this.parent);const i=this.parent.children.indexOf(this);
  element.parent=this.parent;element.isConnected=true;this.parent.children.splice(i+1,0,element);
 }
 remove(){
  if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);
  this.parent=null;this.isConnected=false;
 }
 replaceWith(element){
  if(!this.parent)return;
  const i=this.parent.children.indexOf(this);this.parent.children[i]=element;element.parent=this.parent;this.parent=null;
 }
 setAttribute(name,value){this.attrs[name]=String(value)}
 getAttribute(name){return this.attrs[name]??this[name]??null}
 addEventListener(type,callback){const previous=this.handlers[type];this.handlers[type]=previous?((...args)=>{previous(...args);callback(...args)}):callback}
 querySelectorAll(selector){
  const found=[];
  const isMatch=element=>selector[0]==='.'?
   element.className.split(/\s+/).includes(selector.slice(1)):element.tagName===selector.toLowerCase();
  const traverse=element=>{for(const child of element.children){if(isMatch(child))found.push(child);traverse(child)}};
  traverse(this);return found;
 }
 querySelector(selector){return this.querySelectorAll(selector)[0]||null}
}

function mount(page,pathname,seed={}){
 const cache=new Map(Object.entries(seed)),listeners={};
 const head=new FakeElement('head'),body=new FakeElement('body');
 body.dataset.page=page;
 const main=new FakeElement('main');body.append(main);
 const card=new FakeElement('div','lesson-card');
 card.append(new FakeElement('div','storybook-guide'),new FakeElement('section','storybook-finish'));
 const galleryRoot=new FakeElement('div'),strip=new FakeElement('div','preview-five');
 if(page==='lesson')main.append(card);
 if(page==='preview'){
  for(let i=0;i<5;i++){
   const figure=new FakeElement('figure'),image=new FakeElement('img');
   image.src='/assets/test'+i+'.webp';image.setAttribute('src',image.src);image.alt='page '+i;
   const caption=new FakeElement('figcaption');caption.textContent='Page '+i;
   figure.append(image,caption);strip.append(figure);
  }
  main.append(strip);
 }
 if(page==='stickers')main.append(galleryRoot);
 const document={
  head,body,documentElement:{lang:'ar'},
  createElement:tag=>new FakeElement(tag),
  createElementNS:(_namespace,tag)=>new FakeElement(tag),
  getElementById:id=>id==='rvu-star-album'&&page==='stickers'?galleryRoot:null,
  querySelector:selector=>{
   if(selector==='.lesson-card'&&page==='lesson')return card;
   if(selector==='.storybook-finish'&&page==='lesson')return card.querySelector('.storybook-finish');
   if(selector==='.preview-five'&&page==='preview')return strip;
   return null;
  },
  addEventListener:(name,handler)=>{listeners[name]=handler},
  dispatchEvent:event=>listeners[event.type]?.(event)
 };
 const localStorage={
  getItem:key=>cache.get(key)||null,
  setItem:(key,value)=>cache.set(key,String(value))
 };
 const window={RVU_CURRICULUM:curriculum,matchMedia:()=>({matches:true})};
 const mountExtras=new Function('window','document','location','localStorage',
  'getPictureCues','pictureSource','CustomEvent','mountStoryJourney',adventureScript)(
   window,document,{pathname},localStorage,getPictureCues,pictureSource,
   class {constructor(type,options){this.type=type;this.detail=options.detail}},
   ()=>{}
  );
 const playButton=(kind,id,utterance)=>{
  const button=new FakeElement('button','audio-play');
  button.type='button';button.disabled=utterance==='fish'||utterance==='fork';
  button.addEventListener('click',()=>{button.played=true});
  return button;
 };
 mountExtras({playButton});
 return {main,card,strip,galleryRoot,cache,listeners};
}

test('all 41 lessons have complete, distinct and existing picture cues',()=>{
 const lessons=[...curriculum.alphabet.map(lesson=>['alphabet',lesson]),
  ...curriculum.sentences.map(lesson=>['sentences',lesson])];
 assert.equal(lessons.length,41);
 for(const [type,lesson] of lessons){
  const cues=getPictureCues(type,lesson,allWords);
  assert.equal(cues.length,(type==='alphabet'?lesson.words:lesson.sentences).length);
  assert.equal(new Set(cues.map(c=>c.image)).size,cues.length);
  assert.ok(cues.every(c=>allWords.includes(c.image)));
  assert.ok(cues.every(c=>pictureSource(c.image).endsWith('.svg')));
 }
});

test('illustrated scene taps play sound and visual game needs no text choices',()=>{
 const page=mount('lesson','/learn/alphabet/a/');
 const scene=page.card.querySelector('.rvu-visual-scene');
 const game=page.card.querySelector('.rvu-picture-challenge');
 assert.ok(scene);assert.ok(game);
 const objects=scene.querySelectorAll('.rvu-scene-object');
 assert.equal(objects.length,4);
 objects[0].handlers.click();
 assert.equal(objects[0].played,true);
 assert.equal(scene.querySelector('.rvu-scene-announcement').textContent,'apple');
 const choices=game.querySelectorAll('.rvu-picture-choice');
 assert.equal(choices.length,4);
 assert.ok(choices.every(button=>button.querySelector('img')&&!button.textContent));
});

test('optional album displays 41 lesson slots and only completed stars',()=>{
 const page=mount('stickers','/learn/stickers/',{
  'rvu-story-progress-v1':JSON.stringify({completed:{alphabet:['a'],sentences:['feelings']}})
 });
 const toggle=page.galleryRoot.querySelector('input');
 assert.ok(toggle);assert.equal(toggle.checked,false);
 assert.equal(page.galleryRoot.querySelectorAll('.rvu-sticker-card').length,0);
 toggle.checked=true;toggle.handlers.change();
 const cards=page.galleryRoot.querySelectorAll('.rvu-sticker-card');
 assert.equal(cards.length,41);
 assert.equal(cards.filter(card=>card.className.includes('earned')).length,2);
 assert.equal(page.cache.get('rvu-star-album-enabled'),'true');
});

test('flip book presents original five pages, supports next and previous',()=>{
 const page=mount('preview','/preview/');
 const flip=page.main.querySelector('.rvu-flipbook');
 assert.ok(flip);
 const buttons=flip.querySelectorAll('.rvu-flip-arrow');
 assert.equal(buttons.length,2);
 assert.equal(flip.querySelector('.rvu-flip-count').textContent,'1 / 5');
 buttons[1].handlers.click();
 assert.equal(flip.querySelector('.rvu-flip-count').textContent,'2 / 5');
 buttons[0].handlers.click();
 assert.equal(flip.querySelector('.rvu-flip-count').textContent,'1 / 5');
 assert.equal(page.strip.querySelectorAll('figure').length,5);
});
