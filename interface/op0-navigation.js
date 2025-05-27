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
      `<a href="${base}home.html">Home</a>`+
      `<a href="${base}bewertung.html">Bewertung</a>`+
      `<a href="${base}interface/settings.html">Settings</a>`+
      `<a href="${base}interface/login.html">Login</a>`+
      `<a href="${base}wings/ratings.html">Ratings</a>`+
      `<a href="${base}interface/signup.html">Signup</a>`+
      `<a href="${base}interface/shneiderman.html">Designregeln</a>`+
      `<a href="${base}README.html">README</a>`+
      '</nav>';
    document.body.insertAdjacentHTML('afterbegin', navHtml);
  }
  document.addEventListener('DOMContentLoaded', function(){
    const level = getOpLevel();
    if(level === 0){ insertNav(); }
  });
})();
