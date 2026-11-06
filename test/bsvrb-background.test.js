const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('../bsvrb-home.js'), 'utf8');
function setup({blocked = false, stored = {}} = {}) {
  const draws = [], images = [], frames = new Map(), elements = [];
  let id = 0;
  class Element {
    constructor(tag) { this.tag = tag; this.dataset = {}; this.events = {}; this.children = {}; elements.push(this); }
    setAttribute(key, value) { this[key] = value; }
    addEventListener(key, fn) { this.events[key] = fn; }
    querySelector(selector) { return this.children[selector] ||= new Element(selector); }
    append() {} showModal() { this.open = true; } close() { this.open = false; }
  }
  const context = {clearRect(){},save(){},restore(){},translate(){},rotate(){},setTransform(){},drawImage(image){draws.push(image.src);}};
  const canvas = new Element('canvas'); canvas.getContext = () => context;
  const root = {dataset:{}};
  const sandbox = {
    document:{querySelectorAll(){return [];},querySelector(){return null;},currentScript:{src:'https://bsvrb.ch/bsvrb-home.js'},
      documentElement:root, body:{prepend(){},append(){}}, createElement(tag){return tag === 'canvas' ? canvas : new Element(tag);},
      getElementById(){return null;},addEventListener(){},dispatchEvent(){}},
    localStorage:{getItem(key){if(blocked)throw Error('blocked');return stored[key] ?? null;},setItem(key,value){if(blocked)throw Error('blocked');stored[key] = value;}},
    location:{href:'https://bsvrb.ch/'},URL,performance:{now(){return 100;}},Event:class {},
    Image:class {constructor(){this.complete=true;this.naturalWidth=300;this.naturalHeight=300;images.push(this);}},
    matchMedia(){return {matches:false,addEventListener(){}};},getComputedStyle(){return {getPropertyValue(){return '';}};},
    innerWidth:1000,innerHeight:700,devicePixelRatio:1,window:{addEventListener(){}},
    requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(id){frames.delete(id);}
  };
  vm.runInNewContext(source.replace('  resize(); update();', '  resize(); update(); globalThis.sim = {resolveCollision, silhouettesOverlap, makeMask, contain, get symbols(){return symbols;}, draw, config, controls, motionInput, effectsInput, dialog, toggle};'), sandbox);
  return {sandbox,sim:sandbox.sim,canvas,images,draws,frames,stored};
}
test('loads and draws every original TANNA level without geometric substitutes',()=>{
  const {images,draws}=setup();
  assert.equal(images.length,8);
  for(let i=0;i<8;i++)assert.ok(draws.includes(`https://bsvrb.ch/sources/images/op-logo/tanna_op${i}.png`));
});
function mask(predicate = () => true) {
  const resolution=32, alpha=new Uint8Array(resolution*resolution), points=[];
  for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++)if(predicate(x,y)){
    alpha[y*resolution+x]=1;points.push([(x+.5)/resolution-.5,(y+.5)/resolution-.5]);
  }
  return {resolution,alpha,points,hull:[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]]};
}
function symbol(values){return {x:100,y:100,dx:0,dy:0,radius:10,size:20,scale:1,rotation:0,mass:1,lvl:0,effectUntil:0,img:{collisionMask:mask()},...values};}
test('head-on collision conserves momentum and rebounds with unequal masses',()=>{
  const {sim,canvas}=setup();const a=symbol({dx:10}),b=symbol({x:115,dx:-5,mass:2,lvl:1});
  sim.resolveCollision(a,b,100);
  assert.equal(a.dx,-10);assert.equal(b.dx,5);assert.equal(a.dx+2*b.dx,0);
  assert.equal(canvas.dataset.collisions,'1');assert.equal(a.highlightUntil,300);assert.equal(a.effectUntil,0);
});
test('separates coincident and departing overlaps without a repeated impulse',()=>{
  const {sim}=setup();
  const a=symbol({dx:-10}),b=symbol({x:115,dx:10});sim.resolveCollision(a,b,100);
  assert.ok(b.x-a.x>19 && b.x-a.x<21);assert.equal(a.dx,-10);assert.equal(b.dx,10);
  const c=symbol({}),d=symbol({});sim.resolveCollision(c,d,100);assert.ok(Math.abs(c.x-d.x)>19 && Math.abs(c.x-d.x)<21);
});
test('settings open in a dialog, apply live and persist; pause and blocked storage work',()=>{
  const {sim,frames,canvas,images,stored}=setup();
  sim.toggle.events.click();assert.equal(sim.dialog.open,true);
  sim.controls.density.input.value = '0';sim.controls.density.input.events.input();assert.equal(canvas.dataset.symbols,'0');
  sim.controls.density.input.value = '30';sim.controls.density.input.events.input();assert.ok(sim.symbols.length>20);
  sim.controls.speed.input.value = '10';sim.controls.speed.input.events.input();assert.equal(JSON.parse(stored.bsvrb_background_v1).speed,10);
  sim.motionInput.checked = false;sim.motionInput.events.change();assert.equal(frames.size,0);assert.equal(canvas.dataset.motion,'paused');
  images.forEach(image=>image.naturalWidth=0);assert.doesNotThrow(()=>sim.draw());
  sim.motionInput.checked = true;sim.motionInput.events.change();assert.equal(frames.size,1);
  const denied = setup({blocked:true});denied.sim.controls.opacity.input.value = '5';assert.doesNotThrow(()=>denied.sim.controls.opacity.input.events.input());
});
test('calm defaults limit coverage and turn collision effects off; saved values are bounded',()=>{
  const {sim}=setup();assert.ok(sim.symbols.length<30);assert.equal(sim.config.speed,25);assert.equal(sim.config.effects,false);
  const saved = setup({stored:{bsvrb_background_v1:JSON.stringify({density:999,speed:-100,size:50,opacity:15,effects:true})}});
  assert.equal(saved.sim.config.density,60);assert.equal(saved.sim.config.speed,5);assert.equal(saved.sim.config.size,50);assert.equal(saved.sim.config.effects,true);
});

test('transparent margins and cutouts do not collide, while rotated visible pixels do',()=>{
  const {sim}=setup();
  const ring = mask((x,y) => x<8 || x>=24 || y<8 || y>=24);
  const a=symbol({size:100,img:{collisionMask:ring}}),b=symbol({size:30});
  assert.equal(sim.silhouettesOverlap(a,b),false); // Entirely inside transparent cutout.
  b.x=135;assert.equal(sim.silhouettesOverlap(a,b),true);
  const tiny = mask((x,y)=>x>=12 && x<20 && y>=12 && y<20);
  const c=symbol({size:100,img:{collisionMask:tiny}}),d=symbol({x:140,size:100,img:{collisionMask:tiny}});
  assert.equal(sim.silhouettesOverlap(c,d),false); // Image boxes overlap, visible logos do not.
  const e=symbol({size:100}),f=symbol({x:165,size:10});
  assert.equal(sim.silhouettesOverlap(e,f),false);
  e.rotation=Math.PI/4;assert.equal(sim.silhouettesOverlap(e,f),true);
});
test('wall collision follows the rotated visible outline and initial angles vary',()=>{
  const {sim}=setup();const a=symbol({x:10,size:100,rotation:Math.PI/4,dx:-10});
  sim.contain(a);assert.ok(Math.abs(a.x-100/Math.sqrt(2))<.01);assert.equal(a.dx,10);
  assert.ok(new Set(sim.symbols.map(s=>s.rotation)).size>1);
});
