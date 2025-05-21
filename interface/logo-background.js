function loadOpLogos() {
  const container = document.getElementById('op_background');
  if (!container) return;

  const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  levels.forEach(lvl => {
    const count = lvl >= 8 ? lvl - 6 : 1;
    const hue = lvl >= 8 ? (lvl - 7) * 30 : 0;
    const srcNum = lvl >= 8 ? 7 : lvl;
    const size = 30 + lvl * 4; // more subtle sizing
    const groupWidth = (size + 4) * count;
    const left = Math.random() * (width - groupWidth);
    const top = Math.random() * (height - size);

    const group = document.createElement('div');
    group.style.position = 'absolute';
    group.style.left = left + 'px';
    group.style.top = top + 'px';

    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.src = `../op-logo/tanna_op${srcNum}.png`;
      img.alt = `OP-${lvl} logo`;
      img.style.width = size + 'px';
      if (hue) img.style.filter = `hue-rotate(${hue}deg)`;
      img.style.marginRight = '4px';
      group.appendChild(img);
    }

    container.appendChild(group);
  });
}

document.addEventListener('DOMContentLoaded', loadOpLogos);
