const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  projects.forEach(project => {
    project.hidden = button.dataset.filter !== 'alle' && project.dataset.category !== button.dataset.filter;
    if (!project.hidden) count++;
  });
  document.getElementById('filter-status').textContent = `${count} Projekte angezeigt`;
}));

// Lightweight public background. No module permissions or account are required.
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const canvas = document.createElement('canvas');
  canvas.id = 'bsvrb-background';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const context = canvas.getContext('2d');
  if (!context) { canvas.remove(); return; }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'motion-toggle';
  toggle.setAttribute('aria-controls', canvas.id);
  document.body.append(toggle);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = read('bsvrb_motion') === 'paused' || (read('bsvrb_motion') !== 'running' && (preference.matches || read('ethicom_bg_low_motion') === 'true'));
  let width = 0, height = 0, raf = 0, previous = 0;
  const symbols = Array.from({length: 28}, (_, i) => ({ x: Math.random(), y: Math.random(), size: 15 + i % 5 * 6, dx: (i % 2 ? 1 : -1) * (7 + i % 6), dy: (i % 3 ? 1 : -1) * (5 + i % 4), angle: i * .63 }));
  function draw() {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = '#1c5545'; context.fillStyle = '#1c5545'; context.lineWidth = 1;
    symbols.forEach((s, i) => {
      context.save(); context.translate(s.x * width, s.y * height); context.rotate(s.angle);
      context.globalAlpha = .10;
      context.beginPath();
      if (i % 3 === 0) { context.arc(0, 0, s.size, 0, Math.PI * 2); context.stroke(); }
      else { context.moveTo(0, -s.size); context.lineTo(s.size * .85, s.size * .6); context.lineTo(-s.size * .85, s.size * .6); context.closePath(); context.fill(); }
      context.restore();
    });
  }
  function frame(now) {
    raf = 0;
    if (paused || document.hidden) return;
    const seconds = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    symbols.forEach(s => { s.x += s.dx * seconds / width; s.y += s.dy * seconds / height; if (s.x < 0 || s.x > 1) { s.dx *= -1; s.x = Math.max(0, Math.min(1, s.x)); } if (s.y < 0 || s.y > 1) { s.dy *= -1; s.y = Math.max(0, Math.min(1, s.y)); } s.angle += seconds * .03; });
    draw(); canvas.dataset.frame = String((Number(canvas.dataset.frame) || 0) + 1);
    raf = requestAnimationFrame(frame);
  }
  function update() {
    cancelAnimationFrame(raf); raf = 0; previous = 0;
    toggle.textContent = paused ? '▶ Hintergrund bewegen' : 'Ⅱ Hintergrund pausieren';
    toggle.setAttribute('aria-pressed', String(paused));
    canvas.dataset.motion = paused ? 'paused' : 'running';
    draw(); if (!paused && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
  }
  toggle.addEventListener('click', () => { paused = !paused; write('bsvrb_motion', paused ? 'paused' : 'running'); update(); });
  preference.addEventListener('change', () => { if (read('bsvrb_motion') === null) { paused = preference.matches; update(); } });
  document.addEventListener('visibilitychange', update);
  window.addEventListener('resize', resize);
  resize(); update();

  const form = document.getElementById('local-profile');
  if (!form) return;
  const status = document.getElementById('profile-status');
  const tools = document.getElementById('profile-tools');
  let profile = null;
  try { profile = JSON.parse(read('bsvrb_local_profile') || 'null'); } catch { /* Allow recovery from invalid saved data. */ }
  if (profile && typeof profile.nickname === 'string') {
    form.elements.nickname.value = profile.nickname;
    form.elements.interest.value = profile.interest;
    tools.hidden = false;
    status.textContent = 'Dein Profil ist auf diesem Gerät gespeichert.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const nickname = form.elements.nickname.value.trim();
    if (!nickname) { status.textContent = 'Bitte gib einen Anzeigenamen ein.'; return; }
    profile = {nickname, interest: form.elements.interest.value, updated: new Date().toISOString()};
    if (write('bsvrb_local_profile', JSON.stringify(profile))) { tools.hidden = false; status.textContent = 'Gespeichert – nur auf diesem Gerät. Es wurde keine Vereinsanmeldung gesendet.'; }
    else status.textContent = 'Dein Browser erlaubt hier keine lokale Speicherung. Du kannst die Projekte trotzdem nutzen.';
  });
  document.getElementById('profile-export').addEventListener('click', () => {
    if (!profile) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(profile, null, 2)], {type:'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = 'bsvrb-profil.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.getElementById('profile-delete').addEventListener('click', () => {
    try { localStorage.removeItem('bsvrb_local_profile'); profile = null; form.reset(); tools.hidden = true; status.textContent = 'Das lokale Profil wurde entfernt.'; } catch { status.textContent = 'Das Profil konnte nicht entfernt werden.'; }
  });
})();
