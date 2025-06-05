function applyTheme(theme) {
  const body = document.body;
  body.classList.remove(
    'theme-dark',
    'theme-tanna',
    'theme-tanna-dark',
    'theme-tanna-light',
    'theme-ocean',
    'theme-desert',
    'theme-transparent',
    'theme-custom',
    'theme-high-contrast'
  );
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
  const themes = ['tanna-dark','tanna','transparent','ocean','desert','custom'];
  const labels = ['Dark Tanna','Tanna','Transparent','Sea Blue','Desert','Custom'];
  let theme = localStorage.getItem('ethicom_theme') || 'tanna-dark';
  applyTheme(theme);
  if (tannaCard) tannaCard.style.display = theme === 'tanna' ? 'block' : 'none';
  if (select) {
    select.value = theme;
    select.addEventListener('change', e => {
      theme = e.target.value;
      localStorage.setItem('ethicom_theme', theme);
      applyTheme(theme);
      resetSlidersFromTheme();
      if (tannaCard) tannaCard.style.display = theme === 'tanna' ? 'block' : 'none';
      const idx = themes.indexOf(theme);
      if (slider && idx >= 0) {
        slider.value = idx;
        if (label) label.textContent = labels[idx];
      }
    });
  }
  if (slider) {
    slider.max = themes.length - 1;
    const cur = themes.indexOf(theme);
    slider.value = cur >= 0 ? cur : 0;
    if (label) label.textContent = labels[slider.value];
    slider.addEventListener('input', e => {
      const idx = parseInt(e.target.value, 10);
      theme = themes[idx] || themes[0];
      if (label) label.textContent = labels[idx] || labels[0];
      localStorage.setItem('ethicom_theme', theme);
      applyTheme(theme);
      resetSlidersFromTheme();
      if (tannaCard) tannaCard.style.display = theme === 'tanna' ? 'block' : 'none';
      if (select) select.value = theme;
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
    const base = parseColor(stored[name] || getComputedStyle(document.documentElement).getPropertyValue(name));
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
    resetSlidersFromTheme();
    const select = document.getElementById('theme_select');
    if (select) select.value = 'custom';
    overlay.remove();
  });
}

function initSliderSet(rId,gId,bId,rvId,gvId,bvId,previewId,storeKey,setCSS){
  const r=document.getElementById(rId),g=document.getElementById(gId),b=document.getElementById(bId);
  const rv=document.getElementById(rvId),gv=document.getElementById(gvId),bv=document.getElementById(bvId);
  const prev=document.getElementById(previewId);
  if(!r||!g||!b) return;
  const def=parseColor(getComputedStyle(document.documentElement).getPropertyValue(setCSS.var||setCSS));
  let cur;
  try{cur=JSON.parse(localStorage.getItem(storeKey)||'null');}catch{}
  if(!cur) cur=def;
  r.value=cur.r;g.value=cur.g;b.value=cur.b;
  function upd(){
    const c={r:+r.value,g:+g.value,b:+b.value};
    rv.textContent=c.r;gv.textContent=c.g;bv.textContent=c.b;
    if(previewId) prev.style.backgroundColor=`rgb(${c.r},${c.g},${c.b})`;
    localStorage.setItem(storeKey,JSON.stringify(c));
    const css=`rgb(${c.r},${c.g},${c.b})`;
    if(typeof setCSS ==='string') {
      document.documentElement.style.setProperty(setCSS,css);
      if (setCSS === '--bg-color' && document.body)
        document.body.style.setProperty('--bg-color', css);
    } else if(setCSS.apply) setCSS.apply(c,css);
  }
  [r,g,b].forEach(el=>el.addEventListener('input',upd));
  upd();
}

function updateSliderSet(rId,gId,bId,rvId,gvId,bvId,previewId,storeKey,setCSS){
  const r=document.getElementById(rId),g=document.getElementById(gId),b=document.getElementById(bId);
  const rv=document.getElementById(rvId),gv=document.getElementById(gvId),bv=document.getElementById(bvId);
  const prev=document.getElementById(previewId);
  if(!r||!g||!b) return;
  const c=parseColor(getComputedStyle(document.documentElement).getPropertyValue(setCSS.var||setCSS));
  r.value=c.r;g.value=c.g;b.value=c.b;
  if(rv) rv.textContent=c.r;
  if(gv) gv.textContent=c.g;
  if(bv) bv.textContent=c.b;
  if(previewId) prev.style.backgroundColor=`rgb(${c.r},${c.g},${c.b})`;
  localStorage.setItem(storeKey,JSON.stringify(c));
  const css=`rgb(${c.r},${c.g},${c.b})`;
  if(typeof setCSS==='string') {
    document.documentElement.style.setProperty(setCSS,css);
    if (setCSS === '--bg-color' && document.body)
      document.body.style.setProperty('--bg-color', css);
  } else if(setCSS.apply) setCSS.apply(c,css);
}

function resetSlidersFromTheme(){
  updateSliderSet('text_r_p','text_g_p','text_b_p','text_r_p_val','text_g_p_val','text_b_p_val','text_preview_p','ethicom_text_color','--text-color');
  updateSliderSet('bg_r','bg_g','bg_b','bg_r_val','bg_g_val','bg_b_val','bg_preview','ethicom_bg_color','--bg-color');
  updateSliderSet('tanna_r_p','tanna_g_p','tanna_b_p','tanna_r_p_val','tanna_g_p_val','tanna_b_p_val','tanna_preview_p','ethicom_tanna_color',{var:'--primary-color',apply:applyTannaCSS});
  updateSliderSet('module_r','module_g','module_b','module_r_val','module_g_val','module_b_val','module_preview','ethicom_module_color','--module-color');
}

function openColorSettingsPopin(){
  const prevFocus=document.activeElement;
  const overlay=document.createElement('div');
  overlay.style.position='fixed';overlay.style.top=0;overlay.style.left=0;
  overlay.style.right=0;overlay.style.bottom=0;overlay.style.background='rgba(0,0,0,0.5)';
  overlay.style.zIndex=1000;
  overlay.style.display='flex';
  overlay.style.alignItems='center';
  overlay.style.justifyContent='center';
  overlay.style.padding='1em';
  overlay.tabIndex=-1;


  const box=document.createElement('div');
  box.className='card';
  box.style.background='#fff';box.style.color='#000';
  box.style.maxHeight='90vh';box.style.overflowY='auto';
  box.style.position='relative';

  box.innerHTML=`<div id="theme_scheme_wrap" style="margin-bottom:0.5em;"><label for="theme_select_pop">Color Scheme:</label>
  <select id="theme_select_pop">
    <option value="tanna-dark">Dark Tanna</option>
    <option value="tanna">Tanna</option>
    <option value="transparent">Transparent</option>
    <option value="ocean">Sea Blue</option>
    <option value="desert">Desert</option>
    <option value="custom">Custom</option>
  </select></div>`+
  `
  <details class="card"><summary>Fonts</summary>
   <div id="text_color_pop">
  <label>R: <input type="range" id="text_r_p" min="0" max="255"> <span id="text_r_p_val"></span></label><br/>
  <label>G: <input type="range" id="text_g_p" min="0" max="255"> <span id="text_g_p_val"></span></label><br/>
  <label>B: <input type="range" id="text_b_p" min="0" max="255"> <span id="text_b_p_val"></span></label>
  <span id="text_preview_p" class="color-preview"></span>
 </div></details>
<details class="card"><summary>Background</summary>
 <div id="bg_color_pop">
  <label>R: <input type="range" id="bg_r" min="0" max="255"> <span id="bg_r_val"></span></label><br/>
  <label>G: <input type="range" id="bg_g" min="0" max="255"> <span id="bg_g_val"></span></label><br/>
  <label>B: <input type="range" id="bg_b" min="0" max="255"> <span id="bg_b_val"></span></label>
  <span id="bg_preview" class="color-preview"></span>
 </div></details>
<details class="card"><summary>Tanna Symbol</summary>
 <div id="tanna_color_pop">
  <label>R: <input type="range" id="tanna_r_p" min="0" max="255"> <span id="tanna_r_p_val"></span></label><br/>
  <label>G: <input type="range" id="tanna_g_p" min="0" max="255"> <span id="tanna_g_p_val"></span></label><br/>
  <label>B: <input type="range" id="tanna_b_p" min="0" max="255"> <span id="tanna_b_p_val"></span></label>
  <span id="tanna_preview_p" class="color-preview"></span><br/>
  <span id="tanna_contrast_p" style="color:red;display:none;">Low contrast with logos</span>
 </div></details>
<details class="card"><summary>Module Color</summary>
 <div id="module_color_pop">
  <label>R: <input type="range" id="module_r" min="0" max="255"> <span id="module_r_val"></span></label><br/>
  <label>G: <input type="range" id="module_g" min="0" max="255"> <span id="module_g_val"></span></label><br/>
  <label>B: <input type="range" id="module_b" min="0" max="255"> <span id="module_b_val"></span></label>
  <span id="module_preview" class="color-preview"></span>
 </div></details>`;

  overlay.appendChild(box);
  const closeBtn=document.createElement('button');
  closeBtn.id='color_popin_close';
  closeBtn.textContent='X';
  closeBtn.style.position='absolute';
  closeBtn.style.top='0.5em';
  closeBtn.style.right='0.5em';
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function closePopin(){
    overlay.remove();
    if(prevFocus&&typeof prevFocus.focus==='function') prevFocus.focus();
  }
  closeBtn.addEventListener('click',closePopin);
  closeBtn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();closePopin();}});
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closePopin();}});
  setTimeout(()=>closeBtn.focus(),0);

  const themes=['tanna-dark','tanna','transparent','ocean','desert','custom'];
  const labels=['Dark Tanna','Tanna','Transparent','Sea Blue','Desert','Custom'];
  const scheme=document.getElementById('theme_select_pop');
  if(scheme){
    const stored=localStorage.getItem('ethicom_theme')||'tanna-dark';
    scheme.value=stored;
    scheme.addEventListener('change',e=>{
      const val=e.target.value;
      localStorage.setItem('ethicom_theme',val);
      applyTheme(val);
      resetSlidersFromTheme();
      const idx=themes.indexOf(val);
      const slider=document.getElementById('theme_slider');
      const label=document.getElementById('theme_slider_label');
      if(slider&&idx>=0){
        slider.value=idx;
        if(label) label.textContent=labels[idx];
      }
    });
  }

  initSliderSet('text_r_p','text_g_p','text_b_p','text_r_p_val','text_g_p_val','text_b_p_val','text_preview_p','ethicom_text_color','--text-color');
  initSliderSet('bg_r','bg_g','bg_b','bg_r_val','bg_g_val','bg_b_val','bg_preview','ethicom_bg_color','--bg-color');

  function applyTanna(c){
    applyTannaColor(c);
  }

  function applyTannaCSS(c,css){
    document.getElementById('tanna_preview_p').style.backgroundColor=css;
    const warn=document.getElementById('tanna_contrast_p');
    function lum(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}    
    const base={r:34,g:139,b:34};
    const l1=0.2126*lum(c.r)+0.7152*lum(c.g)+0.0722*lum(c.b);
    const l2=0.2126*lum(base.r)+0.7152*lum(base.g)+0.0722*lum(base.b);
    if(warn) warn.style.display=((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))<2?'inline':'none';
    applyTanna(c);
  }
  initSliderSet('tanna_r_p','tanna_g_p','tanna_b_p','tanna_r_p_val','tanna_g_p_val','tanna_b_p_val','tanna_preview_p','ethicom_tanna_color',{var:'--primary-color',apply:applyTannaCSS});

  initSliderSet('module_r','module_g','module_b','module_r_val','module_g_val','module_b_val','module_preview','ethicom_module_color','--module-color');
}

