function initPageFlow(id) {
  const container = document.getElementById(id);
  if (!container) return;
  const pages = container.querySelectorAll('.page');
  function update() {
    const center = container.offsetWidth / 2;
    pages.forEach(pg => {
      const rect = pg.getBoundingClientRect();
      const offset = Math.abs((rect.left + rect.right) / 2 - center);
      const scale = Math.max(0.7, 1 - offset / container.offsetWidth);
      pg.style.transform = `scale(${scale})`;
      pg.style.zIndex = Math.round(scale * 100);
    });
  }
  container.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
}

