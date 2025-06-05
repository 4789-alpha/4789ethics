// auto-outline.js - automatically add text outlines when contrast is low

(function(){
  const OUTLINE_COLORS = ['#000000', '#ffffff', '#39ff14'];

  function parseColor(v){
    v = (v || '').trim();
    if(v.startsWith('#')){
      if(v.length === 4) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
      const n = parseInt(v.slice(1),16);
      return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
    }
    const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? {r:+m[1],g:+m[2],b:+m[3]} : null;
  }

  function lum(v){
    v /= 255;
    return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  }

  function contrast(c1, c2){
    const l1 = 0.2126*lum(c1.r) + 0.7152*lum(c1.g) + 0.0722*lum(c1.b);
    const l2 = 0.2126*lum(c2.r) + 0.7152*lum(c2.g) + 0.0722*lum(c2.b);
    return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
  }

  function bestOutline(textColor){
    const tc = parseColor(textColor);
    if(!tc) return '#000';
    let best = OUTLINE_COLORS[0];
    let bestRatio = 0;
    OUTLINE_COLORS.forEach(c => {
      const ratio = contrast(tc, parseColor(c));
      if(ratio > bestRatio){ bestRatio = ratio; best = c; }
    });
    return best;
  }

  function applyAutoOutline(){
    document.querySelectorAll('body *').forEach(el => {
      const style = getComputedStyle(el);
      const color = parseColor(style.color);
      const bg = parseColor(style.backgroundColor);
      if(!color || !bg) return;
      if(contrast(color, bg) < 2){
        const oc = bestOutline(style.color);
        el.style.textShadow = `0 0 2px ${oc}`;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', applyAutoOutline);
  document.addEventListener('themeChanged', applyAutoOutline);
})();
