function initLogoBackground() {
  let container = document.getElementById('op_background');
  if (!container) {
    container = document.createElement('div');
    container.id = 'op_background';
    document.body.prepend(container);
  }
  localStorage.setItem('ethicom_bg_collisions', 'true');

  if (!localStorage.getItem('ethicom_bg_fill')) {
    localStorage.setItem('ethicom_bg_fill', '90');
  }
  if (!localStorage.getItem('ethicom_bg_symbol_size')) {
    localStorage.setItem('ethicom_bg_symbol_size', '120');
  }

  let RESTITUTION = 1;
  const storedRest = parseFloat(localStorage.getItem('ethicom_bg_restitution'));
  if (!Number.isNaN(storedRest)) RESTITUTION = storedRest;

  const MIN_VELOCITY = 0.05;

  function rgbToHue(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    let h;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    return h * 60;
  }

  function colorToHue(str) {
    const hex = str.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return rgbToHue(r, g, b);
    }
    const m = hex.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return m ? rgbToHue(+m[1], +m[2], +m[3]) : NaN;
  }

  function getThemeHueDiff() {
    let color;
    try {
      const stored = JSON.parse(localStorage.getItem('ethicom_tanna_color') || 'null');
      if (stored) color = `rgb(${stored.r},${stored.g},${stored.b})`;
    } catch {}
    if (!color) {
      const style = getComputedStyle(document.documentElement);
      color = style.getPropertyValue('--primary-color');
    }
    const h = colorToHue(color);
    return isNaN(h) ? 0 : h - 120;
  }

  function getBgHue() {
    const style = getComputedStyle(document.documentElement);
    const c = style.getPropertyValue('--bg-color');
    return colorToHue(c);
  }

  let symbolHue = parseInt(localStorage.getItem('ethicom_bg_symbol_hue') || '0', 10);
  const lowMotion = localStorage.getItem('ethicom_bg_low_motion') === 'true';

  let themeHue = getThemeHueDiff();
  let bgHue = getBgHue();
  document.addEventListener('themeChanged', () => {
    themeHue = getThemeHueDiff();
    bgHue = getBgHue();
    symbolHue = parseInt(localStorage.getItem('ethicom_bg_symbol_hue') || '0', 10);
  });

  window.addEventListener('storage', e => {
    if (!e.key) return;
    const keys = [
      'ethicom_tanna_color',
      'ethicom_bg_symbol_hue',
      'ethicom_bg_color',
      'ethicom_theme'
    ];
    if (keys.includes(e.key)) {
      themeHue = getThemeHueDiff();
      bgHue = getBgHue();
      symbolHue = parseInt(localStorage.getItem('ethicom_bg_symbol_hue') || '0', 10);
    }
  });

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');


  function resize() {
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const storedLevel =
    typeof getStoredOpLevel === 'function'
      ? opLevelToNumber(getStoredOpLevel())
      : 0;
  const maxStored = Number.isFinite(storedLevel) ? storedLevel : 0;
  const sameLevelCount = storedLevel >= 1
    ? Math.max(1, parseInt(localStorage.getItem('ethicom_same_level_count') || '1', 10))
    : 1;
  const levels = [];
  for (let i = 0; i <= maxStored && i <= 9; i++) {
    const reps = i === storedLevel && storedLevel >= 1 ? sameLevelCount : 1;
    for (let n = 0; n < reps; n++) levels.push(i);
  }
  if (levels.length === 0) levels.push(0);
  const maxLvl = Math.max(...levels);
  const minScale = 0.5;
  const FADE_MS = 0;
  let imgBase;
  if (document.currentScript && document.currentScript.src) {
    const scriptUrl = new URL(document.currentScript.src, location.href);
    imgBase = new URL('../sources/images/op-logo/', scriptUrl).href;
  } else {
    const depth = window.location.pathname
      .replace(/[^/]+$/, '')
      .split('/')
      .filter(Boolean).length;
    imgBase = '../'.repeat(depth) + 'sources/images/op-logo/';
  }
  const images = levels.map(lvl => {
    const img = new Image();
    const src = lvl >= 8 ? 7 : lvl;
    img.src = `${imgBase}tanna_op${src}.png`;
    return img;
  });

  const symbols = [];
  // Density of floating symbols can be customized via settings
  const storedPct = parseInt(localStorage.getItem('ethicom_bg_fill') || '80', 10);
  const fillRatio = Number.isFinite(storedPct) ? storedPct / 100 : 0.8;
  const storedSize = parseInt(localStorage.getItem('ethicom_bg_symbol_size') || '100', 10);
  const sizeScale = Number.isFinite(storedSize) ? storedSize / 100 : 1;
  const avgSize =
    levels.reduce((sum, lvl) => sum + (30 + lvl * 10 + 5) * sizeScale, 0) /
    levels.length;
  const avgArea = avgSize * avgSize;
  const maxSymbols = Math.floor(canvas.width * canvas.height / avgArea);
  const total = Math.max(20, Math.floor(maxSymbols * fillRatio));
  const collisionsEnabled = true;
  for (let i = 0; i < total; i++) {
    const lvl = levels[i % levels.length];
    const img = images[lvl >= 8 ? 7 : lvl];
    const mass = lvl + 1;
    const count = lvl >= 8 ? lvl - 6 : 1;
    const hue = lvl >= 8 ? (lvl - 7) * 30 : 0;
    const size = (30 + lvl * 10 + Math.random() * 10) * sizeScale;
    const radius = size / 2;
    const subSize = size / count;
    const x = Math.random() * (canvas.width - size) + radius;
    const y = Math.random() * (canvas.height - size) + radius;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 1.5) * (lowMotion ? 0.4 : 1);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
    symbols.push({
      img,
      lvl,
      count,
      hue,
      subSize,
      mass,
      x,
      y,
      dx,
      dy,
      size,
      radius,
      rotation: 0,
      rotSpeed: 0,
      rotFrames: 0,
      boostFactor: 1,
      boostFrames: 0,
      alpha: 1,
      scale: 1,
      scaleDir: 0,
      fadeOut: false,
      fadeStart: 0,
      collisionCount: 0,
      highlightUntil: 0,
    });
  }

  function resolveCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;

    const nx = dx / dist;
    const ny = dy / dist;
    const relVelX = a.dx - b.dx;
    const relVelY = a.dy - b.dy;
    const relDot = relVelX * nx + relVelY * ny;
    if (relDot > 0) return;

    const m1 = a.mass;
    const m2 = b.mass;
    const impulse = (2 * relDot * RESTITUTION) / (m1 + m2);
    a.dx -= impulse * m2 * nx;
    a.dy -= impulse * m2 * ny;
    b.dx += impulse * m1 * nx;
    b.dy += impulse * m1 * ny;

    const minDist = a.radius * a.scale + b.radius * b.scale;
    const overlap = minDist - dist;
    if (overlap > 0) {
      a.x += nx * overlap * (m2 / (m1 + m2));
      a.y += ny * overlap * (m2 / (m1 + m2));
      b.x -= nx * overlap * (m1 / (m1 + m2));
      b.y -= ny * overlap * (m1 / (m1 + m2));
    }
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const style = getComputedStyle(document.documentElement);
    const collisionColor = style.getPropertyValue('--collision-color').trim() || '#ffff00';

    for (let i = 0; i < symbols.length; i++) {
      const s = symbols[i];

      s.x += s.dx;
      s.y += s.dy;

      if (s.x <= s.radius * s.scale || s.x >= canvas.width - s.radius * s.scale) s.dx *= -1;
      if (s.y <= s.radius * s.scale || s.y >= canvas.height - s.radius * s.scale) s.dy *= -1;

      if (collisionsEnabled) {
        for (let j = i + 1; j < symbols.length; j++) {
          const o = symbols[j];
          const dx = s.x - o.x;
          const dy = s.y - o.y;
          const dist = Math.hypot(dx, dy);
          const minDist = s.radius * s.scale + o.radius * o.scale;
          if (dist < minDist) {
            resolveCollision(s, o);
            const now = performance.now();
            s.highlightUntil = now + 200;
            o.highlightUntil = now + 200;
            if (s.lvl === maxLvl) {
              s.collisionCount++;
              if (s.collisionCount % 10000 === 0) {
                const base = 0.2 + Math.random() * 0.3;
                const factor = 1 - s.lvl / (maxLvl + 1);
                s.rotSpeed = base * factor;
                s.rotFrames = 180;
                s.scaleDir = -1;
                s.fadeOut = true;
                s.fadeStart = performance.now();
                s.collisionCount = 0;
              }
            }
            if (o.lvl === maxLvl) {
              o.collisionCount++;
              if (o.collisionCount % 10000 === 0) {
                const base = 0.2 + Math.random() * 0.3;
                const factor = 1 - o.lvl / (maxLvl + 1);
                o.rotSpeed = base * factor;
                o.rotFrames = 180;
                o.scaleDir = -1;
                o.fadeOut = true;
                o.fadeStart = performance.now();
                o.collisionCount = 0;
              }
            }
            if (s.lvl < o.lvl) {
              const base = 0.2 + Math.random() * 0.3;
              const factor = 1 - s.lvl / (maxLvl + 1);
              s.rotSpeed = base * factor;
              s.rotFrames = 60;
              s.scaleDir = -1;
              s.fadeOut = true;
              s.fadeStart = performance.now();
              if (s.boostFrames === 0) {
                s.dx *= 1.5;
                s.dy *= 1.5;
              }
              s.boostFactor = 1.5;
              s.boostFrames = 20;
            } else if (o.lvl < s.lvl) {
              const base = 0.2 + Math.random() * 0.3;
              const factor = 1 - o.lvl / (maxLvl + 1);
              o.rotSpeed = base * factor;
              o.rotFrames = 60;
              o.scaleDir = -1;
              o.fadeOut = true;
              o.fadeStart = performance.now();
              if (o.boostFrames === 0) {
                o.dx *= 1.5;
                o.dy *= 1.5;
              }
              o.boostFactor = 1.5;
              o.boostFrames = 20;
            }
          }
        }
      }

      s.dx *= RESTITUTION;
      s.dy *= RESTITUTION;

      if (s.boostFrames > 0) {
        s.boostFrames--;
        if (s.boostFrames === 0) {
          s.dx /= s.boostFactor;
          s.dy /= s.boostFactor;
          s.boostFactor = 1;
        }
      }

      if (Math.hypot(s.dx, s.dy) < MIN_VELOCITY) {
        const angle = Math.random() * Math.PI * 2;
        const baseSpeed = 0.5 + Math.random() * 1.5;
        const speed = baseSpeed * (lowMotion ? 0.4 : 1);
        s.dx = Math.cos(angle) * speed;
        s.dy = Math.sin(angle) * speed;
      }

      if (s.rotFrames > 0) {
        s.rotation += s.rotSpeed;
        s.rotFrames--;
        } else {
          s.rotSpeed = 0;
        }

        if (s.scaleDir !== 0) {
          if (s.scaleDir === -1) {
            s.scale -= 0.1;
            if (s.scale <= minScale) {
              s.scale = minScale;
              s.scaleDir = s.fadeOut ? 0 : 1;
            }
          } else if (s.scaleDir === 1) {
            s.scale += 0.02;
            if (s.scale >= 1) {
              const variance = (Math.random() - 0.5) * 0.0228;
              s.scale = 1 + variance;
              s.scaleDir = 0;
            }
          }
        }

        if (s.fadeOut) {
          if (FADE_MS > 0) {
            const elapsed = performance.now() - s.fadeStart;
            if (elapsed < FADE_MS / 2) {
              s.alpha = 1 - elapsed / (FADE_MS / 2);
            } else if (elapsed < FADE_MS) {
              s.alpha = (elapsed - FADE_MS / 2) / (FADE_MS / 2);
              s.scaleDir = 1;
            } else {
              s.alpha = 1;
              s.fadeOut = false;
              s.scaleDir = 0;
            }
          } else {
            s.alpha = 1;
            s.fadeOut = false;
          }
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        if (s.rotation) ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        const baseHue = themeHue + s.hue + symbolHue;
        let totalHue = baseHue;
        if (!isNaN(bgHue)) {
          const diff = Math.abs((baseHue - bgHue + 360) % 360);
          if (diff < 15) totalHue = (baseHue + 30) % 360;
        }
        ctx.filter = totalHue ? `hue-rotate(${totalHue}deg)` : 'none';

        const start = -s.radius * s.scale;
        for (let n = 0; n < s.count; n++) {
          const xOff = start + n * s.subSize * s.scale;
          ctx.drawImage(
            s.img,
            xOff,
            -s.subSize * s.scale / 2,
            s.subSize * s.scale,
            s.subSize * s.scale
          );
        }
        ctx.filter = 'none';
        ctx.restore();

        if (s.highlightUntil > performance.now()) {
          ctx.save();
          ctx.lineWidth = 2;
          ctx.strokeStyle = collisionColor;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * s.scale + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

if (document.readyState !== 'loading') {
  initLogoBackground();
} else {
  document.addEventListener('DOMContentLoaded', initLogoBackground);
}
