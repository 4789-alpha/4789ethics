window.APP_VERSION = '__VERSION__';
window.APP_COMMIT = '__COMMIT__';

function displayVersionInfo() {
  var el = document.getElementById('version_footer');
  if (el) {
    el.textContent = 'Version ' + window.APP_VERSION + ' (' + window.APP_COMMIT + ')';
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', displayVersionInfo);
}
