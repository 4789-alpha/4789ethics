// ethicom-interface.js - simple search and cover flow for ethicom

async function initEthicom() {
  const cover = document.getElementById('cover_flow');
  const searchInput = document.getElementById('search_query');
  const results = document.getElementById('search_results');
  let scores = {};
  let sources = [];

  try {
    scores = await fetch('../references/ethik-scores.json').then(r => r.json());
  } catch {}

  try {
    const main = await fetch('../sources/institutions/src-0001.json').then(r => r.json());
    sources.push(main);
  } catch {}
  try {
    const cand = await fetch('../sources/institutions/src-candidates.json').then(r => r.json());
    sources = sources.concat(cand);
  } catch {}

  const srcMap = {
    'SRC-0': 0, 'SRC-1': 1, 'SRC-2': 2, 'SRC-3': 3,
    'SRC-4': 4, 'SRC-5': 5, 'SRC-6': 6, 'SRC-7': 7, 'SRC-8+': 8
  };

  function toPercent(level) {
    const num = typeof level === 'number' ? level : srcMap[level] || 4;
    return Math.round((num / 8) * 100);
  }

  if (cover) {
    cover.innerHTML = sources.map(s => {
      const sc = scores[s.source_id]?.score;
      const pct = toPercent(sc);
      return `<div class="cover-item"><strong>${s.title}</strong><span>${pct}%</span></div>`;
    }).join('');
  }

  function performSearch(q) {
    const query = q.toLowerCase();
    results.innerHTML = '';
    if (!query) return;
    const matches = sources.filter(s =>
      s.source_id.toLowerCase().includes(query) ||
      (s.title && s.title.toLowerCase().includes(query))
    );
    matches.forEach(s => {
      const sc = scores[s.source_id]?.score;
      const pct = toPercent(sc);
      const li = document.createElement('li');
      li.textContent = `${s.source_id}: ${s.title} – ${pct}%`;
      results.appendChild(li);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => performSearch(e.target.value));
  }
}

document.addEventListener('DOMContentLoaded', initEthicom);
