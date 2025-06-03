// bewertung.js -- OP-0 rating with swipe control

let ratingTexts = {};
let ratingInfo = {};
let detailsMap = {};
let candidateList = [];

function vibrateHeartbeat() {
  if (
    window.touchSettings &&
    window.touchSettings.state.haptics &&
    navigator.vibrate
  ) {
    navigator.vibrate([60, 40, 60]);
  }
}

async function loadRatingTexts() {
  try {
    const txt = await fetch('i18n/ui-text.json').then(r => r.json());
    const lang = (typeof getLanguage === 'function' ? getLanguage() : document.documentElement.lang) || 'de';
    ratingTexts = txt[lang] || txt.en || {};
  } catch {
    ratingTexts = {};
  }
}

async function loadRatings() {
  try {
    const list = await fetch('evidence/person-ratings.json').then(r => r.json());
    ratingInfo = {};
    list.forEach(r => {
      const num = parseInt(String(r.op_level).replace('OP-', '').split('.')[0], 10) || 0;
      if (!ratingInfo[r.human_id]) ratingInfo[r.human_id] = { counts: {}, max: 0 };
      ratingInfo[r.human_id].counts[r.rating] = (ratingInfo[r.human_id].counts[r.rating] || 0) + 1;
      if (num > ratingInfo[r.human_id].max) ratingInfo[r.human_id].max = num;
    });
  } catch {
    ratingInfo = {};
  }
}

async function loadDetails() {
  let details = [];
  try {
    details = await fetch('sources/persons/human-top100.json').then(r => r.json());
  } catch { details = []; }
  detailsMap = {};
  details.forEach(d => { detailsMap[d.human_id] = d; });
}

function pickRandomCandidate() {
  if (!candidateList.length) return null;
  const preferred = candidateList.filter(c => {
    const info = ratingInfo[c.human_id];
    return !info || info.max <= 1;
  });
  const pool = preferred.length ? preferred : candidateList;
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

async function initBewertung() {
  const container = document.getElementById('rating_container');
  if (!container) return;
  await loadRatingTexts();
  if (window.bewertungKeyHandler) {
    document.removeEventListener('keydown', window.bewertungKeyHandler);
    window.bewertungKeyHandler = null;
  }
  if (window.touchSettings && window.touchSettings.registerSwipeHandler)
    window.touchSettings.registerSwipeHandler(null);

  await loadRatings();
  await loadDetails();

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
  candidateList = list.map(p => {
    const det = detailsMap[p.human_id] || {};
    return Object.assign({}, p, det);
  });
  const options = list.map(p => `<option value="${p.human_id}">${p.name}</option>`).join('');
  container.innerHTML = `
    <h3>Person bewerten</h3>
    <label for="human_search">Suche:</label>
    <input type="text" id="human_search" placeholder="Name oder ID" />
    <ul id="search_results"></ul>
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
  const sel = document.getElementById('human_sel');
  const randomPick = pickRandomCandidate();
  if (sel && randomPick) sel.value = randomPick.human_id;
  applySedCard();
  if (sel) sel.addEventListener('change', applySedCard);
  const searchInput = document.getElementById('human_search');
  const resultsList = document.getElementById('search_results');
  if (searchInput) searchInput.addEventListener('input', e => performSearch(e.target.value));

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
      const info = ratingInfo[id];
      if (!info || info.max <= 1) {
        const total = info ? Object.values(info.counts).reduce((a, b) => a + b, 0) : 0;
        const choice = choiceEl.value;
        const same = info && info.counts[choice] ? info.counts[choice] : 0;
        const percent = total ? Math.round((same / total) * 100) : 0;
        alert(`Daten wurden in den Quellen überprüft. Anzahl bisherige Stimmen: ${total}, Stimmen gleicher Meinung: ${percent}%`);
      }
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

  function performSearch(q) {
    const query = q.toLowerCase();
    if (!resultsList) return;
    resultsList.innerHTML = '';
    if (!query) return;
    const matches = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.human_id && p.human_id.toLowerCase().includes(query))
    ).slice(0, 8);
    matches.forEach(m => {
      const li = document.createElement('li');
      li.textContent = `${m.name} (${m.human_id})`;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        if (sel) sel.value = m.human_id;
        applySedCard();
        if (resultsList) resultsList.innerHTML = '';
        if (searchInput) searchInput.value = '';
      });
      resultsList.appendChild(li);
    });
  }

  function applySedCard() {
    const s = document.getElementById('human_sel');
    const id = s.value;
    const obj = candidateList.find(p => p.human_id === id) || {};
    const link = linkMap[id];
    const sed = document.getElementById('sed_card');
    if (!sed) return;
    const img = obj.image ? `<img class="person-image" src="${obj.image}" alt="${obj.name}">` : '';
    const domain = obj.domain ? `<p>${obj.domain}</p>` : '';
    const era = obj.era ? `<p>${obj.era}</p>` : '';
    const desc = obj.description ? `<p>${obj.description}</p>` : '';
    sed.innerHTML = img + `<strong>${obj.name || ''}</strong>` +
      (link ? ` – <a href="${link}" target="_blank">Info</a>` : '') +
      domain + era + desc;
  }
}

function submitBewertung() {
  const sel = document.getElementById('human_sel');
  const human_id = sel.value;
  const human_name = sel.options[sel.selectedIndex].textContent;
  const rating = document.getElementById('rating_sel').value;
  const timestamp = new Date().toISOString();
  let operator = 'anonymous';
  let opLevel = 'OP-0';
  try {
    const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
    if (sig && sig.id) {
      operator = sig.id;
      opLevel = sig.op_level || 'OP-1';
    }
  } catch {}
  const evalData = {
    human_id,
    person: human_name,
    rating,
    operator,
    op_level: opLevel,
    timestamp
  };
  const out = document.getElementById('output');
  if (out) out.textContent = JSON.stringify(evalData, null, 2);
  if (typeof recordEvidence === 'function')
    recordEvidence(JSON.stringify(evalData), 'user');
  if (!ratingInfo[human_id]) ratingInfo[human_id] = { counts: {}, max: 0 };
  ratingInfo[human_id].counts[rating] = (ratingInfo[human_id].counts[rating] || 0) + 1;
  const lvl = parseInt(evalData.op_level.replace('OP-', '').split('.')[0], 10) || 0;
  if (lvl > ratingInfo[human_id].max) ratingInfo[human_id].max = lvl;
  alert(ratingTexts.rating_saved || 'Rating saved.');
  vibrateHeartbeat();
}

if (typeof module !== 'undefined') {
  module.exports = { initBewertung, submitBewertung };
}
