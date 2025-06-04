function showDisclaimers(texts) {
  if (localStorage.getItem('disclaimer_accepted') === 'true') return;
  const overlay = document.createElement('div');
  overlay.id = 'disclaimer_overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.zIndex = 1000;
  const modal = document.createElement('div');
  modal.className = 'card';
  modal.style.maxWidth = '600px';
  modal.style.margin = '10% auto';
  modal.style.background = '#fff';
  modal.style.padding = '1em';
  const title = texts.disclaimer_title || 'Disclaimers';
  const items = Array.isArray(texts.disclaimer_items) ? texts.disclaimer_items : [];
  const accept = texts.btn_disclaimer_accept || 'I understand';
  modal.innerHTML = `
    <h3>${title}</h3>
    <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
    <button id="disclaimer_accept">${accept}</button>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.getElementById('disclaimer_accept').onclick = () => {
    localStorage.setItem('disclaimer_accepted', 'true');
    overlay.remove();
  };
}

if (typeof module !== 'undefined') {
  module.exports = { showDisclaimers };
}
