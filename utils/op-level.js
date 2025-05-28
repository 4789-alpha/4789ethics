(function(global){
  function opLevelToNumber(level){
    if(!level) return 0;
    const n = parseFloat(String(level).replace('OP-', ''));
    return isNaN(n) ? 0 : n;
  }

  function getStoredOpLevel(){
    try {
      const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
      return sig.op_level || null;
    } catch (err) {
      return null;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { opLevelToNumber, getStoredOpLevel };
  } else {
    global.opLevelToNumber = opLevelToNumber;
    global.getStoredOpLevel = getStoredOpLevel;
  }
})(this);
