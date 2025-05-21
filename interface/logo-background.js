function loadOpLogos() {
  const container = document.getElementById('op_background');
  if (!container) return;

  const levels = [0, 1, 2, 3, 4, 5, 6, 7];
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  levels.forEach(lvl => {
    const img = document.createElement('img');
    img.src = `../op-logo/tanna_op${lvl}.png`;
    img.alt = `OP-${lvl} logo`;
    img.style.position = 'absolute';
    const size = 30 + lvl * 4; // more subtle sizing
    img.style.width = size + 'px';
    img.style.left = Math.random() * (width - size) + 'px';
    img.style.top = Math.random() * (height - size) + 'px';
    container.appendChild(img);
  });
}

document.addEventListener('DOMContentLoaded', loadOpLogos);
