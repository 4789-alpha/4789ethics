function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-dark', 'theme-tanna');
  body.classList.add('theme-' + theme);
}

function initThemeSelection() {
  const select = document.getElementById('theme_select');
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
}

document.addEventListener('DOMContentLoaded', initThemeSelection);
