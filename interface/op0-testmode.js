const storage = typeof localStorage === 'undefined'
  ? {
      data: {},
      setItem(k, v) { this.data[k] = String(v); },
      getItem(k) { return this.data[k]; },
      removeItem(k) { delete this.data[k]; }
    }
  : localStorage;

function enableOP0TestMode() {
  storage.setItem('op0_test', 'true');
}

function disableOP0TestMode() {
  storage.removeItem('op0_test');
}

function toggleOP0TestMode() {
  if (isOP0TestMode()) {
    disableOP0TestMode();
  } else {
    enableOP0TestMode();
  }
}

function isOP0TestMode() {
  return storage.getItem('op0_test') === 'true';
}

if (typeof module !== 'undefined') {
  module.exports = { enableOP0TestMode, disableOP0TestMode, toggleOP0TestMode, isOP0TestMode };
}

if (typeof window !== 'undefined') {
  window.toggleOP0TestMode = toggleOP0TestMode;
  window.isOP0TestMode = isOP0TestMode;
}
