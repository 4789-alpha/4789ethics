const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const rules=JSON.parse(fs.readFileSync('sources/fish/bern-regulations.json'));
const fish=JSON.parse(fs.readFileSync('sources/fish/swiss-fish.json'));
const refs=JSON.parse(fs.readFileSync('sources/fish/references.json'));
const context=vm.createContext({Intl,document:{addEventListener(){}}});
vm.runInContext(fs.readFileSync('interface/fish-interface/fischeSchweiz.js','utf8'),context);
test('all fish receive complete, sourced legal information without inferring permission from occurrence',()=>{
 assert.equal(Object.keys(rules.species).length,fish.length);
 for(const f of fish){
  const result=context.attachFishRules(f,rules);
  for(const key of ['closed_season_be','min_length_be','catch_window_be','catch_quota_be'])assert.ok(result[key],f.name+': '+key);
  for(const id of result.bern_rules.source_ids)assert.ok(refs[id]?.url.startsWith('https://'),id);
 }
 assert.equal(rules.law_effective_from,'2026-01-01');
});
test('binding trout windows retain separate lengths, dates and exceptions',()=>{
 const windows=rules.groups.trout.windows;
 assert.equal(windows.find(w=>w.water.includes('Interlaken')&&w.period==='01.09.–30.09.').length,'30–45 cm');
 assert.equal(windows.find(w=>w.water.includes('Interlaken')&&w.period==='16.03.–31.08.').length,'30–37 cm oder ab 45 cm');
 assert.equal(windows.find(w=>w.water.includes('Engehalde')).length,'34–40 cm oder ab 50 cm');
 assert.equal(windows.find(w=>w.water==='Birs').length,'25–32 cm oder ab 40 cm');
 assert.ok(rules.groups.trout.notes.some(n=>n.includes('abweichend 30–37')));
});
test('border waters and shared quotas remain visible',()=>{
 assert.equal(rules.groups.perch.rows.find(r=>r.water.includes('BE/SO')).length,'Kein Fangmindestmass');
 assert.equal(rules.groups.trout.summary.quota,rules.groups.char.summary.quota);
 assert.match(rules.groups.trout.summary.quota,/gemeinsam 150/);
 assert.match(rules.groups.felchen.summary.quota,/25.*20.*15/);
 assert.match(rules.groups.grayling.summary.quota,/1 Äsche\/Tag und 5\/Jahr/);
});
test('catch bans use legal groups, with explicit exceptions and unknown assignments',()=>{
 for(const name of ['Lampetra planeri','Lampetra fluviatilis','Petromyzon marinus','Cobitis bilineata'])assert.match(rules.species[name].group,/ban$/);
 assert.equal(rules.species['Alburnus arborella'].group,'alborella');
 assert.equal(rules.species['Salmo cenerinus'].group,'trout-unmapped');
 assert.equal(rules.species['Tinca tinca'].group,'unlisted');
 assert.match(rules.groups.unlisted.notes[0],/keine pauschale Fangfreigabe/);
 assert.equal(rules.groups.namaycush.summary.length,'22 cm');
 assert.equal(rules.groups.namaycush.summary.closed,'01.11.–31.12.');
 assert.equal(rules.groups['brook-char'].summary.quota,rules.groups.char.summary.quota);
});
test('new Bern species are unique and searchable under scientific and German names',()=>{
 for(const [scientific,name] of [['Tinca tinca','Schleie'],['Salvelinus fontinalis','Bachsaibling'],['Salvelinus namaycush','Kanadische Seeforelle'],['Carassius carassius','Karausche']]){
  const matches=fish.filter(f=>f.scientific_name===scientific);assert.equal(matches.length,1);
  assert.equal(matches[0].name,name);assert.ok(context.matchesFishSearch(matches[0],scientific));
 }
});
test('reference snapshots are fully covered, aliases resolve, and research forms are not counted as formal species',()=>{
 const audit=JSON.parse(fs.readFileSync('sources/fish/coverage-audit.json'));
 const names=new Set(fish.map(f=>f.scientific_name));
 assert.equal(audit.sources.find(s=>s.id==='rl-2022').coverage.length,71);
 assert.equal(audit.sources.find(s=>s.id==='fish-databank-2026').coverage.length,107);
 for(const source of audit.sources)for(const entry of source.coverage)assert.ok(names.has(entry.entry),entry.source_name);
 assert.equal(fish.filter(f=>f.taxon_kind==='species').length,123);
 assert.equal(fish.filter(f=>f.taxon_kind==='provisional').length,25);
 assert.equal(fish.find(f=>f.scientific_name==='Coregonus zugensis').status,'RE');
 assert.ok(!names.has('Salvelinus alpinus'));assert.ok(names.has('Salvelinus umbla'));
 assert.ok(context.matchesFishSearch(fish.find(f=>f.scientific_name==='Salvelinus umbla'),'Salvelinus alpinus'));
});
