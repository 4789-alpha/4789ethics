window.APP_VERSION = '1.0.0';
window.APP_COMMIT = '6692a03';

function displayVersionInfo() {
  var el = document.getElementById('version_footer');
  if (el) {
    el.textContent = 'Version ' + window.APP_VERSION + ' (' + window.APP_COMMIT + ')';
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', displayVersionInfo);
}
