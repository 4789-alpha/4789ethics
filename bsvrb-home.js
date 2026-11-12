const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  projects.forEach(project => {
    project.hidden = button.dataset.filter !== 'alle' && project.dataset.category !== button.dataset.filter;
    if (!project.hidden) count++;
  });
  document.getElementById('filter-status').textContent = count === 1 ? '1 Projekt oder Vorhaben angezeigt' : `${count} Projekte und Vorhaben angezeigt`;
}));

// Original TANNA logos and collision behavior, available without an account.
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
  toggle.textContent = 'Hintergrund';
  toggle.setAttribute('aria-haspopup', 'dialog');
  toggle.setAttribute('aria-controls', 'bsvrb-background-settings');
  document.body.append(toggle);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = read('bsvrb_motion') === 'paused' || (read('bsvrb_motion') !== 'running' && (preference.matches || read('ethicom_bg_low_motion') === 'true'));
  // Public adaptation of interface/logo-background.js: original TANNA assets,
  // mass-based impulses, collision rotation and temporary speed/scale effects.
  const scriptBase = new URL('.', document.currentScript?.src || location.href);
  const setting = (key, fallback, min, max) => {
    const value = Number.parseFloat(read(key));
    return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
  };
  const defaults = {density: 12, speed: 25, size: 85, opacity: 8, effects: false};
  let saved = {};
  try { saved = JSON.parse(read('bsvrb_background_v1') || '{}') || {}; } catch {}
  const bounded = (key, min, max) => Number.isFinite(saved[key]) ? Math.max(min, Math.min(max, saved[key])) : defaults[key];
  const config = {density: bounded('density', 0, 60), speed: bounded('speed', 5, 100),
    size: bounded('size', 40, 160), opacity: bounded('opacity', 0, 30), effects: saved.effects === true};
  const restitution = setting('ethicom_bg_restitution', 1, 0.1, 1);
  if (document.querySelector('script[src*="bsvrb-settings.js"]')) paused = document.documentElement.dataset.motion !== 'running';
  let width = 0, height = 0, raf = 0, previous = 0;
  let symbols = [];
  const images = Array.from({length: 8}, (_, level) => {
    const image = new Image();
    image.onload = () => { image.collisionMask = makeMask(image); draw(); };
    image.src = new URL(`sources/images/op-logo/tanna_op${level}.png`, scriptBase).href;
    return image;
  });
  function populate() {
    const sizeScale = config.size / 100;
    const averageSize = 70 * sizeScale;
    const total = Math.min(160, Math.round(width * height / (averageSize ** 2) * config.density / 100));
    symbols.length = Math.min(total, symbols.length);
    // Keep existing positions when changing settings to avoid a visual jump.
    symbols.forEach(s => {
      s.size = Math.min(s.baseSize * sizeScale, width / 4, height / 4);
      s.radius = s.size / 2; contain(s);
    });
    while (symbols.length < total) {
      const lvl = symbols.length % images.length;
      const baseSize = 30 + lvl * 10 + Math.random() * 10;
      const size = Math.min(baseSize * sizeScale, width / 4, height / 4);
      const radius = size / 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 90;
      const symbol = {lvl, img: images[lvl], mass: lvl + 1, baseSize, size, radius,
        x: radius, y: radius, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2, rotSpeed: 0, effectUntil: 0, highlightUntil: 0, scale: 1};
      for (let attempt = 0; attempt < 40; attempt++) {
        symbol.x = radius + Math.random() * (width - size);
        symbol.y = radius + Math.random() * (height - size);
        if (symbols.every(other => Math.hypot(other.x - symbol.x, other.y - symbol.y) >= other.radius + radius)) break;
      }
      symbols.push(symbol);
    }
    canvas.dataset.symbols = String(symbols.length);
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    const now = performance.now();
    const collisionColor = getComputedStyle(document.documentElement).getPropertyValue('--collision-color').trim() || '#ffff00';
    symbols.forEach(s => {
      if (!s.img.complete || !s.img.naturalWidth) return;
      context.save();
      context.translate(s.x, s.y); context.rotate(s.rotation);
      context.globalAlpha = config.opacity / 100;
      if (config.effects && s.highlightUntil > now) {
        context.globalAlpha = Math.min(1, config.opacity / 100 * 1.5);
        context.shadowColor = collisionColor;
        context.shadowBlur = 12;
      }
      const size = s.size * s.scale;
      const aspect = s.img.naturalWidth / s.img.naturalHeight;
      const w = aspect < 1 ? size * aspect : size, h = aspect < 1 ? size : size / aspect;
      context.drawImage(s.img, -w / 2, -h / 2, w, h);
      context.restore();
    });
  }
  // Sample the actual alpha silhouette once per original PNG. Transparent margins
  // and spaces between branches remain empty, including when a logo is rotated.
  function makeMask(image) {
    const resolution = 128;
    const surface = document.createElement('canvas');
    surface.width = surface.height = resolution;
    const ctx = surface.getContext('2d', {willReadFrequently: true});
    const aspect = image.naturalWidth / image.naturalHeight;
    const w = aspect < 1 ? resolution * aspect : resolution;
    const h = aspect < 1 ? resolution : resolution / aspect;
    ctx.drawImage(image, (resolution - w) / 2, (resolution - h) / 2, w, h);
    const rgba = ctx.getImageData(0, 0, resolution, resolution).data;
    const alpha = new Uint8Array(resolution * resolution), points = [];
    const edges = [];
    for (let y = 0; y < resolution; y++) {
      let left = resolution, right = -1;
      for (let x = 0; x < resolution; x++) {
        if (rgba[(y * resolution + x) * 4 + 3] < 32) continue;
        alpha[y * resolution + x] = 1;
        points.push([(x + .5) / resolution - .5, (y + .5) / resolution - .5]);
        left = Math.min(left, x); right = Math.max(right, x);
      }
      if (right >= 0) {
        edges.push([left / resolution - .5, y / resolution - .5],
          [(right + 1) / resolution - .5, y / resolution - .5],
          [left / resolution - .5, (y + 1) / resolution - .5],
          [(right + 1) / resolution - .5, (y + 1) / resolution - .5]);
      }
    }
    // Convex hull only accelerates wall bounds; logo-to-logo contacts use alpha.
    edges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const half = values => { const hull = []; for (const point of values) {
      while (hull.length > 1 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) hull.pop();
      hull.push(point);
    } return hull.slice(0, -1); };
    return {resolution, alpha, points, hull: half(edges).concat(half([...edges].reverse()))};
  }
  function geometry(s) {
    const mask = s.img.collisionMask;
    if (!mask || !mask.points.length) return null;
    const size = s.size * s.scale, angle = s.rotation;
    const old = s.geometry;
    if (old && old.x === s.x && old.y === s.y && old.size === size && old.angle === angle) return old;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const bounds = {left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity};
    mask.hull.forEach(([x, y]) => {
      const wx = s.x + size * (x * cos - y * sin), wy = s.y + size * (x * sin + y * cos);
      bounds.left = Math.min(bounds.left, wx); bounds.right = Math.max(bounds.right, wx);
      bounds.top = Math.min(bounds.top, wy); bounds.bottom = Math.max(bounds.bottom, wy);
    });
    return s.geometry = {x: s.x, y: s.y, size, angle, cos, sin, bounds, mask};
  }
  function silhouettesOverlap(a, b, offsetX = 0, offsetY = 0) {
    const ga = geometry(a), gb = geometry(b);
    if (!ga || !gb) return false;
    const aa = ga.bounds, bb = gb.bounds;
    if (aa.right + offsetX <= bb.left || aa.left + offsetX >= bb.right ||
        aa.bottom + offsetY <= bb.top || aa.top + offsetY >= bb.bottom) return false;
    // Map occupied pixels from one rotated logo into the other's local alpha grid.
    for (const [x, y] of ga.mask.points) {
      const dx = a.x + offsetX + ga.size * (x * ga.cos - y * ga.sin) - b.x;
      const dy = a.y + offsetY + ga.size * (x * ga.sin + y * ga.cos) - b.y;
      const px = Math.floor(((dx * gb.cos + dy * gb.sin) / gb.size + .5) * gb.mask.resolution);
      const py = Math.floor(((-dx * gb.sin + dy * gb.cos) / gb.size + .5) * gb.mask.resolution);
      if (px >= 0 && py >= 0 && px < gb.mask.resolution && py < gb.mask.resolution && gb.mask.alpha[py * gb.mask.resolution + px]) return true;
    }
    return false;
  }
  function resolveCollision(a, b, now) {
    if (!silhouettesOverlap(a, b)) return;
    const dx = a.x - b.x, dy = a.y - b.y, distance = Math.hypot(dx, dy);
    const nx = distance ? dx / distance : 1, ny = distance ? dy / distance : 0;
    // Find the separation at the visible contour rather than moving to a circle.
    let low = 0, high = 1;
    while (silhouettesOverlap(a, b, nx * high, ny * high)) high *= 2;
    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      if (silhouettesOverlap(a, b, nx * mid, ny * mid)) low = mid; else high = mid;
    }
    const mass = a.mass + b.mass;
    a.x += nx * high * b.mass / mass; a.y += ny * high * b.mass / mass;
    b.x -= nx * high * a.mass / mass; b.y -= ny * high * a.mass / mass;
    const relative = (a.dx - b.dx) * nx + (a.dy - b.dy) * ny;
    if (relative >= 0) return;
    const impulse = (1 + restitution) * relative / mass;
    a.dx -= impulse * b.mass * nx; a.dy -= impulse * b.mass * ny;
    b.dx += impulse * a.mass * nx; b.dy += impulse * a.mass * ny;
    a.highlightUntil = b.highlightUntil = now + 200;
    const smaller = a.lvl < b.lvl ? a : b.lvl < a.lvl ? b : null;
    if (smaller && config.effects) {
      smaller.rotSpeed = (1 + Math.random() * 2) * (1 - smaller.lvl / 8);
      smaller.effectUntil = now + 1000;
    }
    canvas.dataset.collisions = String((Number(canvas.dataset.collisions) || 0) + 1);
  }
  function contain(s) {
    const shape = geometry(s);
    if (!shape) return;
    const b = shape.bounds;
    if (b.left < 0) { s.x -= b.left; s.dx = Math.abs(s.dx); }
    else if (b.right > width) { s.x -= b.right - width; s.dx = -Math.abs(s.dx); }
    if (b.top < 0) { s.y -= b.top; s.dy = Math.abs(s.dy); }
    else if (b.bottom > height) { s.y -= b.bottom - height; s.dy = -Math.abs(s.dy); }
  }
  function frame(now) {
    raf = 0;
    if (paused || document.hidden) return;
    const seconds = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    // Small steps prevent fast symbols passing through each other on slow frames.
    const steps = Math.max(1, Math.ceil(seconds / (1 / 120)));
    for (let step = 0; step < steps; step++) {
      const dt = seconds / steps * config.speed / 100;
      symbols.forEach(s => {
        const remaining = Math.max(0, (s.effectUntil - now) / 1000);
        s.scale = 1 - .5 * Math.sin(Math.PI * Math.min(1, remaining));
        if (remaining) s.rotation += s.rotSpeed * dt;
        const boost = remaining > .66 ? 1.5 : 1;
        s.x += s.dx * dt * boost; s.y += s.dy * dt * boost;
        contain(s);
      });
      if (seconds) for (let i = 0; i < symbols.length; i++) {
        for (let j = i + 1; j < symbols.length; j++) resolveCollision(symbols[i], symbols[j], now);
      }
      symbols.forEach(contain);
    }
    draw(); canvas.dataset.frame = String((Number(canvas.dataset.frame) || 0) + 1);
    raf = requestAnimationFrame(frame);
  }
  function update() {
    cancelAnimationFrame(raf); raf = 0; previous = 0;
    if (motionInput) motionInput.checked = !paused;
    canvas.dataset.motion = paused ? 'paused' : 'running';
    draw(); if (!paused && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function resize() {
    const oldWidth = width, oldHeight = height;
    width = innerWidth; height = innerHeight;
    if (oldWidth && oldHeight) symbols.forEach(s => { s.x *= width / oldWidth; s.y *= height / oldHeight; });
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0); populate(); draw();
  }
  const dialog = document.createElement('dialog');
  dialog.id = 'bsvrb-background-settings';
  dialog.className = 'background-settings';
  dialog.setAttribute('aria-labelledby', 'background-settings-title');
  dialog.innerHTML = `
    <form method="dialog" class="background-settings-header">
      <div><h2 id="background-settings-title">Hintergrund</h2><p>So ruhig oder lebendig, wie du möchtest.</p></div>
      <button class="background-close" aria-label="Einstellungen schliessen" autofocus>×</button>
    </form>
    <div class="background-theme"><label for="background-theme">Farbschema</label><select id="background-theme"><option value="system">Systemstandard</option><option value="light">Hell</option><option value="dark">Dunkel</option></select></div>
    <label class="background-switch"><span>Animation bewegen</span><input id="background-motion" type="checkbox"></label>
    <div class="background-sliders"></div>
    <label class="background-switch"><span>Effekte bei Kollisionen <small>Drehung und sanftes Aufleuchten</small></span><input id="background-effects" type="checkbox"></label>
    <p class="background-hint">Die Logos prallen auch ohne Effekte aneinander ab. Änderungen werden sofort angezeigt und auf diesem Gerät gespeichert.</p>
    <div class="background-settings-footer"><button type="button" class="background-reset">Ruhige Grundeinstellung</button><form method="dialog"><button class="background-done">Fertig</button></form></div>`;
  document.body.append(dialog);
  const motionInput = dialog.querySelector('#background-motion');
  const effectsInput = dialog.querySelector('#background-effects');
  const themeInput = dialog.querySelector('#background-theme');
  themeInput.value = document.documentElement.dataset.themePreference || 'system';
  themeInput.addEventListener('change', () => window.BsvrbTheme?.set(themeInput.value));
  document.addEventListener('bsvrb-theme-change', () => {
    themeInput.value = document.documentElement.dataset.themePreference || 'system';
  });
  const controls = {};
  const saveConfig = () => write('bsvrb_background_v1', JSON.stringify(config));
  const sliders = [
    ['density', 'Dichte', 0, 60, 'Wenige Logos', 'Viele Logos'],
    ['speed', 'Geschwindigkeit', 5, 100, 'Langsam', 'Schnell'],
    ['size', 'Logogrösse', 40, 160, 'Klein', 'Gross'],
    ['opacity', 'Sichtbarkeit', 0, 30, 'Dezent', 'Deutlich']
  ];
  const syncControls = () => {
    Object.entries(controls).forEach(([key, {input, output}]) => { input.value = config[key]; output.value = `${config[key]} %`; });
    effectsInput.checked = config.effects; motionInput.checked = !paused;
  };
  sliders.forEach(([key, title, min, max, low, high]) => {
    const row = document.createElement('div'); row.className = 'background-slider';
    row.innerHTML = `<label for="background-${key}">${title}<output for="background-${key}"></output></label><input id="background-${key}" type="range" min="${min}" max="${max}" step="1"><div class="background-range-labels"><span>${low}</span><span>${high}</span></div>`;
    dialog.querySelector('.background-sliders').append(row);
    const input = row.querySelector('input'), output = row.querySelector('output');
    controls[key] = {input, output};
    input.addEventListener('input', () => {
      config[key] = Number(input.value); output.value = `${config[key]} %`;
      if (key === 'density' || key === 'size') populate();
      saveConfig(); draw();
    });
  });
  motionInput.addEventListener('change', () => {
    paused = !motionInput.checked; write('bsvrb_motion', paused ? 'paused' : 'running');
    document.documentElement.dataset.motion = paused ? 'paused' : 'running';
    document.dispatchEvent(new Event('bsvrb-settings-change')); update();
  });
  effectsInput.addEventListener('change', () => {
    config.effects = effectsInput.checked;
    symbols.forEach(s => { s.effectUntil = 0; s.highlightUntil = 0; s.scale = 1; });
    saveConfig(); draw();
  });
  dialog.querySelector('.background-reset').addEventListener('click', () => {
    Object.assign(config, defaults); saveConfig(); populate(); syncControls(); draw();
  });
  toggle.addEventListener('click', () => { syncControls(); dialog.showModal(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  syncControls();
  preference.addEventListener('change', () => { if (read('bsvrb_motion') === null) { paused = preference.matches; update(); } });
  document.addEventListener('bsvrb-settings-change', () => {
    paused = document.documentElement.dataset.motion !== 'running'; update();
  });
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