window.applyTheme = applyTheme;
window.createCustomTheme = createCustomTheme;
window.openColorSettingsPopin = openColorSettingsPopin;

document.addEventListener('DOMContentLoaded', initThemeSelection);
document.addEventListener('keydown', e => {
  if (e.altKey && (e.key === 'h' || e.key === 'H')) {
    e.preventDefault();
    const cur = localStorage.getItem('ethicom_theme');
    const next = cur === 'high-contrast' ? 'dark' : 'high-contrast';
    localStorage.setItem('ethicom_theme', next);
    applyTheme(next);
    resetSlidersFromTheme();
    const select = document.getElementById('theme_select');
    if (select) select.value = next;
  }
});

function saveCurrentAsCustom(){
  if(localStorage.getItem('ethicom_theme')!=='custom') return;
  const vars=['--bg-color','--text-color','--primary-color','--accent-color'];
  const custom={};
  vars.forEach(v=>custom[v]=getComputedStyle(document.documentElement).getPropertyValue(v).trim());
  localStorage.setItem('ethicom_custom_theme',JSON.stringify(custom));
}

window.addEventListener('beforeunload',saveCurrentAsCustom);

function exportColorSettings(){
  const keys=['ethicom_theme','ethicom_custom_theme','ethicom_text_color','ethicom_bg_color','ethicom_tanna_color','ethicom_module_color'];
  const out={};
  keys.forEach(k=>{const v=localStorage.getItem(k); if(v) out[k]=v;});
  return JSON.stringify(out);
}

function importColorSettings(str){
  if(!str) return;
  try{
    const obj=JSON.parse(str);
    Object.entries(obj).forEach(([k,v])=>localStorage.setItem(k,v));
    if(obj.ethicom_theme) applyTheme(obj.ethicom_theme);
    resetSlidersFromTheme();
    if(typeof applyStoredColors==='function') applyStoredColors();
  }catch{}
}

window.exportColorSettings=exportColorSettings;
window.importColorSettings=importColorSettings;
