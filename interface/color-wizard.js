// Stepwise color settings wizard

function cwParseCol(v){
  v = (v || '').trim();
  if (v.startsWith('#')) {
    if (v.length === 4) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    const n = parseInt(v.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : { r: 0, g: 0, b: 0 };
}

function cwApplyTanna(c){
  if (document.body.classList.contains('theme-tanna') ||
      document.body.classList.contains('theme-tanna-dark')) {
    const css = `rgb(${c.r},${c.g},${c.b})`;
    document.documentElement.style.setProperty('--primary-color', css);
    document.documentElement.style.setProperty('--accent-color', css);
    const h = `rgba(${Math.round(c.r*0.2)},${Math.round(c.g*0.2)},${Math.round(c.b*0.2)},0.9)`;
    const n = `rgba(${Math.round(c.r*0.3)},${Math.round(c.g*0.3)},${Math.round(c.b*0.3)},0.9)`;
    document.documentElement.style.setProperty('--header-bg', h);
    document.documentElement.style.setProperty('--nav-bg', n);
  }
}

function cwApplyTannaCSS(c, css){
  const warn = document.getElementById('cw_tanna_contrast');
  function lum(v){ v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }
  const base = { r:34,g:139,b:34 };
  const l1 = 0.2126*lum(c.r) + 0.7152*lum(c.g) + 0.0722*lum(c.b);
  const l2 = 0.2126*lum(base.r) + 0.7152*lum(base.g) + 0.0722*lum(base.b);
  if (warn) warn.style.display = ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)) < 2 ? 'inline' : 'none';
  cwApplyTanna(c);
}

function cwBuildColorStep(title, storeKey, cssVar, prefix, applyFn){
  const def = cwParseCol(getComputedStyle(document.documentElement).getPropertyValue(cssVar.var||cssVar));
  let cur;
  try { cur = JSON.parse(localStorage.getItem(storeKey) || 'null'); } catch {}
  if (!cur) cur = def;
  const step = document.createElement('div');
  step.innerHTML = `<h3>${title}</h3>
    <label>R: <input type="range" id="${prefix}_r" min="0" max="255" value="${cur.r}"> <span id="${prefix}_r_val">${cur.r}</span></label><br/>
    <label>G: <input type="range" id="${prefix}_g" min="0" max="255" value="${cur.g}"> <span id="${prefix}_g_val">${cur.g}</span></label><br/>
    <label>B: <input type="range" id="${prefix}_b" min="0" max="255" value="${cur.b}"> <span id="${prefix}_b_val">${cur.b}</span></label>
    <span id="${prefix}_preview" class="color-preview"></span>` +
    (prefix==='cw_tanna' ? '<br/><span id="cw_tanna_contrast" style="color:red;display:none;">Low contrast with logos</span>' : '');
  const r = step.querySelector(`#${prefix}_r`);
  const g = step.querySelector(`#${prefix}_g`);
  const b = step.querySelector(`#${prefix}_b`);
  const rv = step.querySelector(`#${prefix}_r_val`);
  const gv = step.querySelector(`#${prefix}_g_val`);
  const bv = step.querySelector(`#${prefix}_b_val`);
  const prev = step.querySelector(`#${prefix}_preview`);
  function update(){
    const c = { r:+r.value, g:+g.value, b:+b.value };
    rv.textContent = c.r; gv.textContent = c.g; bv.textContent = c.b;
    const css = `rgb(${c.r},${c.g},${c.b})`;
    if (prev) prev.style.backgroundColor = css;
    if (typeof cssVar === 'string') document.documentElement.style.setProperty(cssVar, css);
    else document.documentElement.style.setProperty(cssVar.var, css);
    if (applyFn) applyFn(c, css);
    tempColors[storeKey] = c;
  }
  [r,g,b].forEach(i=>i.addEventListener('input', update));
  update();
  return step;
}

