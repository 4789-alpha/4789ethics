function initLogoBackground() {
  const container = document.getElementById('op_background');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const levels = [0, 1, 2, 3, 4, 5, 6, 7];
  const maxLvl = Math.max(...levels);
  const minScale = 0.3;
  const images = levels.map(lvl => {
    const img = new Image();
    img.src = `../op-logo/tanna_op${lvl}.png`;
    return img;
  });

  const symbols = [];
  const total = 20;
  for (let i = 0; i < total; i++) {
    const lvl = levels[i % levels.length];
    const img = images[lvl];
    const mass = lvl + 1;
    const size = 30 + lvl * 10 + Math.random() * 10;
    const radius = size / 2;
    const x = Math.random() * (canvas.width - size) + radius;
    const y = Math.random() * (canvas.height - size) + radius;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    symbols.push({
      img,
      lvl,
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
      alpha: 1,
      scale: 1,
      scaleDir: 0,
      fadeOut: false,
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
    const impulse = (2 * relDot) / (m1 + m2);
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

    for (let i = 0; i < symbols.length; i++) {
      const s = symbols[i];

      s.x += s.dx;
      s.y += s.dy;

      if (s.x <= s.radius * s.scale || s.x >= canvas.width - s.radius * s.scale) s.dx *= -1;
      if (s.y <= s.radius * s.scale || s.y >= canvas.height - s.radius * s.scale) s.dy *= -1;

      for (let j = i + 1; j < symbols.length; j++) {
        const o = symbols[j];
        const dx = s.x - o.x;
        const dy = s.y - o.y;
        const dist = Math.hypot(dx, dy);
        const minDist = s.radius * s.scale + o.radius * o.scale;
        if (dist < minDist) {
          resolveCollision(s, o);
          if (s.lvl < o.lvl) {
            const base = 0.2 + Math.random() * 0.3;
            const factor = 1 - s.lvl / (maxLvl + 1);
            s.rotSpeed = base * factor;
            s.rotFrames = 180;
            s.scaleDir = -1;
            s.fadeOut = true;
          } else if (o.lvl < s.lvl) {
            const base = 0.2 + Math.random() * 0.3;
            const factor = 1 - o.lvl / (maxLvl + 1);
            o.rotSpeed = base * factor;
            o.rotFrames = 180;
            o.scaleDir = -1;
            o.fadeOut = true;
          }
        }
      }

        if (s.rotFrames > 0) {
          s.rotation += s.rotSpeed;
          s.rotFrames--;
        } else {
          s.rotSpeed = 0;
        }

        if (s.scaleDir !== 0) {
          if (s.scaleDir === -1) {
            s.scale -= 0.2;
            if (s.scale <= minScale) {
              s.scale = minScale;
              s.scaleDir = s.fadeOut ? 0 : 1;
            }
          } else if (s.scaleDir === 1) {
            s.scale += 0.02;
            if (s.scale >= 1) {
              s.scale = 1;
              s.scaleDir = 0;
            }
          }
        }

        if (s.fadeOut && s.scaleDir === 0 && s.alpha > 0) {
          s.alpha -= 0.02;
          if (s.alpha < 0) s.alpha = 0;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        if (s.rotation) ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        ctx.drawImage(
          s.img,
          -s.radius * s.scale,
          -s.radius * s.scale,
          s.size * s.scale,
          s.size * s.scale
        );
        ctx.restore();
      }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', initLogoBackground);
