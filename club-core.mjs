export const sports = ['Dart', 'Squash'];
export function pairs(members) {
 return members.flatMap((a,i)=>members.slice(i+1).map(b=>({a:a.id,b:b.id})));
}
export function standings(members,matches,sport) {
 const rows=new Map(members.map(m=>[m.id,{id:m.id,name:m.name,played:0,won:0,drawn:0,lost:0,for:0,against:0,points:0}]));
 for(const m of matches.filter(m=>m.sport===sport)) {
  const a=rows.get(m.a),b=rows.get(m.b); if(!a||!b)continue;
  a.played++;b.played++;a.for+=m.x;a.against+=m.y;b.for+=m.y;b.against+=m.x;
  if(m.x===m.y){a.drawn++;b.drawn++;a.points++;b.points++;}
  else {const winner=m.x>m.y?a:b,loser=m.x>m.y?b:a;winner.won++;winner.points+=3;loser.lost++;}
 }
 return [...rows.values()].sort((a,b)=>Number(b.played>0)-Number(a.played>0)||b.points-a.points||(b.for-b.against)-(a.for-a.against)||b.for-a.for||a.name.localeCompare(b.name,'de-CH'));
}
export function validDay(day) {return /^\d{4}-\d{2}-\d{2}$/.test(day)&&!isNaN(Date.parse(day))&&new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day;}
export function occurrenceDays(event) {
 const first=new Date(event.date+'T12:00:00Z');
 return Array.from({length:event.count},(_,i)=>{const d=new Date(first);d.setUTCDate(d.getUTCDate()+7*event.interval*i);return d.toISOString().slice(0,10);});
}
export function validateState(s,ids) {
 if(!s||s.version!==1||!Array.isArray(s.events)||!Array.isArray(s.matches)||s.events.length>200||s.matches.length>2000)return false;
 const used=new Set();
 for(const e of s.events){if(!e||typeof e.id!=='string'||used.has(e.id)||typeof e.title!=='string'||!e.title.trim()||e.title.length>120||typeof e.location!=='string'||e.location.length>200||!sports.includes(e.sport)||!validDay(e.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time)||![0,1,2,4].includes(e.interval)||!Number.isInteger(e.count)||e.count<1||e.count>52||(e.interval===0&&e.count!==1)||!Number.isInteger(e.duration)||e.duration<15||e.duration>480)return false;used.add(e.id);}
 for(const m of s.matches){if(!m||typeof m.id!=='string'||used.has(m.id)||!ids.includes(m.a)||!ids.includes(m.b)||m.a===m.b||!sports.includes(m.sport)||!validDay(m.date)||![m.x,m.y].every(x=>Number.isInteger(x)&&x>=0&&x<=999))return false;used.add(m.id);}
 return true;
}
const escapeICS=s=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const compact=s=>s.replace(/[-:]/g,'');
function fold(line){let lines=[],part='',bytes=0;for(const char of line){const n=new TextEncoder().encode(char).length;if(bytes+n>73){lines.push(part);part=' ';bytes=1;}part+=char;bytes+=n;}lines.push(part);return lines.join('\r\n');}
export function calendar(events,stamp=new Date()) {
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BSVRB//Vereinsleben//DE','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:Europe/Zurich','BEGIN:DAYLIGHT','DTSTART:19700329T020000','TZOFFSETFROM:+0100','TZOFFSETTO:+0200','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU','END:DAYLIGHT','BEGIN:STANDARD','DTSTART:19701025T030000','TZOFFSETFROM:+0200','TZOFFSETTO:+0100','RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU','END:STANDARD','END:VTIMEZONE'];
 for(const e of events){
  lines.push('BEGIN:VEVENT','UID:'+escapeICS(e.id)+'@bsvrb.ch','DTSTAMP:'+stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART;TZID=Europe/Zurich:'+compact(e.date)+'T'+compact(e.time)+'00','DURATION:PT'+e.duration+'M','SUMMARY:'+escapeICS(e.title),'LOCATION:'+escapeICS(e.location),'DESCRIPTION:'+escapeICS(e.sport+' · Organisation: Stauffer. Terminplanung aus dem lokalen BSVRB-Vereinsbereich.'));
  if(e.interval)lines.push('RRULE:FREQ=WEEKLY;INTERVAL='+e.interval+';COUNT='+e.count);
  lines.push('BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:BSVRB-Termin in einer Stunde','END:VALARM','END:VEVENT');
 }
 return lines.concat('END:VCALENDAR').map(fold).join('\r\n')+'\r\n';
}
