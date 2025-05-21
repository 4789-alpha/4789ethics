// touch-features.js -- basic touch interactions for Ethicom

(function() {
  const settings = JSON.parse(localStorage.getItem('ethicom_touch') || '{}');
  const state = {
    gestures: settings.gestures === 'true',
    haptics: settings.haptics === 'true',
    drawing: settings.drawing === 'true',
    bigButtons: settings.bigButtons === 'true',
    longPressMenu: settings.longPressMenu === 'true'
  };

  let pointers = new Map();
  let startDist = 0;
  let baseScale = 1;

  function save() {
    localStorage.setItem('ethicom_touch', JSON.stringify(state));
  }

  function vibrate(ms) {
    if (state.haptics && navigator.vibrate) navigator.vibrate(ms);
  }

  // Gestures: pinch to zoom whole body
  function pointerDown(e) {
    pointers.set(e.pointerId, e);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      startDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      baseScale = parseFloat(document.body.style.getPropertyValue('--scale') || 1);
    }
  }

  function pointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, e);
    if (state.gestures && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const scale = baseScale * (dist / startDist);
      document.body.style.setProperty('--scale', scale);
      document.body.style.transform = `scale(${scale})`;
    }
  }

  function pointerUp(e) {
    pointers.delete(e.pointerId);
    startDist = 0;
  }

  // Drawing overlay
  let canvas, ctx, drawing = false;
  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'drawing-overlay';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = state.drawing ? 'block' : 'none';
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    canvas.addEventListener('pointerdown', e => {
      drawing = true;
      ctx.moveTo(e.clientX, e.clientY);
      vibrate(10);
    });
    canvas.addEventListener('pointermove', e => {
      if (!drawing) return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    });
    canvas.addEventListener('pointerup', () => drawing = false);
  }

  function toggleDrawing(on) {
    state.drawing = on;
    if (canvas) canvas.style.display = on ? 'block' : 'none';
    save();
  }

  function toggleGestures(on) { state.gestures = on; save(); }
  function toggleHaptics(on) { state.haptics = on; save(); }
  function toggleBigButtons(on) {
    state.bigButtons = on;
    document.body.classList.toggle('touch-big-buttons', on);
    save();
  }
  function toggleLongPressMenu(on) { state.longPressMenu = on; save(); }

  // Long press quick menu
  let pressTimer = null;
  function handleLongPress(e) {
    if (!state.longPressMenu) return;
    const target = e.currentTarget;
    pressTimer = setTimeout(() => {
      const txt = target.dataset.context || 'Options';
      alert(txt);
      vibrate(20);
    }, 500);
  }
  function cancelLongPress() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }

  function initLongPressElements() {
    document.querySelectorAll('[data-context]').forEach(el => {
      el.addEventListener('pointerdown', handleLongPress);
      el.addEventListener('pointerup', cancelLongPress);
      el.addEventListener('pointerleave', cancelLongPress);
    });
  }

  window.touchSettings = {
    toggleGestures,
    toggleHaptics,
    toggleDrawing,
    toggleBigButtons,
    toggleLongPressMenu,
    state
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (state.bigButtons) document.body.classList.add('touch-big-buttons');
    if (state.gestures) {
      document.addEventListener('pointerdown', pointerDown);
      document.addEventListener('pointermove', pointerMove);
      document.addEventListener('pointerup', pointerUp);
    }
    if (state.drawing) initCanvas();
    initLongPressElements();
  });
})();

