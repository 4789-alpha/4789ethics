(function(root, factory) { if (typeof module === 'object' && module.exports) module.exports = factory(); else root.VeraxPlanner = factory(); })(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const categories = ['Tiere', 'Geschicklichkeit', 'Denken', 'Natur', 'Begegnung', 'Orientierung'];
  const templates = [
    ['T001','Tiere','Reh am Weg','Ein Reh steht auf dem gedachten Weg. Wie entscheidest du dich?','Beobachten, Abstand halten und eine ruhige Alternative begründen.'],
    ['T002','Tiere','Weidetiere','Eine Weide liegt zwischen dir und dem nächsten Punkt. Plane eine Alternative.','Öffentliche Wege wählen und den Umweg auf der Karte erklären.'],
    ['T003','Tiere','Hundebegegnung','Eine fiktive Hundebegegnung versperrt den direkten Weg.','Anhalten, Abstand und Kommunikation als Optionen abwägen.'],
    ['G001','Geschicklichkeit','Balance-Linie','Gehe zehn ruhige Schritte entlang einer gedachten Linie auf ebenem Boden.','Kontrolliert gehen; bei Bedarf kürzere Strecke oder sitzende Armübung.'],
    ['G002','Geschicklichkeit','Zielwurf','Wirf drei weiche Bälle in einen markierten Zielbereich.','Mindestens ein Treffer; Distanz und Zielgrösse anpassen.'],
    ['G003','Geschicklichkeit','Koordination','Berühre abwechselnd mit der rechten und linken Hand das gegenüberliegende Knie.','Zehn kontrollierte Wechsel, stehend oder sitzend.'],
    ['D001','Denken','Zahlenfolge','Welche Zahl folgt: 2, 6, 12, 20, …? Begründe.','30: Die Abstände sind 4, 6, 8, 10.'],
    ['D002','Denken','Ressourcenentscheid','Du hast 20 Minuten. Weg A dauert 12 Minuten und braucht 6 Energiepunkte; B dauert 18 Minuten und braucht 3. Du hast 4 Energiepunkte.','B erfüllt beide Grenzen. Annahmen und Alternativen erklären.'],
    ['D003','Denken','Perspektivenwechsel','Zwei Personen wollen denselben engen Weg in entgegengesetzter Richtung nutzen.','Zwei faire Lösungen formulieren und die Auswirkungen erklären.'],
    ['N001','Natur','Gedachter Bach','Ein fiktiver Bach unterbricht die Route. Plane den nächsten Abschnitt neu.','Eine bestehende Brücke oder einen sicheren öffentlichen Umweg wählen.'],
    ['N002','Natur','Wetterwechsel','Im Szenario beginnt starker Regen. Prüfe Weg und Ausrüstung.','Anpassen, umkehren oder pausieren und den Entscheid begründen.'],
    ['B001','Begegnung','Gemeinsamer Weg','Ein fiktives Hindernis lässt nur eine Person gleichzeitig passieren.','Reihenfolge gemeinsam festlegen und Bedürfnisse berücksichtigen.'],
    ['B002','Begegnung','Hilfe abwägen','Im Szenario bittet jemand um Hilfe, während deine Zeit knapp wird.','Hilfsmöglichkeiten, eigene Grenzen und Folgen benennen.'],
    ['O001','Orientierung','Richtung finden','Bestimme die Richtung zum nächsten Wegpunkt ohne ihm direkt zu folgen.','Richtung auf der Karte zeigen und mit dem Wegverlauf vergleichen.'],
    ['O002','Orientierung','Beobachtung','Präge dir drei unbewegliche Merkmale am Weg ein.','Nach einer Minute wiedergeben; alternativ drei Merkmale beschreiben.']
  ].map(([id,category,title,task,solution])=>({id,category,title,task,solution,difficulty:'Mittel',minutes:3,attempts:1,notes:'Als Spielaufgabe gestalten; Tiere und Gefahren nur als Szenario darstellen.'}));
  function empty() { return {version:1,name:'Meine VERAX-Route',conditions:{weather:'Trocken',time:'Tag',traffic:'Wenig',temperature:15},track:[],waypoints:[],image:''}; }
  function normalize(value) {
    if (!value || typeof value !== 'object' || !Array.isArray(value.track) || !Array.isArray(value.waypoints)) throw Error('Keine VERAX-Datei: track und waypoints fehlen.');
    if(value.track.length>5000 || value.waypoints.length>200) throw Error('Maximal 5000 Routenpunkte und 200 Aufgaben.');
    const point = p => { const lat=Number(p.lat),lng=Number(p.lng ?? p.lon); if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180) throw Error('Ungültige Koordinaten.'); return {lat,lng}; };
    const str=(v,f='')=>String(v ?? f).slice(0,4000);
    const num=(v,f,max)=>Math.min(max,Math.max(1,Number(v)||f));
    return { ...empty(),name:str(value.name,'Importierte Route'),conditions:{...empty().conditions,...value.conditions},track:value.track.map(point),image:typeof value.image==='string' && /^data:image\/(png|jpeg|webp);base64,/.test(value.image) && value.image.length<3000000?value.image:'',waypoints:value.waypoints.map((w,i)=>({...point(w),id:'station-'+i,category:categories.includes(w.category)?w.category:'Denken',title:str(w.title ?? w.name, 'Station '+(i+1)),task:str(w.task ?? w.story),solution:str(w.solution),difficulty:['Leicht','Mittel','Schwer'].includes(w.difficulty)?w.difficulty:'Mittel',minutes:num(w.minutes,3,120),attempts:num(w.attempts ?? w.versuche,1,99),notes:str(w.notes)}))};
  }
  function distance(track) { let m=0; for(let i=1;i<track.length;i++){const a=track[i-1],b=track[i],r=Math.PI/180;const h=Math.sin((b.lat-a.lat)*r/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin((b.lng-a.lng)*r/2)**2;m+=6371000*2*Math.asin(Math.min(1,Math.sqrt(h)));}return Math.round(m); }
  const xml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function gpx(s) {return '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="VERAX" xmlns="http://www.topografix.com/GPX/1/1">'+s.waypoints.map(w=>`<wpt lat="${w.lat}" lon="${w.lng}"><name>${xml(w.title)}</name><desc>${xml(w.task)}</desc></wpt>`).join('')+`<trk><name>${xml(s.name)}</name><trkseg>`+s.track.map(p=>`<trkpt lat="${p.lat}" lon="${p.lng}"/>`).join('')+'</trkseg></trk></gpx>'; }
  return {categories,templates,empty,normalize,distance,gpx};
});
