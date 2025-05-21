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
    const size = 30 + Math.random() * 30;
    const radius = size / 2;
    const x = Math.random() * (canvas.width - size) + radius;
    const y = Math.random() * (canvas.height - size) + radius;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    symbols.push({ img, x, y, dx, dy, size, radius });
  }

  function bounce(a, b) {
    const tempX = a.dx;
    const tempY = a.dy;
    a.dx = b.dx;
    a.dy = b.dy;
    b.dx = tempX;
    b.dy = tempY;
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < symbols.length; i++) {
      const s = symbols[i];

      s.x += s.dx;
      s.y += s.dy;

      if (s.x <= s.radius || s.x >= canvas.width - s.radius) s.dx *= -1;
      if (s.y <= s.radius || s.y >= canvas.height - s.radius) s.dy *= -1;

      for (let j = i + 1; j < symbols.length; j++) {
        const o = symbols[j];
        const dx = s.x - o.x;
        const dy = s.y - o.y;
        const dist = Math.hypot(dx, dy);
        const minDist = s.radius + o.radius;
        if (dist < minDist) {
          bounce(s, o);
          const angle = Math.atan2(dy, dx);
          const overlap = minDist - dist;
          s.x += Math.cos(angle) * (overlap / 2);
          s.y += Math.sin(angle) * (overlap / 2);
          o.x -= Math.cos(angle) * (overlap / 2);
          o.y -= Math.sin(angle) * (overlap / 2);
        }
      }

      ctx.drawImage(s.img, s.x - s.radius, s.y - s.radius, s.size, s.size);
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', initLogoBackground);
