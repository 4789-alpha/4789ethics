// side-drop.js – simple slide-out menu for OP badge
let sideDropUrl = null;
let sideDropLoaded = false;

function initSideDrop(url) {
  const level =
    typeof getStoredOpLevel === 'function' &&
    typeof opLevelToNumber === 'function'
      ? opLevelToNumber(getStoredOpLevel())
      : 0;
  if (level < 6) return; // side drop only from OP‑6 interface

  sideDropUrl = url;
  const container = document.getElementById('side_drop');
  if (!container) return;

  container.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'side-drop-header badge-row';

  const badge = document.getElementById('badge_display');
  if (badge) {
    const badgeClone = badge.cloneNode(true);
    badgeClone.id = 'side_drop_badge';
    badgeClone.addEventListener('click', toggleSideDrop);
    header.appendChild(badgeClone);
  }

  const closeBtn = document.createElement('button');
  closeBtn.id = 'side_close_btn';
  if (typeof uiText !== 'undefined' && uiText.side_close) {
    closeBtn.textContent = uiText.side_close;
  } else {
    closeBtn.textContent = 'Close';
  }
  closeBtn.className = 'accent-button';
  closeBtn.addEventListener('click', toggleSideDrop);
  header.appendChild(closeBtn);

  container.appendChild(header);

  const content = document.createElement('div');
  content.id = 'side_drop_content';
  container.appendChild(content);
}

async function toggleSideDrop() {
  const container = document.getElementById('side_drop');
  if (!container) return;
  if (!sideDropLoaded && sideDropUrl) {
    try {
      const html = await fetch(sideDropUrl).then(r => r.text());
      const content = container.querySelector('#side_drop_content');
      if (content) {
        content.innerHTML = html;
        if (typeof applyTexts === 'function' && typeof uiText !== 'undefined') {
          applyTexts(uiText);
        }
        if (typeof applyInfoTexts === 'function') {
          applyInfoTexts(content);
        }
        if (typeof setupOpSideNav === 'function') {
          setupOpSideNav(content);
        }
      }
      sideDropLoaded = true;
    } catch {}
  }
  container.classList.toggle('open');
}

if (typeof window !== 'undefined') {
  window.initSideDrop = initSideDrop;
  window.toggleSideDrop = toggleSideDrop;
}
