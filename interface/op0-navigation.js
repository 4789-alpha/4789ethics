(function(){
  function getOpLevelFromUser(obj){
    if(obj && typeof obj.op_level !== 'undefined'){ return parseInt(obj.op_level, 10); }
    return null;
  }
  function getOpLevel(){
    let lvl = getOpLevelFromUser(window.user);
    if(lvl === null && typeof getStoredOpLevel === 'function'){
      const stored = getStoredOpLevel();
      if(stored){ lvl = parseInt(String(stored).replace('OP-',''), 10); }
    }
    if(Number.isNaN(lvl)) lvl = null;
    return lvl;
  }
  function insertNav(){
    if(document.querySelector('nav')) return;
    const base = (location.pathname.includes('/interface/') || location.pathname.includes('/wings/')) ? '../' : '';
    const navHtml =
      '<nav class="op0-nav">'+
      `<a href="${base}index.html" class="icon-only" aria-label="Home">\u{1F3E0}</a>`+
      `<a href="${base}interface/settings.html" class="icon-only" aria-label="Settings">\u2699</a>`+
      `<a href="${base}interface/login.html" class="icon-only" aria-label="Login">\u{1F511}</a>`+
      `<a href="${base}interface/signup.html">Signup</a>`+
      `<a href="${base}README.html" class="icon-only readme-link" aria-label="Help">?</a>`+
      '</nav>';
    document.body.insertAdjacentHTML('afterbegin', navHtml);
  }
  document.addEventListener('DOMContentLoaded', function(){
    const level = getOpLevel();
    if(level === 0){ insertNav(); }
  });
})();
