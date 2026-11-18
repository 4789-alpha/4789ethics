'use strict';
const $=id=>document.getElementById(id), selected=new Set();let reports=[],papers=[],topic='';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>new Date(s+'T12:00:00').toLocaleDateString('de-CH');
const safeURL=s=>{try{const u=new URL(s);return u.protocol==='https:'?u.href:'#'}catch{return '#'}};
function comparison(){const chosen=papers.filter(p=>selected.has(p.id));$('comparison').hidden=!chosen.length;$('comparison-content').innerHTML=chosen.length?`<table><thead><tr><th>Merkmal</th>${chosen.map(p=>`<th>${esc(p.title)}</th>`).join('')}</tr></thead><tbody>${[['Publikationsstatus','status'],['Versuchsart','level'],['Neuerung','novelty'],['Evidenz & Grenzen','evidence'],['Nutzen fürs Projekt','use'],['Nächster Versuch','test']].map(([label,key])=>`<tr><td>${label}</td>${chosen.map(p=>`<td>${esc(p[key])}</td>`).join('')}</tr>`).join('')}</tbody></table>`:''}
function render(){const q=$('search').value.trim().toLocaleLowerCase('de'),level=$('evidence').value,scope=$('scope').value;
 const list=papers.filter(p=>(!topic||p.tags.includes(topic))&&(!level||p.level===level)&&(!scope||(scope==='baseline'?p.baseline:!p.baseline))&&(!q||JSON.stringify(p).toLocaleLowerCase('de').includes(q))).sort((a,b)=>$('sort').value==='asc'?a.published.localeCompare(b.published):b.published.localeCompare(a.published));
 $('count').textContent=`${list.length} von ${papers.length} Arbeiten · ${selected.size} zum Vergleich ausgewählt`;
 $('papers').innerHTML=list.length?list.map(p=>`<article class="paper"><div class="meta"><span>${date(p.published)} · ${esc(p.authors)}</span><span class="badge ${p.baseline?'':'new'}">${p.baseline?'Grundlage':'Neuer Fund'}</span><span class="badge">${esc(p.level)}</span></div><h3>${esc(p.title)}</h3><div class="meta">${esc(p.status)} · ${p.tags.map(esc).join(' / ')}</div><p class="novelty">${esc(p.novelty)}</p><details><summary>Evidenz, Projektnutzen & nächsten Versuch ansehen</summary><h4>Evidenz & Grenzen</h4><p>${esc(p.evidence)}</p><h4>Nutzen fürs Projekt · Einschätzung</h4><p>${esc(p.use)}</p><h4>Nächster Versuch · Vorschlag</h4><p>${esc(p.test)}</p></details><div class="paper-actions"><a href="${esc(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">Primärquelle öffnen ↗</a><label><input type="checkbox" data-id="${esc(p.id)}" ${selected.has(p.id)?'checked':''}>Zum Vergleich hinzufügen</label></div></article>`).join(''):'<p class="empty">Keine passende Arbeit. Passe die Filter an oder setze sie zurück.</p>';
 $('papers').querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{el.checked?selected.add(el.dataset.id):selected.delete(el.dataset.id);$('count').textContent=`${list.length} von ${papers.length} Arbeiten · ${selected.size} zum Vergleich ausgewählt`;comparison()}));comparison();
}
async function init(){try{
 const r=await fetch('research-journal.json',{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(!data.reports?.length)throw Error();
 reports=data.reports.sort((a,b)=>b.date.localeCompare(a.date));const seen=new Set();papers=reports.flatMap(r=>r.papers).filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true});
 $('freshness').textContent=`Letzte Recherche: ${date(reports[0].date)}`;
 const age=(Date.now()-new Date(reports[0].date+'T23:59:59+01:00').getTime())/86400000;
 $('latest').innerHTML=`<b>Recherche vom ${date(reports[0].date)}</b><p>${esc(reports[0].summary)}</p>${age>8?'<p class="error">Die letzte Recherche liegt mehr als acht Tage zurück. Es liegt noch kein neuer Wochenbericht vor.</p>':''}`;
 const tags=['','Robo-Fisch','Smart-Float','Antrieb','Servo','Druck','IMU','Akustik'];$('topics').innerHTML=tags.map(t=>`<button type="button" data-topic="${t}" aria-pressed="${!t}">${t||'Alle Themen'}</button>`).join('');
 $('topics').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{topic=b.dataset.topic;$('topics').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));
 $('runs').innerHTML=reports.map(r=>`<h3>${date(r.date)}</h3><p>${esc(r.summary)}</p><p>Suchfenster: ${date(r.windowStart)}–${date(r.date)}. ${esc(r.searchNotes)}</p>`).join('');
 ['search','evidence','scope','sort'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
 $('reset').onclick=()=>{$('search').value='';$('evidence').value='';$('scope').value='';$('sort').value='desc';$('topics').querySelector('button').click()};
 $('clear').onclick=()=>{selected.clear();render()};$('export').onclick=()=>{const out=selected.size?papers.filter(p=>selected.has(p.id)):papers;const u=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='robo-fisch-forschung.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};render();
 }catch{$('freshness').textContent='Recherche konnte nicht geladen werden.';$('papers').innerHTML='<p class="error">Bitte lade die Seite erneut. Die Journal ist als <a href="research-journal.json">JSON-Datei</a> verfügbar.</p>'}}
init();