function openColorSettingsWizard(){
  const overlay = document.createElement('div');
  overlay.style.position='fixed'; overlay.style.top=0; overlay.style.left=0;
  overlay.style.right=0; overlay.style.bottom=0; overlay.style.background='rgba(0,0,0,0.5)';
  overlay.style.zIndex=1000; overlay.style.display='flex'; overlay.style.alignItems='center';
  overlay.style.justifyContent='center'; overlay.style.padding='1em';

  const box = document.createElement('div');
  box.className='card'; box.style.background='#fff'; box.style.color='#000';
  box.style.maxHeight='90vh'; box.style.overflowY='auto'; box.style.position='relative';

  const stepWrap = document.createElement('div');
  box.appendChild(stepWrap);

  const nav = document.createElement('div');
  nav.style.marginTop='0.5em';
  const backBtn = document.createElement('button'); backBtn.textContent='Back';
  const nextBtn = document.createElement('button'); nextBtn.textContent='Next';
  const confirmBtn = document.createElement('button'); confirmBtn.textContent='Confirm';
  const cancelBtn = document.createElement('button'); cancelBtn.textContent='Cancel';
  nav.appendChild(backBtn); nav.appendChild(nextBtn); nav.appendChild(confirmBtn); nav.appendChild(cancelBtn);
  box.appendChild(nav);

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  cancelBtn.addEventListener('click', () => overlay.remove());

  const tempTheme = localStorage.getItem('ethicom_theme') || 'tanna-dark';
  const tempColors = {};

  const steps = [];
  // Step 0 Theme
  const step0 = document.createElement('div');
  step0.innerHTML = `<label for="cw_theme_select">Color Scheme:</label>
    <select id="cw_theme_select">
      <option value="tanna-dark">Dark Tanna</option>
      <option value="tanna">Tanna</option>
      <option value="transparent">Transparent</option>
      <option value="ocean">Sea Blue</option>
      <option value="desert">Desert</option>
      <option value="custom">Custom</option>
    </select>`;
  const themeSelect = step0.querySelector('#cw_theme_select');
  let themeValue = tempTheme;
  themeSelect.value = themeValue;
  themeSelect.addEventListener('change', e => {
    themeValue = e.target.value;
    if (typeof applyTheme === 'function') applyTheme(themeValue);
  });
  steps.push(step0);

  steps.push(cwBuildColorStep('Fonts','ethicom_text_color','--text-color','cw_text'));
  steps.push(cwBuildColorStep('Background','ethicom_bg_color','--bg-color','cw_bg'));
  steps.push(cwBuildColorStep('Tanna Symbol','ethicom_tanna_color',{var:'--primary-color'},'cw_tanna',cwApplyTannaCSS));
  steps.push(cwBuildColorStep('Module Color','ethicom_module_color','--module-color','cw_module'));

  const confirmStep = document.createElement('div');
  confirmStep.innerHTML = '<p>Save these colors?</p>';
  steps.push(confirmStep);

  let current = 0;
  function showStep(i){
    current = i;
    steps.forEach((s,idx)=>{ s.style.display = idx===i ? 'block':'none'; });
    backBtn.style.display = i === 0 ? 'none' : 'inline';
    nextBtn.style.display = i < steps.length-1 ? 'inline' : 'none';
    confirmBtn.style.display = i === steps.length-1 ? 'inline' : 'none';
  }

  backBtn.addEventListener('click', ()=> showStep(current-1));
  nextBtn.addEventListener('click', ()=> showStep(current+1));

  confirmBtn.addEventListener('click', ()=>{
    localStorage.setItem('ethicom_theme', themeValue);
    if (typeof applyTheme === 'function') applyTheme(themeValue);
    Object.entries(tempColors).forEach(([k,v])=>{
      localStorage.setItem(k, JSON.stringify(v));
      const css = `rgb(${v.r},${v.g},${v.b})`;
      if (k==='ethicom_tanna_color') cwApplyTanna(v);
      else if (k==='ethicom_text_color') document.documentElement.style.setProperty('--text-color',css);
      else if (k==='ethicom_bg_color') document.documentElement.style.setProperty('--bg-color',css);
      else if (k==='ethicom_module_color') document.documentElement.style.setProperty('--module-color',css);
    });
    overlay.remove();
  });

  steps.forEach(s=>stepWrap.appendChild(s));
  showStep(0);
}

window.openColorSettingsWizard = openColorSettingsWizard;
