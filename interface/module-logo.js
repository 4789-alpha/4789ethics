// module-logo.js - insert current OP logo into page headers
// If a logo for the given OP level does not exist, the OP-0 logo is used.

function getLogoPath(opLevel) {
  const num = parseInt(String(opLevel).replace('OP-', '').split('.')[0], 10);
  const n = Number.isFinite(num) ? num : 0;
  const prefix = window.location.pathname.includes('/interface/') ||
                 window.location.pathname.includes('/wings/')
                   ? '../op-logo/'
                   : 'op-logo/';
  return `${prefix}tanna_op${n}.png`;
}

function insertModuleLogo() {
  const header = document.querySelector('header');
  if (!header) return;
  const level = typeof getStoredOpLevel === 'function'
    ? (getStoredOpLevel() || 'OP-0')
    : 'OP-0';
  const img = document.createElement('img');
  img.id = 'module_logo';
  img.className = 'module-logo';
  img.alt = level;
  img.src = getLogoPath(level);
  const fallbackPrefix = img.src.includes('../') ? '../op-logo/' : 'op-logo/';
  img.onerror = () => { img.onerror = null; img.src = `${fallbackPrefix}tanna_op0.png`; };
  header.prepend(img);
}

if (typeof window !== 'undefined') {
  window.getLogoPath = getLogoPath;
  document.addEventListener('DOMContentLoaded', insertModuleLogo);
}
