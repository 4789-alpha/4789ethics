function sanitize(path) {
  return path.replace(/\.{2,}/g, '').replace(/\\/g, '/');
}

async function loadExplorer(path = '') {
  const res = await fetch(`/api/explorer?path=${encodeURIComponent(path)}`);
  if (!res.ok) return;
  const entries = await res.json();
  const list = document.getElementById('file_list');
  list.innerHTML = '';
  const up = path.split('/').filter(Boolean);
  if (up.length) {
    const parent = up.slice(0, -1).join('/');
    const li = document.createElement('li');
    li.innerHTML = `<button data-path="${parent}">..</button>`;
    list.appendChild(li);
  }
  entries.forEach(e => {
    const li = document.createElement('li');
    if (e.dir) {
      li.innerHTML = `<button data-path="${sanitize(path ? path + '/' + e.name : e.name)}">${e.name}/</button>`;
    } else {
      li.textContent = e.name;
    }
    list.appendChild(li);
  });
  list.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => loadExplorer(btn.dataset.path));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadExplorer();
});

if (typeof window !== 'undefined') {
  window.loadExplorer = loadExplorer;
}
