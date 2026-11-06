const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({Intl,document:{addEventListener(){}}});
vm.runInContext(fs.readFileSync(path.join(root,'interface/fish-interface/fischeSchweiz.js'),'utf8'),context);
const fish=JSON.parse(fs.readFileSync(path.join(root,'sources/fish/swiss-fish.json')));
const references=JSON.parse(fs.readFileSync(path.join(root,'sources/fish/references.json')));
test('sizes sort numerically in both directions, with unknown values last',()=>{
 const items=[{name:'A',max_cm:100},{name:'B',max_cm:9},{name:'C',max_cm:20},{name:'D'}];
 assert.deepEqual([...items].sort((a,b)=>context.compareFish(a,b,'max_cm',1)).map(f=>f.name),['B','C','A','D']);
 assert.deepEqual([...items].sort((a,b)=>context.compareFish(a,b,'max_cm',-1)).map(f=>f.name),['A','C','B','D']);
 assert.equal(context.formatFishSize(28.75),'29');assert.equal(context.formatFishSize(0),'0');assert.equal(context.formatFishSize(null),'');
});
test('reordering keeps each column exactly once and repairs obsolete saved settings',()=>{
 const order=context.fishColumnOrder(['name','name','obsolete','max_cm']);
 assert.equal(new Set(order).size,12);assert.equal(order.length,12);assert.equal(order[0],'name');assert.equal(order[1],'max_cm');
 const moved=context.moveFishColumn(order,'name',9);assert.equal(moved[9],'name');assert.equal(moved.length,12);assert.equal(order[0],'name');
});
test('status sorting follows threat severity rather than code spelling',()=>{
 const items=['CR','LC','DD','EN','RE','NT','VU','NA'].map(status=>({name:status,status}));
 const sorted=items.sort((a,b)=>context.compareFish(a,b,'status',1)).map(f=>f.status);
 assert.deepEqual(sorted.slice(0,6),['LC','NT','VU','EN','CR','RE']);assert.ok(sorted.indexOf('DD')>5);
});
test('every fish has a drawing, descriptions and a sourced Bern review; Laube appears once',()=>{
 assert.equal(fish.length,77);assert.equal(fish.filter(f=>f.scientific_name.startsWith('Alburnus alburnus')).length,1);
 assert.equal(new Set(fish.map(f=>f.scientific_name)).size,fish.length);
 for(const f of fish){
  assert.ok(f.form_description&&f.information&&f.fishing_method&&f.bait,f.name);
  assert.ok(['documented','historical','uncertain','no_record'].includes(f.bern_occurrence.state),f.name);
  assert.equal(f.bern_occurrence.reviewed_on,'2026-11-06');
  for(const id of [...f.bern_occurrence.source_ids,...f.profile_source_ids])assert.ok(references[id]?.url.startsWith('https://'),id);
  assert.equal(fs.readFileSync(path.join(root,f.image)).subarray(0,8).toString('hex'),'89504e470d0a1a0a',f.name);
 }
 assert.equal(fish.find(f=>f.name==='Dorngrundel').bern_occurrence.state,'documented');
 assert.equal(fish.find(f=>f.name==='Bachneunauge').bern_occurrence.state,'documented');
 assert.equal(fish.find(f=>f.name==='Steinbeisser').bern_occurrence.state,'uncertain');
});

test('search finds Laube without matching the middle of erlauben',()=>{
 assert.deepEqual(fish.filter(f=>context.matchesFishSearch(f,'Laube')).map(f=>f.name),['Laube']);
 assert.ok(context.matchesFishSearch(fish.find(f=>f.name==='Äsche'),'asche'));
});

test('Bern protected species do not receive bait recommendations',()=>{
 for(const name of ['Aal','Bachneunauge','Strömer','Bitterling','Nase','Moorgrundel']){
  const f=fish.find(f=>f.name===name);assert.match(f.fishing_method,/Fangverbot/);assert.equal(f.bait,'Keine Köderempfehlung');
 }
});

test('search matches parts inside compound fish names',()=>{
 const names=fish.filter(f=>context.matchesFishSearch(f,'neunauge')).map(f=>f.name);
 assert.deepEqual(names,['Flussneunauge','Bachneunauge','Meerneunauge']);
 assert.ok(context.matchesFishSearch(fish.find(f=>f.name==='Bachforelle'),'forelle'));
 assert.ok(context.matchesFishSearch(fish.find(f=>f.name==='Bachneunauge'),'NEUNAUGE'));
});
