(function() {
  function checkToken() {
    const data = JSON.parse(localStorage.getItem('gate_temp_token') || 'null');
    if (!data) return;
    const now = Date.now();
    const warn = document.getElementById('temp_warning');
    if (data.expires && data.expires - now < 3600 * 1000 && warn) {
      warn.textContent = 'Gatekeeper token expires soon';
      warn.style.display = 'block';
    }
    if (data.expires && data.expires <= now) {
      localStorage.removeItem('gate_temp_token');
      if (warn) warn.style.display = 'none';
    }
  }
  document.addEventListener('DOMContentLoaded', checkToken);
})();
