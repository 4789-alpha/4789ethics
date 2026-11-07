const FISH_STATUS = {
  LC: 'Nicht gefährdet', NT: 'Potenziell gefährdet', VU: 'Verletzlich',
  EN: 'Stark gefährdet', CR: 'Vom Aussterben bedroht', RE: 'In der Schweiz ausgestorben',
  DD: 'Unzureichende Datengrundlage', NA: 'Nicht anwendbar', NE: 'Nicht beurteilt'
};
const FISH_BERN = {documented: 'Belegt', historical: 'Historisch', uncertain: 'Zuordnung offen', no_record: 'Kein BE-Beleg'};
const FISH_COLUMNS = [
  {key:'name',label:'Name'}, {key:'image',label:'Bild'},
  {key:'form_description',label:'Formbeschrieb'}, {key:'information',label:'Lebensraum & Wissen'},
  {key:'fishing_method',label:'Fangmethoden'}, {key:'bait',label:'Passende Köder'},
  {key:'scientific_name',label:'Wissenschaftlicher Name'}, {key:'origin',label:'Ursprung'},
  {key:'status',label:'Status'}, {key:'spawn_cm',label:'Ø-Grösse nach 1. Laichen (cm)'},
  {key:'max_cm',label:'Maximale Grösse (cm)'}, {key:'bern',label:'Im Kanton Bern'},
  {key:'closed_season_be',label:'Schonzeit BE'}, {key:'min_length_be',label:'Fangmass BE'},
  {key:'catch_window_be',label:'Fangfenster BE'}, {key:'catch_quota_be',label:'Fangzahlen BE'}
];
const FISH_KIND={species:'Art',life_form:'Lebensform',aggregate:'Artengruppe',provisional:'Forschungsform (unbeschrieben)'};
const FISH_ORDER_KEY = 'bsvrb-fish-columns-v1';
const fishCollator = new Intl.Collator('de-CH', {sensitivity:'base', numeric:true});
function formatFishSize(value) {
  return value == null || value === '' || !Number.isFinite(Number(value)) ? '' : String(Math.round(Number(value)));
}
function fishColumnOrder(saved) {
  const keys = FISH_COLUMNS.map(c=>c.key);
  return Array.isArray(saved) ? [...new Set(saved.filter(k=>keys.includes(k))), ...keys.filter(k=>!saved.includes(k))] : keys;
}
function moveFishColumn(order, key, target) {
  const next=order.filter(k=>k!==key);
  next.splice(Math.max(0, Math.min(target, next.length)), 0, key);
  return next;
}
function compareFish(a, b, key, direction=1) {
  let x, y;
  if (key==='spawn_cm' || key==='max_cm') {
    x=formatFishSize(a[key]); y=formatFishSize(b[key]);
    if (x==='' || y==='') return x===y ? fishCollator.compare(a.name,b.name) : x==='' ? 1 : -1;
    return (Number(x)-Number(y))*direction || fishCollator.compare(a.name,b.name);
  }
  if (key==='status') {
    const ranks={LC:0,NT:1,VU:2,EN:3,CR:4,RE:5};
    x=ranks[a.status]; y=ranks[b.status];
    if(x==null || y==null) return x===y ? fishCollator.compare(a.status,b.status)*direction : x==null ? 1 : -1;
    return (x-y)*direction || fishCollator.compare(a.name,b.name);
  }
  if (key==='bern') {
    const ranks={documented:0,historical:1,uncertain:2,no_record:3};
    return ((ranks[a.bern_occurrence.state] ?? 3)-(ranks[b.bern_occurrence.state] ?? 3))*direction || fishCollator.compare(a.name,b.name);
  }
  return fishCollator.compare(key==='image'?a.name:a[key]||'', key==='image'?b.name:b[key]||'')*direction || fishCollator.compare(a.name,b.name);
}
function matchesFishSearch(f, query) {
  const tokens=text=>text.toLocaleLowerCase('de-CH').normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const wanted=tokens(query); if(!wanted.length) return true;
  const words=tokens([f.name,f.scientific_name,f.origin,f.status,FISH_STATUS[f.status],f.form_description,f.information,f.fishing_method,f.bait,FISH_BERN[f.bern_occurrence.state],f.bern_occurrence.detail].join(' '));
  const names=tokens([f.name,f.scientific_name,...(f.aliases||[])].join(' '));
  return wanted.every(term=>names.some(name=>name.includes(term)) || words.some(word=>word.startsWith(term)));
}
function fishText(tag, text, className) {
  const el=document.createElement(tag); el.textContent=text;
  if(className) el.className=className;
  return el;
}
function fishSourceLinks(ids, references) {
  const links=document.createElement('div'); links.className='fish-sources';
  [...new Set(ids)].forEach(id=>{
    const ref=references[id]; if(!ref) return;
    const link=fishText('a',ref.title);link.href=ref.url;link.target='_blank';link.rel='noopener';links.append(link);
  });
  return links;
}

