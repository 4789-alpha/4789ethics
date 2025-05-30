async function initFischeBern() {
  const table = document.getElementById('fisch_table');
  if (!table) return;
  try {
    const list = await fetch('../../sources/fish/bern-fische.json').then(r => r.json());
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

      [f.scientific_name, f.type, f.habitat, f.max_cm, f.spawn].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  } catch (e) {
    table.innerHTML = '<tr><td colspan="7">Fehler beim Laden der Daten.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', initFischeBern);
