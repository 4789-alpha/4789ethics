function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-dark', 'theme-tanna', 'theme-ocean', 'theme-desert', 'theme-transparent', 'theme-custom');
  document.documentElement.style.removeProperty('--primary-color');
  document.documentElement.style.removeProperty('--accent-color');
  if (theme === 'custom') {
    const custom = JSON.parse(localStorage.getItem('ethicom_custom_theme') || '{}');
    Object.keys(custom).forEach(k => document.documentElement.style.setProperty(k, custom[k]));
    body.classList.add('theme-custom');
  } else {
    if (theme === 'tanna') {
      const saved = localStorage.getItem('ethicom_tanna_color');
      if (saved) {
        const { r, g, b } = JSON.parse(saved);
        const c = `rgb(${r},${g},${b})`;
        const h = `rgba(${Math.round(r*0.2)},${Math.round(g*0.2)},${Math.round(b*0.2)},0.9)`;
        const n = `rgba(${Math.round(r*0.3)},${Math.round(g*0.3)},${Math.round(b*0.3)},0.9)`;
        document.documentElement.style.setProperty('--primary-color', c);
        document.documentElement.style.setProperty('--accent-color', c);
        document.documentElement.style.setProperty('--header-bg', h);
        document.documentElement.style.setProperty('--nav-bg', n);
      }
    }
    body.classList.add('theme-' + theme);
  }
  document.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
}

function initThemeSelection() {
  const select = document.getElementById('theme_select');
  const customBtn = document.getElementById('custom_theme_btn');
  const tannaCard = document.getElementById('tanna_color');
  let theme = localStorage.getItem('ethicom_theme') || 'tanna-dark';
  applyTheme(theme);
  if (tannaCard) tannaCard.style.display = theme === 'tanna' ? 'block' : 'none';
  if (select) {
    select.value = theme;
    select.addEventListener('change', e => {
      theme = e.target.value;
      localStorage.setItem('ethicom_theme', theme);
      applyTheme(theme);
      if (tannaCard) tannaCard.style.display = theme === 'tanna' ? 'block' : 'none';
    });
  }
  if (customBtn) {
    const opLevel = window.opLevelToNumber ? window.opLevelToNumber(window.getStoredOpLevel()) : 0;
    if (opLevel >= 4) {
      customBtn.style.display = 'block';
      customBtn.addEventListener('click', createCustomTheme);
    }
  }
}

function parseCol(v){
  v=(v||'').trim();
  if(v.startsWith('#')){
    if(v.length===4) v='#'+v[1]+v[1]+v[2]+v[2]+v[3]+v[3];
    const n=parseInt(v.slice(1),16);
    return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
  }
  const m=v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m?{r:+m[1],g:+m[2],b:+m[3]}:{r:0,g:0,b:0};
}

function createCustomTheme() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.zIndex = 1000;

  const form = document.createElement('div');
  form.className = 'card';
  form.style.background = '#fff';
  form.style.color = '#000';
  form.innerHTML = `<h3>Custom Colors</h3>`;

  const vars = {
    '--bg-color': 'Background',
    '--text-color': 'Text',
    '--primary-color': 'Primary',
    '--accent-color': 'Accent'
  };
  const groups = [];
  const stored = JSON.parse(localStorage.getItem('ethicom_custom_theme') || '{}');
  for(const [name,label] of Object.entries(vars)){
    const base = parseCol(stored[name] || getComputedStyle(document.documentElement).getPropertyValue(name));
    const wrap = document.createElement('div');
    wrap.innerHTML = `<strong>${label}</strong><br>
      <label>R: <input type="range" min="0" max="255" value="${base.r}"> <span>${base.r}</span></label><br>
      <label>G: <input type="range" min="0" max="255" value="${base.g}"> <span>${base.g}</span></label><br>
      <label>B: <input type="range" min="0" max="255" value="${base.b}"> <span>${base.b}</span></label>
      <span class="color-preview"></span>`;
    const inputs = wrap.querySelectorAll('input');
    const spans = wrap.querySelectorAll('span');
    const preview = wrap.querySelector('.color-preview');
    function upd(){
      const r=+inputs[0].value,g=+inputs[1].value,b=+inputs[2].value;
      spans[0].textContent=r;spans[1].textContent=g;spans[2].textContent=b;
      const col=`rgb(${r},${g},${b})`;
      preview.style.backgroundColor=col;
    }
    inputs.forEach(i=>i.addEventListener('input',upd));
    upd();
    groups.push({name,getColor:()=>`rgb(${inputs[0].value},${inputs[1].value},${inputs[2].value})`});
    form.appendChild(wrap);
  }

  const save = document.createElement('button');
  save.id = 'cc_save';
  save.textContent = 'Save';
  const cancel = document.createElement('button');
  cancel.id = 'cc_cancel';
  cancel.textContent = 'Cancel';
  form.appendChild(save);
  form.appendChild(cancel);
  overlay.appendChild(form);
  document.body.appendChild(overlay);

  cancel.addEventListener('click', () => overlay.remove());
  save.addEventListener('click', () => {
    const custom = {};
    groups.forEach(g=>custom[g.name]=g.getColor());
    localStorage.setItem('ethicom_custom_theme', JSON.stringify(custom));
    localStorage.setItem('ethicom_theme', 'custom');
    applyTheme('custom');
    const select = document.getElementById('theme_select');
    if (select) select.value = 'custom';
    overlay.remove();
  });
}

window.applyTheme = applyTheme;
window.createCustomTheme = createCustomTheme;

document.addEventListener('DOMContentLoaded', initThemeSelection);
