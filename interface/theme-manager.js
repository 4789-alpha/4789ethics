function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-dark', 'theme-tanna', 'theme-ocean', 'theme-desert', 'theme-transparent', 'theme-custom', 'theme-tanna-dark', 'theme-dark-tanna');
  document.documentElement.style.removeProperty('--primary-color');
  document.documentElement.style.removeProperty('--accent-color');
  if (theme === 'custom') {
    const custom = JSON.parse(localStorage.getItem('ethicom_custom_theme') || '{}');
    Object.keys(custom).forEach(k => document.documentElement.style.setProperty(k, custom[k]));
    body.classList.add('theme-custom');
  } else {
    if (theme.includes('tanna')) {
      const saved = localStorage.getItem('ethicom_tanna_color');
      if (saved) {
        const { r, g, b } = JSON.parse(saved);
        const c = `rgb(${r},${g},${b})`;
        const h = `rgba(${Math.round(r*0.2)},${Math.round(g*0.2)},${Math.round(b*0.2)},0.9)`;
        const n = `rgba(${Math.round(r*0.3)},${Math.round(g*0.3)},${Math.round(b*0.3)},0.9)`;
        document.documentElement.style.setProperty('--primary-color', c);
        document.documentElement.style.setProperty('--accent-color', c);
        document.documentElement.style.setProperty('--header-bg', h);
        document.documentElement.style.setProperty('--nav-bg', n);
      }
    }
    body.classList.add('theme-' + theme);
  }
}

function initThemeSelection() {
  const select = document.getElementById('theme_select');
  const customBtn = document.getElementById('custom_theme_btn');
  const tannaCard = document.getElementById('tanna_color');
  let theme = localStorage.getItem('ethicom_theme') || 'dark';
  applyTheme(theme);
  if (tannaCard) tannaCard.style.display = theme.includes('tanna') ? 'block' : 'none';
  if (select) {
    select.value = theme;
    select.addEventListener('change', e => {
      theme = e.target.value;
      localStorage.setItem('ethicom_theme', theme);
      applyTheme(theme);
      if (tannaCard) tannaCard.style.display = theme.includes('tanna') ? 'block' : 'none';
    });
  }
  if (customBtn) {
    const opLevel = window.opLevelToNumber ? window.opLevelToNumber(window.getStoredOpLevel()) : 0;
    if (opLevel >= 4) {
      customBtn.style.display = 'block';
      customBtn.addEventListener('click', createCustomTheme);
    }
  }
}

function createCustomTheme() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.zIndex = 1000;

  const form = document.createElement('div');
  form.className = 'card';
  form.style.background = '#fff';
  form.style.color = '#000';
  form.innerHTML = `
    <h3>Custom Colors</h3>
    <label>Background: <input type="color" id="cc_bg" aria-label="background color"></label><br>
    <label>Text: <input type="color" id="cc_text" aria-label="text color" value="#ffffff"></label><br>
    <label>Primary: <input type="color" id="cc_primary" aria-label="primary color" value="#228B22"></label><br>
    <label>Accent: <input type="color" id="cc_accent" aria-label="accent color" value="#ccaa22"></label><br>
    <button id="cc_save">Save</button>
    <button id="cc_cancel">Cancel</button>
  `;
  overlay.appendChild(form);
  document.body.appendChild(overlay);

  document.getElementById('cc_cancel').addEventListener('click', () => overlay.remove());
  document.getElementById('cc_save').addEventListener('click', () => {
    const custom = {
      '--bg-color': document.getElementById('cc_bg').value,
      '--text-color': document.getElementById('cc_text').value,
      '--primary-color': document.getElementById('cc_primary').value,
      '--accent-color': document.getElementById('cc_accent').value
    };
    localStorage.setItem('ethicom_custom_theme', JSON.stringify(custom));
    localStorage.setItem('ethicom_theme', 'custom');
    applyTheme('custom');
    const select = document.getElementById('theme_select');
    if (select) select.value = 'custom';
    overlay.remove();
  });
}

window.applyTheme = applyTheme;
window.createCustomTheme = createCustomTheme;

document.addEventListener('DOMContentLoaded', initThemeSelection);
