import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pairs,standings,occurrenceDays,validateState,calendar,validDay} from '../club-core.mjs';
const members=[{id:'a',name:'A'},{id:'b',name:'B'},{id:'c',name:'C'}];
const event={id:'event',title:'Squash, Bern; Test',sport:'Squash',date:'2026-10-18',time:'19:00',duration:90,location:'Bern',interval:1,count:3};
test('each pair plays once',()=>assert.deepEqual(pairs(members),[{a:'a',b:'b'},{a:'a',b:'c'},{a:'b',b:'c'}]));
test('rankings separate sports and account for wins, draws and losses',()=>{
 const r=standings(members,[{a:'a',b:'b',sport:'Dart',x:3,y:1},{a:'a',b:'c',sport:'Dart',x:2,y:2},{a:'b',b:'c',sport:'Squash',x:3,y:0}],'Dart');
 assert.deepEqual(r.map(x=>[x.id,x.played,x.points]),[['a',2,4],['c',1,1],['b',1,0]]);assert.equal(r[0].for,5);assert.equal(r[0].against,3);
});
test('weekly occurrences preserve calendar days across winter clock change',()=>assert.deepEqual(occurrenceDays(event),['2026-10-18','2026-10-25','2026-11-01']));
test('ICS has Zurich timezone, duration, recurrence, alarm and escaped text',()=>{
 const ics=calendar([event],new Date('2026-11-06T12:00:00Z'));
 for(const part of ['TZID:Europe/Zurich','DTSTART;TZID=Europe/Zurich:20261018T190000','RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=3','DURATION:PT90M','SUMMARY:Squash\\, Bern\\; Test','TRIGGER:-PT1H'])assert.ok(ics.includes(part),part);
 assert.ok(ics.split('\r\n').every(line=>Buffer.byteLength(line)<=75));
});
test('reject invalid backups, duplicate ids, impossible dates and self matches',()=>{
 const state={version:1,events:[event],matches:[]};assert.ok(validateState(state,['a','b','c']));
 assert.equal(validDay('2026-02-30'),false);
 assert.equal(validateState({...state,events:[event,event]},['a','b']),false);
 assert.equal(validateState({...state,events:[{...event,time:'25:00'}]},['a','b']),false);
 assert.equal(validateState({...state,matches:[{id:'m',a:'a',b:'a',sport:'Dart',date:'2026-11-06',x:1,y:0}]},['a','b']),false);
});
