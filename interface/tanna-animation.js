function startTannaAnimation(id, fps = 4) {
  const img = document.getElementById(id);
  if (!img) return;
  const prefix = window.location.pathname.includes('/interface/') ||
                 window.location.pathname.includes('/wings/')
                   ? '../sources/images/op-logo/'
                   : 'sources/images/op-logo/';
  const frames = [];
  for (let i = 0; i <= 7; i++) frames.push(`${prefix}tanna_op${i}.png`);
  let idx = 0;
  frames.forEach(src => { const pre = new Image(); pre.src = src; });
  setInterval(() => {
    img.src = frames[idx];
    idx = (idx + 1) % frames.length;
  }, 1000 / fps);
}

document.addEventListener('DOMContentLoaded', () => {
  startTannaAnimation('tanna_animation');
});
