const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../verax/planner-core.js');
test('planner preserves editable tasks and environment through JSON round trip',()=>{
 const s=C.empty();s.track=[{lat:46.8,lng:7.5},{lat:46.801,lng:7.5}];s.waypoints=[{...C.templates[0],lat:46.8,lng:7.5,title:'Eigener Titel',solution:'Eigene Lösung'}];s.conditions.weather='Regen';
 const result=C.normalize(JSON.parse(JSON.stringify(s)));
 assert.equal(result.waypoints[0].title,'Eigener Titel');assert.equal(result.waypoints[0].solution,'Eigene Lösung');assert.equal(result.conditions.weather,'Regen');assert.ok(C.distance(result.track)>110&&C.distance(result.track)<112);
});
test('old Limen files remain readable and unsafe coordinates are rejected',()=>{
 const s=C.normalize({track:[{lat:46,lng:7}],waypoints:[{lat:46,lon:7,story:'Frühere Aufgabe'}]});assert.equal(s.waypoints[0].task,'Frühere Aufgabe');
 assert.throws(()=>C.normalize({track:[{lat:91,lng:7}],waypoints:[]}));assert.throws(()=>C.normalize({track:[{lat:'abc',lng:7}],waypoints:[]}));
});
test('GPX escapes user text and separates task positions from route track',()=>{
 const s=C.empty();s.name='A & B';s.track=[{lat:46,lng:7}];s.waypoints=[{lat:46.1,lng:7.1,title:'<Aufgabe>',task:'"x" & y'}];const g=C.gpx(s);assert.match(g,/A &amp; B/);assert.match(g,/&lt;Aufgabe&gt;/);assert.match(g,/<wpt lat="46.1"/);assert.match(g,/<trkpt lat="46"/);
});
