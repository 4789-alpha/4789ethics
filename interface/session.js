// Simple session timeout logic
(function() {
  const SESSION_MINUTES = 30;
  let lastAction = Date.now();
  function reset() { lastAction = Date.now(); }
  function check() {
    if (Date.now() - lastAction > SESSION_MINUTES * 60 * 1000) {
      localStorage.removeItem('ethicom_signature');
      window.location.href = 'login.html';
    }
  }
  document.addEventListener('mousemove', reset);
  document.addEventListener('keydown', reset);
  setInterval(check, 60 * 1000);
})();

