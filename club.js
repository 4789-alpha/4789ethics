import {pairs,standings,occurrenceDays,validateState,calendar} from './club-core.mjs';
const $=s=>document.querySelector(s);
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const say=text=>{const status=$('#club-status');if(status)status.textContent=text;};
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const pretty=day=>new Intl.DateTimeFormat('de-CH',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z'));
const download=(name,text,type)=>{const u=URL.createObjectURL(new Blob([text],{type}));const a=node('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
async function start(){
 const response=await fetch('bsvrb-members.json');if(!response.ok)throw Error('Mitgliederliste nicht erreichbar.');
 const {members,roleNote}=await response.json();
 document.querySelectorAll('[data-member-cards]').forEach(target=>{target.replaceChildren();for(const member of members){
  const row=node('div',undefined,'member-row');row.append(node('strong',member.name),node('span',member.role),node('span',member.sports.join(' · '),'small'));target.append(row);
 }});
 document.querySelectorAll('.role-note').forEach(n=>n.textContent=roleNote);
 if(!$('#event-form'))return;
 const key='bsvrb_club_v1',ids=members.map(m=>m.id),name=id=>members.find(m=>m.id===id)?.name||id;
 let state={version:1,events:[],matches:[]},sport='Dart',storageReady=true;
 try{const saved=localStorage.getItem(key);if(saved){const parsed=JSON.parse(saved);if(!validateState(parsed,ids))throw Error();state=parsed;}}
 catch{storageReady=false;say('Lokaler Speicher nicht verfügbar oder gespeicherte Daten nicht lesbar. Vorhandene Daten werden nicht überschrieben. Sichere neue Eingaben vor dem Schliessen als Datei.');}
 const save=next=>{
  if(!validateState(next,ids)){say('Die Eingaben sind ungültig. Bitte Datum und Resultate prüfen.');return false;}
  state=next;
  try{if(!storageReady)throw Error();localStorage.setItem(key,JSON.stringify(state));say('Auf diesem Gerät gespeichert.');}
  catch{say('Nur für diese Sitzung übernommen. Bitte jetzt eine Sicherung herunterladen, da die lokale Speicherung nicht verfügbar ist.');}
  render();return true;
 };
 function remove(type,id){save({...state,[type]:state[type].filter(e=>e.id!==id)});}
 function entry(title,detail,type,id){const row=node('div',undefined,'club-entry'),body=node('div');body.append(node('strong',title),node('p',detail));row.append(body);if(type){const b=node('button','Entfernen','delete-entry');b.type='button';b.setAttribute('aria-label',title+' entfernen');b.onclick=()=>remove(type,id);row.append(b);}return row;}
 function render(){
  const dates=state.events.flatMap(e=>occurrenceDays(e).map(date=>({...e,date}))).filter(e=>e.date>=today()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $('#next-events').replaceChildren(...(dates.length?dates.slice(0,6).map(e=>entry(e.title,pretty(e.date)+' · '+e.time+' · '+e.location)): [node('p','Noch keine kommenden Termine. Lege links einen Termin an.','small')]));
  $('#calendar-export').disabled=!state.events.length;
  $('#event-list').replaceChildren(...(state.events.length?state.events.map(e=>entry(e.title,pretty(e.date)+' · '+e.time+' · '+e.count+' Termin(e)', 'events',e.id)):[node('p','Noch keine Terminreihen.','small')]));
  $('#ranking-title').textContent=sport+'-Rangliste';
  let previous='',rank=0;
  const rows=standings(members,state.matches,sport).map((r,i)=>{const tr=node('tr'),tie=[r.points,r.for-r.against,r.for].join(':');if(tie!==previous){rank=i+1;previous=tie;}[r.played?rank:'–',r.name,r.played,r.points,r.for-r.against].forEach(v=>tr.append(node('td',String(v))));return tr;});
  $('#rankings').replaceChildren(...rows);
  const played=state.matches.filter(m=>m.sport===sport).sort((a,b)=>b.date.localeCompare(a.date));
  $('#match-list').replaceChildren(...(played.length?played.map(m=>entry(name(m.a)+' '+m.x+' : '+m.y+' '+name(m.b),pretty(m.date),'matches',m.id)):[node('p','Noch keine Resultate für '+sport+'.','small')]));
 }
 const pairings=pairs(members);
 $('#pairings').replaceChildren(...pairings.map((p,i)=>node('div',(i+1)+' · '+name(p.a)+' – '+name(p.b),'pair-line')));
 pairings.forEach((p,i)=>{const option=node('option',name(p.a)+' – '+name(p.b));option.value=String(i);$('#match-pair').append(option);});
 function scoreLabels(){const pair=pairings[Number($('#match-pair').value)];$('#score-a-label').textContent=name(pair.a);$('#score-b-label').textContent=name(pair.b);}
 $('#match-pair').onchange=scoreLabels;scoreLabels();
 $('#event-date').value=today();$('#match-date').value=today();
 $('#event-interval').onchange=()=>{const interval=Number($('#event-interval').value);$('#event-count').disabled=!interval;$('#event-count').value=interval?'8':'1';};
 $('#event-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget),interval=Number(f.get('interval'));const event={id:crypto.randomUUID(),title:String(f.get('title')).trim(),sport:String(f.get('sport')),date:String(f.get('date')),time:String(f.get('time')),duration:Number(f.get('duration')),location:String(f.get('location')).trim(),interval,count:interval?Number(f.get('count')):1};if(save({...state,events:[...state.events,event]}))$('#event-title').value='';};
 $('#match-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget),p=pairings[Number(f.get('pair'))];if(save({...state,matches:[...state.matches,{id:crypto.randomUUID(),...p,sport,date:String(f.get('date')),x:Number(f.get('x')),y:Number(f.get('y'))}]})){$('#score-a').value='';$('#score-b').value='';}};
 document.querySelectorAll('[data-sport]').forEach(b=>b.onclick=()=>{sport=b.dataset.sport;document.querySelectorAll('[data-sport]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});
 $('#calendar-export').onclick=()=>download('bsvrb-termine.ics',calendar(state.events),'text/calendar;charset=utf-8');
 $('#backup-export').onclick=()=>download('bsvrb-vereinsplanung-'+today()+'.json',JSON.stringify(state,null,2),'application/json');
 $('#backup-import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{
  if(file.size>1000000)throw Error('Die Datei ist zu gross (maximal 1 MB).');
  const imported=JSON.parse(await file.text());if(!validateState(imported,ids))throw Error('Die Datei enthält keine gültige BSVRB-Planung.');
  const next={version:1};for(const type of ['events','matches']){const merged=new Map(state[type].map(x=>[x.id,x]));for(const item of imported[type]){const old=merged.get(item.id);if(old&&Object.keys(item).some(k=>JSON.stringify(item[k])!==JSON.stringify(old[k])))throw Error('Eintrag '+item.id+' widerspricht einem vorhandenen Eintrag. Import abgebrochen.');merged.set(item.id,item);}next[type]=[...merged.values()];}
  save(next);
 }catch(err){say(err.message||'Import fehlgeschlagen.');}finally{e.target.value='';}};
 render();
}
start().catch(err=>{document.querySelectorAll('[data-member-cards]').forEach(n=>n.textContent='Die Mitgliederübersicht konnte nicht geladen werden. Bitte die Seite erneut öffnen.');say(err.message||'Der Vereinsbereich konnte nicht geladen werden.');});
