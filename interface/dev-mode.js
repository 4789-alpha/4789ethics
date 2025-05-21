function toggleDevMode() {
  const enabled = localStorage.getItem('ethicom_dev') === 'true';
  if (enabled) {
    localStorage.removeItem('ethicom_dev');
    alert('Dev mode disabled. Reload to exit dev mode.');
  } else {
    localStorage.setItem('ethicom_dev', 'true');
    alert('Dev mode enabled. Reload the page to activate dev features.');
  }
}
window.toggleDevMode = toggleDevMode;
