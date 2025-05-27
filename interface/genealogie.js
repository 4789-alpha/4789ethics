async function initGenealogie(){
  try {
    const data = await fetch('../sources/persons/human-top100.json').then(r => r.json());
    const list = document.getElementById('genealogie_list');
    if(list) list.innerHTML = data.slice(0,5).map(p => `<li>${p.name} (${p.era})</li>`).join('');
  } catch(err) {
    const list = document.getElementById('genealogie_list');
    if(list) list.textContent = 'Fehler beim Laden der Daten.';
  }
}
if(typeof window!=='undefined') window.initGenealogie = initGenealogie;
