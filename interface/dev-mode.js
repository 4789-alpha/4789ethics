function toggleDevMode() {
  localStorage.removeItem('ethicom_dev');
  alert('Dev mode disabled for security (4789).');
}
window.toggleDevMode = toggleDevMode;
