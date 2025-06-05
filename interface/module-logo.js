// module-logo.js - insert current OP logo into page headers
// If a logo for the given OP level does not exist, the OP-0 logo is used.

function getLogoPath(opLevel) {
  const num = parseInt(String(opLevel).replace('OP-', '').split('.')[0], 10);
  const n = Number.isFinite(num) ? num : 0;
  const prefix = window.location.pathname.includes('/interface/') ||
                 window.location.pathname.includes('/wings/')
                   ? '../sources/images/op-logo/'
                   : 'sources/images/op-logo/';
  return `${prefix}tanna_op${n}.png`;
}

function insertModuleLogo() {
  const header = document.querySelector('header');
  if (!header) return;
  const custom = header.getAttribute('data-logo');
  const level = typeof getStoredOpLevel === 'function'
    ? (getStoredOpLevel() || 'OP-0')
    : 'OP-0';
  const src = getLogoPath(level);
  const fallback = src.includes('../') ? '../sources/images/op-logo/tanna_op0.png' : 'sources/images/op-logo/tanna_op0.png';
  const h1 = header.querySelector('h1');
  const size = h1 ? getComputedStyle(h1).fontSize : '1em';
  header.classList.add('with-logo');
  header.style.backgroundImage = `url('${src}')`;
  header.style.backgroundRepeat = 'no-repeat';
  header.style.backgroundPosition = '0.5em center';
  header.style.backgroundSize = `auto calc(${size} * 1.5)`;
  header.style.paddingLeft = `calc(${size} * 1.5 + 1em)`;

  if (!h1) return;
  const img = new Image();
  img.onerror = () => { header.style.backgroundImage = `url('${fallback}')`; };
  img.src = src;
}

if (typeof window !== 'undefined') {
  window.getLogoPath = getLogoPath;
  document.addEventListener('DOMContentLoaded', insertModuleLogo);
}
