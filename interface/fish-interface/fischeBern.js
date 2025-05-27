async function initFischeBern() {
  const table = document.getElementById('fisch_table');
  if (!table) return;
  try {
    const list = await fetch('../../sources/fish/bern-fische.json').then(r => r.json());
    const tbody = document.createElement('tbody');
    list.forEach(f => {
      const row = document.createElement('tr');
      const img = f.image ? `<img class="fish-image" src="../../${f.image}" alt="${f.name}">` : '';
      row.innerHTML = `<td>${f.name}</td><td>${img}</td><td>${f.scientific_name}</td><td>${f.type}</td><td>${f.habitat}</td><td>${f.max_cm}</td><td>${f.spawn}</td>`;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  } catch (e) {
    table.innerHTML = '<tr><td colspan="7">Fehler beim Laden der Daten.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', initFischeBern);
