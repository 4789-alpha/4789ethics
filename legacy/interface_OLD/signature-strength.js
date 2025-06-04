(function(global){
  function getSignatureStrength(level) {
    const base = parseInt(String(level).replace('OP-', '').split('.')[0], 10);
    return base >= 8 ? base - 6 : 1;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSignatureStrength };
  } else {
    global.getSignatureStrength = getSignatureStrength;
  }
})(this);
