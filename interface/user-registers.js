window.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('last_page', location.pathname.replace(/^\//, ''));
  const token = localStorage.getItem('jwt');
  if(!token) return;

  const existing = document.getElementById('user_registers');
  if (existing) existing.remove();

  const modules = [
    { name: 'Bewertung', href: 'bewertung.html' },
    { name: 'Ethicom', href: 'interface/ethicom.html' },
    { name: 'Fish', href: 'interface/fish.html' }
  ];

  const aside = document.createElement('nav');
  aside.id = 'user_registers';
  aside.className = 'side-registers';

  const base = location.pathname.includes('/interface/') || location.pathname.includes('/wings/') ? '../' : '';
  aside.innerHTML = modules.map(m => `<a href="${base}${m.href}">${m.name}</a>`).join('');
  document.body.prepend(aside);

  const info = document.getElementById('user_info');
  if (info) {
    try {
      const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
      const name = sig.nickname || sig.alias || sig.email || 'User';
      const last = localStorage.getItem('last_page') || '';
      info.textContent = `${name} – letzte Seite: ${last}`;
    } catch {}
  }
});
