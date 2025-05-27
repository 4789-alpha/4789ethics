// touch-features.js -- basic touch interactions for Ethicom

(function() {
  const settings = JSON.parse(localStorage.getItem('ethicom_touch') || '{}');
  const gesturesEnabled = settings.gestures !== 'false';
  const state = {
    gestures: gesturesEnabled,
    haptics: settings.haptics === 'true',
    drawing: settings.drawing === 'true',
    bigButtons: settings.bigButtons === 'true',
    longPressMenu: settings.longPressMenu === 'true'
  };

  let pointers = new Map();
  let startDist = 0;
  let baseScale = 1;
  let swipeStart = null;
  let swipeHandler = null;

  function save() {
    localStorage.setItem('ethicom_touch', JSON.stringify(state));
  }

  function vibrate(ms) {
    if (state.haptics && navigator.vibrate) navigator.vibrate(ms);
  }

  // Gestures: pinch to zoom whole body
  function pointerDown(e) {
    pointers.set(e.pointerId, e);
    swipeStart = { x: e.clientX, y: e.clientY };
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
    if (swipeStart) {
      const dx = e.clientX - swipeStart.x;
      const dy = e.clientY - swipeStart.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const threshold = 30;
      if ((absX > threshold || absY > threshold) && swipeHandler) {
        let dir;
        if (absX > absY) dir = dx > 0 ? 'right' : 'left';
        else dir = dy > 0 ? 'down' : 'up';
        swipeHandler(dir);
      }
    }
    swipeStart = null;
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

  function toggleGestures(on) {
    state.gestures = on;
    if (on) {
      document.addEventListener('pointerdown', pointerDown);
      document.addEventListener('pointermove', pointerMove);
      document.addEventListener('pointerup', pointerUp);
    } else {
      document.removeEventListener('pointerdown', pointerDown);
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('pointerup', pointerUp);
    }
    save();
  }
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

  function registerSwipeHandler(fn) {
    swipeHandler = typeof fn === 'function' ? fn : null;
  }

  window.touchSettings = {
    toggleGestures,
    toggleHaptics,
    toggleDrawing,
    toggleBigButtons,
    toggleLongPressMenu,
    state,
    registerSwipeHandler
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (state.bigButtons) document.body.classList.add('touch-big-buttons');
    if (state.drawing) initCanvas();
    initLongPressElements();
  });
})();

