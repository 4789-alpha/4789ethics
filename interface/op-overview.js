function renderOpOverview() {
  const container = document.getElementById('op_overview');
  if (!container) return;

  fetch('permissions/op-permissions-expanded.json')
    .then(r => r.json())
    .then(data => {
      const levels = [
        'OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-6',
        'OP-7','OP-7.5','OP-8','OP-9','OP-10','OP-11','OP-12'
      ];
      container.innerHTML = '';
      levels.forEach(level => {
        const card = document.createElement('section');
        card.className = 'card';
        const infoKey = level.toLowerCase();
        const perms = data[level] ? Object.keys(data[level]).filter(k => data[level][k]) : [];
        const list = perms.map(p => `<li>${p}</li>`).join('');
        card.innerHTML = `<h3>${level}</h3><p class="info" data-info="${infoKey}"></p>` +
          (list ? `<ul>${list}</ul>` : '<p>Keine Daten vorhanden.</p>');
        container.appendChild(card);
      });
      if (typeof applyInfoTexts === 'function') {
        applyInfoTexts(container);
      }
    })
    .catch(() => {
      container.textContent = 'Konnte OP-Daten nicht laden.';
    });
}

document.addEventListener('DOMContentLoaded', renderOpOverview);
