async function initFischEditor() {
  const table = document.getElementById('fisch_table');
  const addBtn = document.getElementById('add_fish_btn');
  if (!table || !addBtn) return;
  let list = [];
  try {
    list = await fetch('../../sources/fish/bern-fische.json').then(r => r.json());
  } catch (e) {
    table.innerHTML = '<tr><td colspan="6">Fehler beim Laden der Daten.</td></tr>';
  }

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  function render() {
    tbody.innerHTML = '';
    list.forEach(f => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${f.name}</td><td>${f.scientific_name}</td><td>${f.type}</td><td>${f.habitat}</td><td>${f.max_cm}</td><td>${f.spawn}</td>`;
      tbody.appendChild(row);
    });
  }

  render();

  addBtn.addEventListener('click', () => {
    const name = document.getElementById('fish_name').value.trim();
    if (!name) return;
    const fish = {
      name,
      scientific_name: document.getElementById('fish_scientific').value.trim(),
      type: document.getElementById('fish_type').value.trim(),
      habitat: document.getElementById('fish_habitat').value.trim(),
      max_cm: document.getElementById('fish_max').value.trim(),
      spawn: document.getElementById('fish_spawn').value.trim()
    };
    list.push(fish);
    render();
  });
}

document.addEventListener('DOMContentLoaded', initFischEditor);
