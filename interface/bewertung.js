// bewertung.js -- OP-0 rating with swipe control

async function initBewertung() {
  const container = document.getElementById('rating_container');
  if (!container) return;
  if (window.bewertungKeyHandler) {
    document.removeEventListener('keydown', window.bewertungKeyHandler);
    window.bewertungKeyHandler = null;
  }
  if (window.touchSettings && window.touchSettings.registerSwipeHandler)
    window.touchSettings.registerSwipeHandler(null);

  let list = [];
  let links = [];
  try {
    list = await fetch('sources/persons/human-op0-candidates.json').then(r => r.json());
  } catch { list = []; }
  try {
    links = await fetch('references/human-wiki-links.json').then(r => r.json());
  } catch { links = []; }
  const linkMap = {};
  links.forEach(l => { linkMap[l.human_id] = l.wiki; });
  const options = list.map(p => `<option value="${p.human_id}">${p.name}</option>`).join('');
  container.innerHTML = `
    <h3>Person bewerten</h3>
    <label for="human_sel">Person:</label>
    <select id="human_sel">${options}</select>
    <div id="sed_card" style="margin:0.5em 0;"></div>
    <label for="rating_sel">Bewertung:</label>
    <select id="rating_sel">
      <option value="yes">Ethisch</option>
      <option value="unclear">Unsicher</option>
      <option value="no">Unethisch</option>
    </select>
    <button onclick="submitBewertung()">Speichern</button>
    <button class="secondary-button" type="button" onclick="initBewertung()">Reset</button>
  `;
  applySedCard();
  const sel = document.getElementById('human_sel');
  if (sel) sel.addEventListener('change', applySedCard);

  function handle(dir) {
    const card = container;
    if (!card) return;
    card.classList.remove('swipe-left','swipe-right','swipe-up','swipe-down');
    const choiceEl = document.getElementById('rating_sel');
    if (dir === 'left') choiceEl.value = 'unclear';
    if (dir === 'up') choiceEl.value = 'yes';
    if (dir === 'down') choiceEl.value = 'no';
    if (dir === 'right') {
      const s = document.getElementById('human_sel');
      const id = s.value;
      const link = linkMap[id];
      if (link) window.open(link, '_blank');
    }
    card.classList.add('swipe-' + dir);
    setTimeout(() => card.classList.remove('swipe-left','swipe-right','swipe-up','swipe-down'), 300);
  }

  if (window.touchSettings && window.touchSettings.registerSwipeHandler)
    window.touchSettings.registerSwipeHandler(handle);
  window.bewertungKeyHandler = e => {
    if (e.code === 'ArrowLeft') handle('left');
    if (e.code === 'ArrowUp') handle('up');
    if (e.code === 'ArrowDown') handle('down');
    if (e.code === 'ArrowRight') handle('right');
  };
  document.addEventListener('keydown', window.bewertungKeyHandler);

  function applySedCard() {
    const s = document.getElementById('human_sel');
    const id = s.value;
    const obj = list.find(p => p.human_id === id) || {};
    const link = linkMap[id];
    const sed = document.getElementById('sed_card');
    if (!sed) return;
    sed.innerHTML = `<strong>${obj.name || ''}</strong>` + (link ? ` – <a href="${link}" target="_blank">Info</a>` : '');
  }
}

function submitBewertung() {
  const sel = document.getElementById('human_sel');
  const human_id = sel.value;
  const human_name = sel.options[sel.selectedIndex].textContent;
  const rating = document.getElementById('rating_sel').value;
  const timestamp = new Date().toISOString();
  const evalData = {
    human_id,
    person: human_name,
    rating,
    operator: 'anonymous',
    op_level: 'OP-0',
    timestamp
  };
  const out = document.getElementById('output');
  if (out) out.textContent = JSON.stringify(evalData, null, 2);
  if (typeof recordEvidence === 'function')
    recordEvidence(JSON.stringify(evalData), 'user');
}

if (typeof module !== 'undefined') {
  module.exports = { initBewertung, submitBewertung };
}
