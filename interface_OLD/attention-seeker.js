(function() {
  const cfg = JSON.parse(localStorage.getItem('ethicom_attention') || '{}');
  const state = {
    wiggle: cfg.wiggle === 'true',
    beep: cfg.beep === 'true'
  };
  const idleLimit = 60000; // 1 minute
  let last = Date.now();
  function save() {
    localStorage.setItem('ethicom_attention', JSON.stringify(state));
  }
  function reset() { last = Date.now(); }
  function playBeep() {
    if (!state.beep) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.frequency.value = 880;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 200);
    } catch {}
  }
  function doWiggle() {
    if (!state.wiggle) return;
    const el = document.getElementById('op_interface');
    if (!el) return;
    el.classList.add('attention-wiggle');
    setTimeout(() => el.classList.remove('attention-wiggle'), 1800);
  }
  function check() {
    if (Date.now() - last > idleLimit) {
      playBeep();
      doWiggle();
      last = Date.now();
    }
  }
  function start() {
    ['mousemove','keydown','click','touchstart'].forEach(ev => {
      document.addEventListener(ev, reset, {passive:true});
    });
    setInterval(check, 5000);
  }
  function toggleWiggle(on) { state.wiggle = on; save(); }
  function toggleBeep(on) { state.beep = on; save(); }
  window.attentionSettings = { toggleWiggle, toggleBeep, state, start };
  document.addEventListener('DOMContentLoaded', () => {
    if (state.wiggle || state.beep) start();
  });
})();
