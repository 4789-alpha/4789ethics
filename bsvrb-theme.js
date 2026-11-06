// Run in the head so the saved or system appearance applies before first paint.
(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const read = () => { try { return localStorage.getItem('bsvrb_theme'); } catch { return null; } };
  const valid = value => ['light', 'dark'].includes(value) ? value : 'system';
  let choice = valid(read());
  function apply() {
    root.dataset.themePreference = choice;
    root.dataset.theme = choice === 'system' ? (system.matches ? 'dark' : 'light') : choice;
    document.dispatchEvent(new Event('bsvrb-theme-change'));
  }
  window.BsvrbTheme = {set(value) {
    choice = valid(value);
    try { localStorage.setItem('bsvrb_theme', choice); } catch { /* Still applies for this page. */ }
    apply();
  }};
  system.addEventListener('change', apply);
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === 'bsvrb_theme') { choice = valid(read()); apply(); }
  });
  apply();
})();
