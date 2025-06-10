// ratings.js - display overall ratings and rating history

async function initRatings() {
  const summary = document.getElementById('rating_summary');
  const library = document.getElementById('rating_library');
  const categories = document.getElementById('rating_categories');
  if (!summary || !library) return;

  try {
    const index = await fetch('../manifests/index.json').then(r => r.json());
    const ratings = [];

    const candidates = await fetch('../sources/institutions/src-candidates.json').then(r => r.json()).catch(() => []);
    const candidateMap = {};
    candidates.forEach(c => { candidateMap[c.source_id] = c; });

    for (const file of index) {
      const data = await fetch(`../manifests/${file}`).then(r => r.json());
      let details = null;
      try {
        details = await fetch(`../sources/institutions/${data.source_id}.json`).then(r => r.json());
      } catch {
        details = candidateMap[data.source_id] || null;
      }
      data.category = details && details.category ? details.category : '';
      data.title = details && details.title ? details.title : data.source_id;
      data.image = details && details.image ? details.image : '';
      ratings.push(data);
    }

    ratings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = 'Bewertungsverlauf';
    table.appendChild(caption);
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Zeitstempel</th><th>Quelle</th><th>Bild</th><th>Kategorie</th><th>SRC</th><th>OP</th><th>Logo</th><th>Kommentar</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    function makeOpLogo(level) {
      const base = parseInt(String(level).replace('OP-', '').split('.')[0], 10);
      const count = typeof getSignatureStrength === 'function'
        ? getSignatureStrength(level)
        : (base >= 8 ? base - 6 : 1);
      const hue = base >= 8 ? (base - 7) * 30 : 0;
      const srcNum = base >= 8 ? 7 : base;
      let html = '<span class="op-logo-group">';
      for (let i = 0; i < count; i++) {
        html += `<img class="citation-logo" src="../sources/images/op-logo/tanna_op${srcNum}.png" alt="Logo ${level}" style="filter: hue-rotate(-80deg) saturate(0.7) hue-rotate(${hue}deg);">`;
      }
      html += '</span>';
      return html;
    }

    const srcMap = {
      'SRC-0': 0, 'SRC-1': 1, 'SRC-2': 2, 'SRC-3': 3,
      'SRC-4': 4, 'SRC-5': 5, 'SRC-6': 6, 'SRC-7': 7, 'SRC-8+': 8
    };
    const reverseMap = Object.fromEntries(Object.entries(srcMap).map(([k,v]) => [v, k]));

    const perSource = {};

    const perCategory = {};

    ratings.forEach(r => {
      const row = document.createElement('tr');
      const logo = makeOpLogo(r.op_level);
      const img = r.image ? `<img class="source-image" src="../${r.image}" alt="${r.title}">` : '';
      row.innerHTML = `<td>${r.timestamp}</td><td title="${r.source_id}">${r.title}</td><td>${img}</td><td>${r.category}</td><td>${r.src_lvl}</td><td>${r.op_level}</td><td>${logo}</td><td>${r.comment || ''}</td>`;
      tbody.appendChild(row);

      const num = srcMap[r.src_lvl] || 0;
      if (!perSource[r.source_id]) perSource[r.source_id] = [];
      perSource[r.source_id].push(num);
      if (!perCategory[r.category]) perCategory[r.category] = [];
      perCategory[r.category].push(num);
    });

    table.appendChild(tbody);
    library.appendChild(table);

    const list = document.createElement('ul');
    for (const [src, nums] of Object.entries(perSource)) {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const level = reverseMap[Math.round(avg)] || `SRC-${Math.round(avg)}`;
      const li = document.createElement('li');
      li.textContent = `${src}: ${level} (ø ${avg.toFixed(2)})`;
      list.appendChild(li);
    }
    summary.appendChild(list);

    if (categories) {
      const clist = document.createElement('ul');
      for (const [cat, nums] of Object.entries(perCategory)) {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        const level = reverseMap[Math.round(avg)] || `SRC-${Math.round(avg)}`;
        const li = document.createElement('li');
        li.textContent = `${cat || 'Unbekannt'}: ${level} (ø ${avg.toFixed(2)})`;
        clist.appendChild(li);
      }
      categories.appendChild(clist);
    }
  } catch (e) {
    library.innerHTML =
      'Fehler beim Laden der Bibliothek. ' +
      'Bitte rufen Sie die Seite über <code>node tools/serve-interface.js</code> ' +
      'unter <a href="http://localhost:8080/ethicom.html">localhost</a> auf.';
  }
}

document.addEventListener('DOMContentLoaded', initRatings);