function attachFishRules(f, regulations) {
  const assignment=regulations.species[f.scientific_name];
  const rules=regulations.groups[assignment?.group];
  if(!rules)throw new Error('Fangregeln fehlen: '+f.scientific_name);
  return {...f,bern_rules:rules,rule_assignment:assignment,rule_metadata:regulations,
    closed_season_be:rules.summary.closed,min_length_be:rules.summary.length,
    catch_window_be:rules.summary.window,catch_quota_be:rules.summary.quota};
}
function fishRulesView(f,references) {
  const panel=document.createElement('section');panel.className='fish-rules';
  const rules=f.bern_rules,meta=f.rule_metadata;
  panel.append(fishText('h3','Berner Fangregeln: '+rules.title),fishText('p',`Rechtsstand ${meta.law_effective_from} · geprüft ${meta.reviewed_on}`,'fish-image-note'),fishText('p',meta.scope));
  if(f.rule_assignment.note)panel.append(fishText('p',f.rule_assignment.note,'fish-rule-notice'));
  const summary=document.createElement('dl');
  [['Schonzeit',rules.summary.closed],['Fangmindestmass',rules.summary.length],['Fangfenster',rules.summary.window],['Fangzahlen',rules.summary.quota]].forEach(([label,value])=>summary.append(fishText('dt',label),fishText('dd',value)));panel.append(summary);
  function ruleTable(title,rows,fields) {
    if(!rows.length)return;panel.append(fishText('h4',title));
    const scroll=document.createElement('div');scroll.className='fish-rules-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',title);
    const table=document.createElement('table'),head=document.createElement('thead'),tr=document.createElement('tr');
    fields.forEach(([,label])=>{const th=fishText('th',label);th.scope='col';tr.append(th);});head.append(tr);table.append(head);
    const body=document.createElement('tbody');rows.forEach(row=>{const tr=document.createElement('tr');fields.forEach(([key])=>tr.append(fishText('td',row[key]||'–')));body.append(tr);});table.append(body);scroll.append(table);panel.append(scroll);
  }
  ruleTable('Grundregeln und abweichende Grenzgewässer',rules.rows,[['water','Gewässer / Geltungsbereich'],['length','Mindestmass'],['closed','Schonzeit (Fang gesperrt)'],['legal','Rechtsgrundlage']]);
  ruleTable('Fangfenster: entnehmbare Längen im genannten Zeitraum',rules.windows,[['water','Gewässer / Abschnitt'],['length','Entnehmbare Länge'],['period','Zeitraum des Fensters'],['legal','Rechtsgrundlage']]);
  const notes=document.createElement('ul');rules.notes.forEach(note=>notes.append(fishText('li',note)));panel.append(notes,fishSourceLinks(rules.source_ids,references));
  const general=document.createElement('details');general.append(fishText('summary','Allgemeine Regeln, Messweise und Geltungsbereich'));meta.general.forEach(note=>general.append(fishText('p',note)));general.append(fishSourceLinks(meta.source_ids,references));panel.append(general);return panel;
}

