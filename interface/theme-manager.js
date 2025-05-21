function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-dark', 'theme-tanna', 'theme-ocean', 'theme-desert', 'theme-custom');
  if (theme === 'custom') {
    const custom = JSON.parse(localStorage.getItem('ethicom_custom_theme') || '{}');
    Object.keys(custom).forEach(k => document.documentElement.style.setProperty(k, custom[k]));
    body.classList.add('theme-custom');
  } else {
    body.classList.add('theme-' + theme);
  }
}

function initThemeSelection() {
  const select = document.getElementById('theme_select');
  const customBtn = document.getElementById('custom_theme_btn');
  let theme = localStorage.getItem('ethicom_theme') || 'dark';
  applyTheme(theme);
  if (select) {
    select.value = theme;
    select.addEventListener('change', e => {
      theme = e.target.value;
      localStorage.setItem('ethicom_theme', theme);
      applyTheme(theme);
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
  const primary = prompt('Primary color (hex or name):');
  if (!primary) return;
  const accent = prompt('Accent color (hex or name):');
  if (!accent) return;
  const custom = {
    '--primary-color': primary,
    '--accent-color': accent
  };
  localStorage.setItem('ethicom_custom_theme', JSON.stringify(custom));
  localStorage.setItem('ethicom_theme', 'custom');
  applyTheme('custom');
  const select = document.getElementById('theme_select');
  if (select) select.value = 'custom';
}

window.applyTheme = applyTheme;
window.createCustomTheme = createCustomTheme;

document.addEventListener('DOMContentLoaded', initThemeSelection);
