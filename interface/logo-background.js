function loadOpLogos() {
  const container = document.getElementById('op_background');
  if (!container) return;
  const levels = [0,1,2,3,4,5,6,7];
  levels.forEach(lvl => {
    const img = document.createElement('img');
    img.src = `../op-logo/tanna_op${lvl}.png`;
    img.alt = `OP-${lvl} logo`;
    container.appendChild(img);
  });
}

document.addEventListener('DOMContentLoaded', loadOpLogos);
