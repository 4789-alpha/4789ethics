async function initFischeSchweiz() {
  const table = document.getElementById('fisch_table');
  const searchInput = document.getElementById('fish_search');
  if (!table) return;
  try {
    const list = await fetch('../../sources/fish/swiss-fish.json').then(r => r.json());
    const bernData = await fetch('../../sources/fish/bern-fische.json').then(r => r.json());
    const maxMap = {};
    const spawnMap = {};
    bernData.forEach(f => {
      maxMap[f.scientific_name] = f.max_cm;
      if (f.spawn_cm) spawnMap[f.scientific_name] = f.spawn_cm;
    });
    const tbody = document.createElement('tbody');
    list.forEach(f => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = f.name;
      row.appendChild(nameCell);

      const imgCell = document.createElement('td');
      if (f.image) {
        const imgElem = document.createElement('img');
        imgElem.className = 'fish-image';
        imgElem.loading = 'lazy';
        imgElem.src = `../../${f.image}`;
        imgElem.alt = f.name;
        imgElem.style.cursor = 'pointer';
        imgElem.addEventListener('click', () => showFishPopin(f));
        imgCell.appendChild(imgElem);
      }
      row.appendChild(imgCell);

      const sciCell = document.createElement('td');
      sciCell.textContent = f.scientific_name;
      row.appendChild(sciCell);

      const origCell = document.createElement('td');
      origCell.textContent = f.origin;
      row.appendChild(origCell);

      const statusCell = document.createElement('td');
      statusCell.textContent = f.status;
      row.appendChild(statusCell);

      const spawnCell = document.createElement('td');
      spawnCell.textContent = f.spawn_cm || spawnMap[f.scientific_name] || '';
      row.appendChild(spawnCell);

      const maxCell = document.createElement('td');
      maxCell.textContent = f.max_cm || maxMap[f.scientific_name] || '';
      row.appendChild(maxCell);

      const bernCell = document.createElement('td');
      bernCell.textContent = f.in_bern ? '✓' : '';
      row.appendChild(bernCell);

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        Array.from(tbody.rows).forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }
  } catch (e) {
    table.innerHTML = '<tr><td colspan="8">Daten konnten nicht geladen werden. Bitte Seite neu laden.</td></tr>';
  }
}

function showFishPopin(f) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.zIndex = 1000;

  const box = document.createElement('div');
  box.className = 'card';
  box.style.background = '#fff';
  box.style.color = '#000';
  box.style.maxWidth = '90%';
  box.style.margin = '5% auto';
  box.style.position = 'relative';
  box.style.padding = '1em';

  const img = document.createElement('img');
  img.src = `../../${f.image}`;
  img.alt = f.name;
  img.style.maxWidth = '100%';
  box.appendChild(img);

  const info = document.createElement('p');
  info.innerHTML = `<strong>${f.name}</strong><br>${f.scientific_name}<br>Ursprung: ${f.origin}<br>Status: ${f.status}`;
  box.appendChild(info);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'X';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '0.5em';
  closeBtn.style.right = '0.5em';
  closeBtn.addEventListener('click', () => overlay.remove());
  box.appendChild(closeBtn);

  overlay.appendChild(box);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  overlay.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.remove(); });
  document.body.appendChild(overlay);
  setTimeout(() => closeBtn.focus(), 0);
}

document.addEventListener('DOMContentLoaded', initFischeSchweiz);