async function initFischeSchweiz() {
  const table=document.getElementById('fisch_table'); if(!table) return;
  const search=document.getElementById('fish_search');
  const count=document.getElementById('fish_count');
  const sortChoice=document.getElementById('fish_sort');
  const sortDirection=document.getElementById('fish_direction');
  const bernFilter=document.getElementById('fish_bern');
  const kindFilter=document.getElementById('fish_kind');
  let order=fishColumnOrder(null), sortKey='name', direction=1, dragged=null;
  try { order=fishColumnOrder(JSON.parse(localStorage.getItem(FISH_ORDER_KEY))); } catch {}
  const getJson=async url=>{const response=await fetch(url);if(!response.ok)throw new Error('Datenabruf fehlgeschlagen');return response.json();};
  try {
    const [list,bernData,references,regulations]=await Promise.all([
      getJson('../../sources/fish/swiss-fish.json?v=20261107-rules'),getJson('../../sources/fish/bern-fische.json'),getJson('../../sources/fish/references.json?v=20261107-rules'),getJson('../../sources/fish/bern-regulations.json?v=20261107-rules')
    ]);
    const bernMap=new Map(bernData.map(f=>[f.scientific_name,f]));
    const fish=list.map(f=>attachFishRules({...f,spawn_cm:f.spawn_cm??bernMap.get(f.scientific_name)?.spawn_cm,max_cm:f.max_cm??bernMap.get(f.scientific_name)?.max_cm},regulations));
    const columns=new Map(FISH_COLUMNS.map(c=>[c.key,c]));
    FISH_COLUMNS.forEach(c=>{const option=fishText('option',c.label);option.value=c.key;sortChoice.append(option);});
    function saveOrder() { try {localStorage.setItem(FISH_ORDER_KEY,JSON.stringify(order));}catch{} }
    function reorder(key,target) {order=moveFishColumn(order,key,target);saveOrder();render();count.textContent+=' Spalte '+columns.get(key).label+' verschoben.';}
    function sort(key) {direction=sortKey===key?-direction:1;sortKey=key;render();table.querySelector(`[data-column="${key}"] button`)?.focus();}
    function makeCell(f,key) {
      const cell=document.createElement('td');cell.dataset.column=key;
      if(key==='image') {
        if(f.image) {
          const button=document.createElement('button');button.type='button';button.className='fish-image-button';button.setAttribute('aria-label',f.name+' vergrössern und Steckbrief öffnen');
          const img=document.createElement('img');img.className='fish-image';img.loading='lazy';img.src='../../'+f.image;img.alt='Illustration: '+f.name;
          img.addEventListener('error',()=>{button.replaceChildren(fishText('span','Bild nicht verfügbar'));},{once:true});
          button.append(img);button.addEventListener('click',()=>showFishPopin(f,references));cell.append(button);
          if(f.image_caption)cell.append(fishText('small',f.image_caption,'fish-image-note'));
        } else cell.textContent='Keine Zeichnung vorhanden';
      } else if(['closed_season_be','min_length_be','catch_window_be','catch_quota_be'].includes(key)) {
        const button=fishText('button',f[key],'fish-rule-button');button.type='button';button.title='Gewässerregeln und Quellen öffnen';button.addEventListener('click',()=>showFishPopin(f,references,true));cell.append(button);
      } else if(key==='bern') {
        cell.append(fishText('span',FISH_BERN[f.bern_occurrence.state],'fish-bern fish-bern-'+f.bern_occurrence.state));
        const detail=document.createElement('details');detail.append(fishText('summary','Beleg & Einordnung'),fishText('p',f.bern_occurrence.detail),fishSourceLinks(f.bern_occurrence.source_ids,references));cell.append(detail);
      } else if(key==='fishing_method') {
        cell.append(fishText('span',f.fishing_method));
        if(f.fishing_note)cell.append(fishText('small',f.fishing_note,'fish-image-note'));
      } else if(key==='status') {
        const abbr=fishText('abbr',f.status);abbr.title=FISH_STATUS[f.status]||f.status;cell.append(abbr);
      } else if(key==='spawn_cm'||key==='max_cm')cell.textContent=formatFishSize(f[key])||'–';
      else if(key==='name') {
        const button=fishText('button',f.name,'fish-name-button');button.type='button';button.addEventListener('click',()=>showFishPopin(f,references));cell.append(button);if(f.taxon_kind&&f.taxon_kind!=='species')cell.append(fishText('small',FISH_KIND[f.taxon_kind],'fish-taxon-kind'));
      } else cell.textContent=f[key]||'–';
      return cell;
    }
    function render() {
      sortChoice.value=sortKey;sortDirection.textContent=direction===1?'Aufsteigend ↑':'Absteigend ↓';
      const head=document.createElement('thead'),header=document.createElement('tr');
      order.forEach(key=>{
        const th=document.createElement('th');th.scope='col';th.dataset.column=key;th.draggable=true;
        th.setAttribute('aria-sort',key===sortKey?(direction===1?'ascending':'descending'):'none');
        const button=fishText('button',columns.get(key).label+(key===sortKey?(direction===1?' ↑':' ↓'):' ↕'),'fish-sort-button');button.type='button';button.addEventListener('click',()=>sort(key));
        const grip=fishText('button','⠿','fish-drag-handle');grip.type='button';grip.setAttribute('aria-label','Spalte '+columns.get(key).label+' verschieben');grip.title='Ziehen zum Verschieben · Alt + Pfeiltaste für Tastatur';
        grip.addEventListener('keydown',e=>{if(e.altKey&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();reorder(key,order.indexOf(key)+(e.key==='ArrowLeft'?-1:1));table.querySelector(`[data-column="${key}"] .fish-drag-handle`)?.focus();}});
        grip.addEventListener('pointerdown',e=>{
          if(e.button!==0)return;e.preventDefault();e.stopPropagation();grip.setPointerCapture(e.pointerId);
          let target=key,moved=false;const start=e.clientX;th.classList.add('fish-dragging');
          const move=event=>{if(Math.abs(event.clientX-start)<5&&!moved)return;moved=true;
            const scroller=table.closest('.table-scroll'),bounds=scroller.getBoundingClientRect();
            if(event.clientX>bounds.right-50)scroller.scrollLeft+=24;else if(event.clientX<bounds.left+50)scroller.scrollLeft-=24;
            const over=document.elementFromPoint(event.clientX,event.clientY)?.closest('th[data-column]');
            table.querySelectorAll('.fish-drop').forEach(el=>el.classList.remove('fish-drop'));
            if(over&&table.contains(over)){target=over.dataset.column;over.classList.add('fish-drop');}
          };
          const finish=event=>{grip.removeEventListener('pointermove',move);grip.removeEventListener('pointerup',finish);grip.removeEventListener('pointercancel',cancel);th.classList.remove('fish-dragging');table.querySelectorAll('.fish-drop').forEach(el=>el.classList.remove('fish-drop'));if(event.type!=='pointercancel'&&moved&&target!==key)reorder(key,order.indexOf(target));};
          const cancel=event=>finish(event);grip.addEventListener('pointermove',move);grip.addEventListener('pointerup',finish);grip.addEventListener('pointercancel',cancel);
        });
        grip.addEventListener('dragstart',e=>e.preventDefault());
        th.append(grip,button);th.title='Titel anklicken zum Sortieren; Spaltenkopf oder Griff ziehen zum Verschieben.';
        th.addEventListener('dragstart',e=>{dragged=key;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',key);});
        th.addEventListener('dragover',e=>{if(dragged){e.preventDefault();e.dataTransfer.dropEffect='move';th.classList.add('fish-drop');}});
        th.addEventListener('dragleave',()=>th.classList.remove('fish-drop'));
        th.addEventListener('dragend',()=>{dragged=null;table.querySelectorAll('.fish-drop').forEach(el=>el.classList.remove('fish-drop'));});
        th.addEventListener('drop',e=>{e.preventDefault();if(dragged&&dragged!==key)reorder(dragged,order.indexOf(key));dragged=null;});header.append(th);
      });head.append(header);
      const query=search.value.trim().toLocaleLowerCase('de-CH');
      const visible=fish.filter(f=>(!bernFilter.value||f.bern_occurrence.state===bernFilter.value) && (!kindFilter.value||f.taxon_kind===kindFilter.value) && matchesFishSearch(f,query)).sort((a,b)=>compareFish(a,b,sortKey,direction));
      const body=document.createElement('tbody');
      visible.forEach(f=>{const row=document.createElement('tr');order.forEach(key=>row.append(makeCell(f,key)));body.append(row);});
      if(!visible.length){const row=document.createElement('tr'),cell=fishText('td','Keine Fische für diese Auswahl.');cell.colSpan=order.length;row.append(cell);body.append(row);}
      table.replaceChildren(head,body);count.textContent=`${visible.length} von ${fish.length} Einträgen · Sortierung: ${columns.get(sortKey).label}, ${direction===1?'aufsteigend':'absteigend'}`;
    }
    search.addEventListener('input',render);bernFilter.addEventListener('change',render);kindFilter.addEventListener('change',render);
    sortChoice.addEventListener('change',()=>{sortKey=sortChoice.value;direction=1;render();});
    sortDirection.addEventListener('click',()=>{direction=-direction;render();});
    document.getElementById('fish_reset').addEventListener('click',()=>{order=fishColumnOrder(null);sortKey='name';direction=1;search.value='';bernFilter.value='';kindFilter.value='';saveOrder();render();});
    render();
  } catch(error) {
    const body=document.createElement('tbody'),row=document.createElement('tr'),cell=fishText('td','Daten konnten nicht geladen werden. Bitte Seite neu laden.');cell.colSpan=FISH_COLUMNS.length;row.append(cell);body.append(row);table.replaceChildren(body);count.textContent='Daten nicht verfügbar.';
  }
}
function showFishPopin(f,references={},focusRules=false) {
  const previous=document.activeElement;
  const dialog=document.createElement('dialog');dialog.className='fish-dialog';dialog.setAttribute('aria-labelledby','fish-dialog-title');
  const close=fishText('button','Schliessen ×','fish-dialog-close');close.type='button';close.addEventListener('click',()=>dialog.close());
  const title=fishText('h2',f.name);title.id='fish-dialog-title';dialog.append(close,title,fishText('p',f.scientific_name,'fish-scientific'));
  if(f.image){const img=document.createElement('img');img.src='../../'+f.image;img.alt='Illustration: '+f.name;img.className='fish-dialog-image';dialog.append(img);}
  if(f.taxon_kind)dialog.append(fishText('p',FISH_KIND[f.taxon_kind],'fish-taxon-kind'));
  if(f.image_note)dialog.append(fishText('p',f.image_note,'fish-image-note'));
  dialog.append(fishText('h3','Formbeschrieb'),fishText('p',f.form_description),fishText('h3','Lebensraum & Wissen'),fishText('p',f.information));
  dialog.append(fishText('h3','Fangmethoden & passende Köder'),fishText('p',f.fishing_method),fishText('p','Köder: '+f.bait),fishText('p',f.fishing_note),fishSourceLinks(f.fishing_source_ids||[],references));
  if(f.bern_rules)dialog.append(fishRulesView(f,references));
  dialog.append(fishText('p',`Ursprung: ${f.origin} · Status: ${f.status} – ${FISH_STATUS[f.status]||''}`));
  if(f.status_note)dialog.append(fishText('p',f.status_note));
  dialog.append(fishText('h3','Im Kanton Bern: '+FISH_BERN[f.bern_occurrence.state]),fishText('p',f.bern_occurrence.detail),fishText('p','Quellenprüfung: '+f.bern_occurrence.reviewed_on));
  dialog.append(fishSourceLinks(f.bern_occurrence.source_ids,references),fishText('h3','Weiterlesen'),fishSourceLinks(f.profile_source_ids||[],references));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{dialog.remove();previous?.focus();},{once:true});document.body.append(dialog);dialog.showModal();if(focusRules)dialog.querySelector('.fish-rules')?.scrollIntoView({block:'start'});
}
document.addEventListener('DOMContentLoaded',initFischeSchweiz);
