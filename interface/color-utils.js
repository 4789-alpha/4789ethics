function parseColor(v){
  v = (v || '').trim();
  if(v.startsWith('#')){
    if(v.length === 4) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    const n = parseInt(v.slice(1),16);
    return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
  }
  const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? {r:+m[1],g:+m[2],b:+m[3]} : {r:0,g:0,b:0};
}

function applyTannaColor(c){
  localStorage.setItem('ethicom_tanna_color', JSON.stringify(c));
  if(document.body.classList.contains('theme-tanna') ||
     document.body.classList.contains('theme-tanna-dark')){
    const css = `rgb(${c.r},${c.g},${c.b})`;
    document.documentElement.style.setProperty('--primary-color', css);
    document.documentElement.style.setProperty('--accent-color', css);
    const h = `rgba(${Math.round(c.r*0.2)},${Math.round(c.g*0.2)},${Math.round(c.b*0.2)},0.9)`;
    const n = `rgba(${Math.round(c.r*0.3)},${Math.round(c.g*0.3)},${Math.round(c.b*0.3)},0.9)`;
    document.documentElement.style.setProperty('--header-bg', h);
    document.documentElement.style.setProperty('--nav-bg', n);
  }
  document.dispatchEvent(new CustomEvent('themeChanged'));
}

if(typeof window !== 'undefined'){
  window.parseColor = parseColor;
  window.applyTannaColor = applyTannaColor;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = { parseColor, applyTannaColor };
}
