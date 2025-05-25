const storage = typeof localStorage === 'undefined'
  ? {
      data: {},
      removeItem(k) { delete this.data[k]; },
      getItem() { return undefined; },
      setItem() {}
    }
  : localStorage;

function enableOP0TestMode() {
  storage.removeItem('op0_test');
}

function disableOP0TestMode() {
  storage.removeItem('op0_test');
}

function toggleOP0TestMode() {
  disableOP0TestMode();
  if (typeof window !== 'undefined') {
    alert('OP-0 test mode disabled for security (4789).');
  }
}

function isOP0TestMode() {
  return false;
}

if (typeof module !== 'undefined') {
  module.exports = { enableOP0TestMode, disableOP0TestMode, toggleOP0TestMode, isOP0TestMode };
}

if (typeof window !== 'undefined') {
  window.toggleOP0TestMode = toggleOP0TestMode;
  window.isOP0TestMode = isOP0TestMode;
}
