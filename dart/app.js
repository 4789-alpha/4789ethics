(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const E = window.DartEngine;
  let game = null, snapshots = [], mult = 1, stream = null, micStream = null, recorder = null;
  let archive = [], urls = [];
  const read = (key, fallback) => {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}};
  const store = (key, value) => {try {localStorage.setItem(key, JSON.stringify(value));} catch {$('game-status').textContent = 'Speichern auf diesem Gerät nicht möglich. Bitte das Archiv exportieren.';}};
  const text = (tag, value, cls) => {const el = document.createElement(tag); el.textContent = value; if (cls) el.className = cls; return el;};
  $('name').value = String(read('bsvrb.dart.name', '')).slice(0,32);
  const savedArchive = read('bsvrb.dart.archive', []);
  if (Array.isArray(savedArchive)) archive = savedArchive.filter(item => item && item.game && Array.isArray(item.game.players) && Array.isArray(item.game.events) && typeof item.date === 'string');
  const saved = read('bsvrb.dart.current', null);
  if (saved) {try {E.createGame(saved.players.map(p => p.name), saved.start, saved.out, saved.board); if (saved.players.every(p => Number.isInteger(p.remaining) && p.remaining >= 0 && p.remaining <= saved.start) && Array.isArray(saved.events) && Number.isInteger(saved.active) && saved.active >= 0 && saved.active < saved.players.length && Number.isInteger(saved.turnDarts) && saved.turnDarts >= 0 && saved.turnDarts < 4) game = saved;} catch {}}
  const ruleName = out => ({double:'Double Out',single:'Single Out',master:'Master Out'})[out];
  function save() {if (game) store('bsvrb.dart.current', game);}
  function rebuildVideos() {
    const videos = $('videos');
    const localVideo = document.querySelector('#local-video');
    videos.replaceChildren();
    const players = game ? game.players : [{name: $('name').value || 'Dein Board'}];
    players.forEach((p,i) => {
      const tile = text('div', '', 'tile' + (i === (game?.active ?? 0) ? ' active' : ''));
      const placeholder = text('div', i === 0 ? '◎\nDein Board · Kamera aus' : '◎\nLokaler Mitspieler · keine Kamera verbunden', 'placeholder');
      tile.append(placeholder);
      if (i === 0) {
        const video = localVideo || document.createElement('video'); video.id = 'local-video'; video.autoplay = true; video.playsInline = true; video.muted = true;
        video.srcObject = stream; tile.append(video); placeholder.hidden = !!stream;
      }
      const caption = text('div', '', 'caption'); caption.append(text('span',p.name),text('span',i === (game?.active ?? 0) ? 'AM WURF' : 'WARTET')); tile.append(caption); videos.append(tile);
    });
  }
  function render() {
    rebuildVideos(); $('scores').replaceChildren(); $('history').replaceChildren();
    if (game) {
      $('game-title').textContent = game.winner === null ? game.players[game.active].name + ' ist am Wurf.' : game.players[game.winner].name + ' gewinnt das Leg!';
      $('rulebadge').textContent = `${game.start} · ${ruleName(game.out)} · ${game.board === 'steel' ? 'Steel' : 'Soft'}`;
      game.players.forEach((p,i) => {
        const row = text('div','','score' + (i === game.active ? ' active' : '')); const name = text('div',p.name);
        name.append(text('small', `${E.stats(game,i).darts} Darts · Ø ${E.stats(game,i).average.toFixed(1)}`)); row.append(name,text('strong',p.remaining)); $('scores').append(row);
      });
      game.events.slice().reverse().forEach(e => $('history').append(text('li', `${game.players[e.player].name}: ${e.base === 0 ? 'Fehlwurf' : ['','S','D','T'][e.mult]+e.base} · ${e.points} Punkte${e.bust ? ' · Bust, gesamte Aufnahme zurückgesetzt' : ''}`)));
    }
    document.querySelectorAll('#numbers button,#miss,#bull25,#bull50,#endturn').forEach(b => b.disabled = !game || game.winner !== null);
    $('undo').disabled = !snapshots.length;
    renderStats();
  }
  function renderStats() {
    const current = game ? E.stats(game,0) : {average:0,darts:0,busts:0};
    $('stats').replaceChildren();
    [['Average · '+(game?.players[0].name || 'Spieler A'),current.average.toFixed(1)],['Geworfene Darts',current.darts],['Busts',current.busts],['Archivierte Legs',archive.length]].forEach(([label,value])=> {const card=text('div',''); card.append(text('strong',value),text('span',label)); $('stats').append(card);});
    const selected = $('filter-player').value;
    $('filter-player').replaceChildren(new Option('Alle',''));
    [...new Set(archive.flatMap(item=>item.game.players.map(p=>p.name)))].forEach(n=>$('filter-player').add(new Option(n,n)));
    $('filter-player').value = selected;
    const filtered=archive.filter(item=>(!selected || item.game.players.some(p=>p.name===selected)) && (!$('filter-board').value || item.game.board===$('filter-board').value));
    $('archive').replaceChildren();
    if (!filtered.length) $('archive').append(text('p','Noch keine passenden abgeschlossenen Legs.','muted'));
    filtered.slice().reverse().forEach(item=>{const row=text('div','','archive-row');row.append(text('strong',item.game.players[item.game.winner]?.name+' gewinnt'),text('span',` · ${new Date(item.date).toLocaleString('de-CH')} · ${item.game.start} · ${item.game.board === 'steel' ? 'Steel' : 'Soft'} · ${item.game.players.map(p=>p.name).join(' / ')}`));$('archive').append(row);});
  }
  function throwDart(base, multiplier) {
    if (!game) return;
    try {
      const previous = game; game = E.throwDart(game,{base,mult:multiplier}); snapshots.push(previous);
      if (game.winner !== null) {game.archiveId = crypto.randomUUID(); archive.push({id:game.archiveId,date:new Date().toISOString(),game:JSON.parse(JSON.stringify(game))});store('bsvrb.dart.archive',archive);}
      save();render();
      $('game-status').textContent = game.winner !== null ? 'Game shot! Leg gespeichert. Korrektur bleibt möglich.' : game.events.at(-1).bust ? 'Bust. Aufnahme zurückgesetzt. Nächster Spieler.' : `${game.turnDarts || 3} Dart(s) erfasst. ${game.turnDarts ? 'Noch '+(3-game.turnDarts)+' Dart(s).' : 'Nächste Aufnahme.'}`;
    } catch(error) {$('game-status').textContent=error.message;}
  }
  for(let n=1;n<=20;n++){const button=text('button',n);button.type='button';button.addEventListener('click',()=>throwDart(n,mult));$('numbers').append(button);}
  document.querySelectorAll('[data-mult]').forEach(button=>button.addEventListener('click',()=>{mult=Number(button.dataset.mult);document.querySelectorAll('[data-mult]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
  $('miss').onclick=()=>throwDart(0,1);$('bull25').onclick=()=>throwDart(25,1);$('bull50').onclick=()=>throwDart(25,2);
  $('setup').onsubmit=event=>{event.preventDefault();if(game && game.winner===null && game.events.length && !confirm('Laufendes Leg verwerfen und neu starten?'))return;try{const names=[$('name').value,...$('others').value.split(',')].map(n=>n.trim()).filter(Boolean);game=E.createGame(names,Number($('start').value),$('out').value,$('board').value);snapshots=[];store('bsvrb.dart.name',names[0]);save();render();$('game-status').textContent='Training gestartet. Jeder Dart wird einzeln erfasst.';$('spiel').scrollIntoView({behavior:'smooth'});}catch(error){$('game-status').textContent=error.message;}};
  $('undo').onclick=()=>{if(!snapshots.length)return;if(game.archiveId){archive=archive.filter(a=>a.id!==game.archiveId);store('bsvrb.dart.archive',archive);}game=snapshots.pop();save();render();$('game-status').textContent='Letzte Aktion zurückgenommen. Richtigen Treffer erneut eingeben.';};
  $('endturn').onclick=()=>{if(!game || game.winner!==null)return;if(!game.turnDarts){$('game-status').textContent='Eine leere Aufnahme bitte mit drei Fehlwürfen erfassen.';return;}snapshots.push(JSON.parse(JSON.stringify(game)));E.nextTurn(game);save();render();$('game-status').textContent='Aufnahme vorzeitig beendet. Nur tatsächlich erfasste Darts zählen zur Statistik.';};
  function download(blob,name,label,target){const url=URL.createObjectURL(blob);urls.push(url);const a=text('a',label);a.href=url;a.download=name;target.append(a);return a;}
  $('export').onclick=()=>{const a=download(new Blob([JSON.stringify({version:1,archive},null,2)],{type:'application/json'}),'bsvrb-dart-archiv.json','Archiv herunterladen',$('downloads'));a.click();};
  $('filter-player').onchange=renderStats;$('filter-board').onchange=renderStats;
  function stopMic(){micStream?.getTracks().forEach(t=>t.stop());micStream=null;$('mic').textContent='Mikrofon für Aufnahme: aus';}
  function stopCamera(){stream?.getTracks().forEach(t=>t.stop());stream=null;stopMic();$('camera').textContent='Kamera einschalten';$('record').disabled=true;rebuildVideos();}
  async function startCamera(){
    if(!navigator.mediaDevices?.getUserMedia){$('media-status').textContent='Kamera benötigt HTTPS oder localhost und einen Browser mit Kamerazugriff.';return;}
    try {const selected=$('camera-select').value;stream=await navigator.mediaDevices.getUserMedia({video:selected?{deviceId:{exact:selected},width:{ideal:1920},height:{ideal:1080}}:{width:{ideal:1920},height:{ideal:1080}},audio:false});$('camera').textContent='Kamera ausschalten';$('record').disabled=typeof MediaRecorder==='undefined';rebuildVideos();$('media-status').textContent='Kamera aktiv. Es findet keine automatische Treffererkennung und keine Übertragung statt.';
    const devices=await navigator.mediaDevices.enumerateDevices();$('camera-select').replaceChildren(new Option('Standardkamera',''));devices.filter(d=>d.kind==='videoinput').forEach((d,i)=>$('camera-select').add(new Option(d.label||'Kamera '+(i+1),d.deviceId)));if(selected)$('camera-select').value=selected;
    stream.getVideoTracks()[0].onended=()=>{stopCamera();$('media-status').textContent='Kamera wurde vom Gerät beendet.';};
    }catch{$('media-status').textContent='Kamera konnte nicht geöffnet werden. Freigabe, Geräteauswahl und andere Kamera-Apps prüfen.';}}
  $('camera').onclick=()=>{if(recorder?.state==='recording'){$('media-status').textContent='Bitte zuerst die Aufnahme stoppen.';return;}if(stream)stopCamera();else startCamera();};
  $('camera-select').onchange=async()=>{if(recorder?.state==='recording'){$('media-status').textContent='Bitte zuerst die Aufnahme stoppen.';return;}if(stream){stopCamera();await startCamera();}};
  $('mic').onclick=async()=>{if(recorder?.state==='recording'){$('media-status').textContent='Mikrofon bitte vor der Aufnahme einstellen.';return;}if(micStream){stopMic();return;}if(!stream){$('media-status').textContent='Bitte zuerst die Kamera einschalten.';return;}try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true},video:false});$('mic').textContent='Mikrofon für Aufnahme: ein';}catch{$('media-status').textContent='Mikrofon nicht verfügbar oder nicht freigegeben.';}};
  $('record').onclick=()=>{
    if(recorder?.state==='recording'){recorder.stop();return;}
    if(!stream)return;
    if(!confirm('Lokales Boardvideo aufnehmen'+(micStream?' – einschliesslich Mikrofonton':'')+'? Bitte die Zustimmung aller aufgenommenen Personen sicherstellen.'))return;
    try{const combined=new MediaStream([...stream.getVideoTracks(),...(micStream?.getAudioTracks()||[])]);recorder=new MediaRecorder(combined);const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=()=>{const type=recorder.mimeType;download(new Blob(chunks,{type}),'bsvrb-board-'+Date.now()+(type.includes('mp4')?'.mp4':'.webm'),'Boardaufnahme herunterladen',$('downloads'));$('record').textContent='Video aufnehmen';$('media-status').textContent='Aufnahme beendet. Jetzt herunterladen; beim Verlassen geht sie verloren.';};recorder.start(1000);$('record').textContent='● Aufnahme stoppen';$('media-status').textContent='Lokale Videoaufnahme läuft. Lange Aufnahmen benötigen entsprechend Arbeitsspeicher.';}catch{$('media-status').textContent='Videoaufnahme wird auf diesem Gerät nicht unterstützt.';}
  };
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('videos').requestFullscreen();}catch{$('media-status').textContent='Vollbild ist auf diesem Gerät nicht verfügbar.';}};
  window.addEventListener('beforeunload',e=>{if(recorder?.state==='recording'){e.preventDefault();e.returnValue='';}});
  window.addEventListener('pagehide',()=>{recorder?.state==='recording'&&recorder.stop();stream?.getTracks().forEach(t=>t.stop());stopMic();urls.forEach(u=>URL.revokeObjectURL(u));});
  render();
})();
