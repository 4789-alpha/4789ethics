window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('jwt');
  if(!token) return;

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
});
