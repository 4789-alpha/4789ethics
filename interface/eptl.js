// eptl.js – simple verifier for Bluetooth Trust Layer
function eptlVerify(code) {
  if (typeof code !== 'string') return false;
  return code.startsWith('EPTL-');
}

if (typeof module !== 'undefined') {
  module.exports = { eptlVerify };
} else {
  window.eptlVerify = eptlVerify;
}
