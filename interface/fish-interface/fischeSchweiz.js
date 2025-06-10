async function initFischeSchweiz() {
  const table = document.getElementById('fisch_table');
  if (!table) return;
  try {
    const list = await fetch('../../sources/fish/swiss-fish.json').then(r => r.json());
    const bernData = await fetch('../../sources/fish/bern-fische.json').then(r => r.json());
    const sizeMap = {};
    bernData.forEach(f => { sizeMap[f.scientific_name] = f.max_cm; });
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
        imgElem.src = `../../${f.image}`;
        imgElem.alt = f.name;
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

      const sizeCell = document.createElement('td');
      sizeCell.textContent = sizeMap[f.scientific_name] || '';
      row.appendChild(sizeCell);

      const bernCell = document.createElement('td');
      bernCell.textContent = f.in_bern ? '✓' : '';
      row.appendChild(bernCell);

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  } catch (e) {
    table.innerHTML = '<tr><td colspan="7">Daten konnten nicht geladen werden. Bitte Seite neu laden.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', initFischeSchweiz);
