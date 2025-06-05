// Generated bundle. Do not edit directly.

//----- accessibility.js -----
function applyAccessibilityFromStorage() {
  const saved = JSON.parse(localStorage.getItem("ethicom_access") || "{}");
  const font = saved.font || "normal";
  const simple = saved.simple || "no";
  const slow = saved.slow || "no";
  document.body.classList.toggle("large-font", font === "large");
  const enabled = simple === "yes";
  document.body.classList.toggle("simple-mode", enabled);
  document.body.classList.add("highlight-fonts");
  localStorage.setItem("simple_mode", enabled ? "true" : "false");
}

function initAccessibilitySetup() {
  applyAccessibilityFromStorage();
  const container = document.getElementById("access_setup");
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem("ethicom_access") || "{}");
  const vision = saved.vision || "yes";
  const hearing = saved.hearing || "yes";
  const speech = saved.speech || "no";
  const font = saved.font || "normal";
  const simple = saved.simple || "no";

  container.innerHTML = `
    <label for="vision_select" data-ui="access_label_vision">Can you see the screen?</label>
    <select id="vision_select">
      <option value="yes" data-ui="access_opt_yes">Yes</option>
      <option value="no" data-ui="access_opt_no">No</option>
    </select>

    <label for="hearing_select" data-ui="access_label_hearing">Can you hear from this device?</label>
    <select id="hearing_select">
      <option value="yes_nospeech" data-ui="access_opt_yes_nospeech">Yes, but cannot speak</option>
      <option value="yes" data-ui="access_opt_yes">Yes</option>
      <option value="no" data-ui="access_opt_no">No</option>
    </select>

    <label for="speech_select" data-ui="access_label_speech">Can you speak?</label>
    <select id="speech_select">
      <option value="no" data-ui="access_opt_no">No</option>
      <option value="yes" data-ui="access_opt_yes">Yes</option>
    </select>

    <label for="simple_select" data-ui="access_label_simple">Simplified interface?</label>
    <select id="simple_select">
      <option value="no" data-ui="access_opt_no">No</option>
      <option value="yes" data-ui="access_opt_yes">Yes</option>
    </select>

    <label for="font_select">Font size:</label>
    <select id="font_select">
      <option value="normal">Normal</option>
      <option value="large">Large</option>
    </select>

    <label for="slow_select">Slow mode?</label>
    <select id="slow_select">
      <option value="no">No</option>
      <option value="yes">Yes</option>
    </select>

    <button id="access_save" data-ui="access_save_btn">Save Setup</button>
  `;

  document.getElementById("vision_select").value = vision;
  document.getElementById("hearing_select").value = hearing;
  document.getElementById("speech_select").value = speech;
  document.getElementById("simple_select").value = simple;
  const slowSel = document.getElementById("slow_select");
  if (slowSel) slowSel.value = slow;
  document.getElementById("font_select").value = font;

  function applyFont(val) {
    document.body.classList.toggle("large-font", val === "large");
  }
  applyFont(font);

  function applySimple(val) {
    const enabled = val === "yes";
    document.body.classList.toggle("simple-mode", enabled);
    localStorage.setItem("simple_mode", enabled ? "true" : "false");
  }
  applySimple(simple);

  function applySlow(val) {
    const enabled = val === "yes";
    if (window.slowMode) slowMode.enabled = enabled;
    document.body.classList.toggle("slow-mode", enabled);
    localStorage.setItem("ethicom_slow_mode", enabled ? "true" : "false");
  }
  applySlow(slow);

  document.getElementById("access_save").addEventListener("click", () => {
    const data = {
      vision: document.getElementById("vision_select").value,
      hearing: document.getElementById("hearing_select").value,
      speech: document.getElementById("speech_select").value,
      font: document.getElementById("font_select").value,
      simple: document.getElementById("simple_select").value,
      slow: document.getElementById("slow_select").value
    };
    localStorage.setItem("ethicom_access", JSON.stringify(data));
    applyFont(data.font);
    applySimple(data.simple);
    applySlow(data.slow);
    loadUiTexts().then(txt => {
      const t = txt[getLanguage()] || txt.en || {};
      alert(t.access_saved || "Accessibility preferences saved.");
    });
  });
}

window.addEventListener("DOMContentLoaded", initAccessibilitySetup);


//----- attention-seeker.js -----
(function() {
  const cfg = JSON.parse(localStorage.getItem('ethicom_attention') || '{}');
  const state = {
    wiggle: cfg.wiggle === 'true',
    beep: cfg.beep === 'true'
  };
  const idleLimit = 60000; // 1 minute
  let last = Date.now();
  function save() {
    localStorage.setItem('ethicom_attention', JSON.stringify(state));
  }
  function reset() { last = Date.now(); }
  function playBeep() {
    if (!state.beep) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.frequency.value = 880;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 200);
    } catch {}
  }
  function doWiggle() {
    if (!state.wiggle) return;
    const el = document.getElementById('op_interface');
    if (!el) return;
    el.classList.add('attention-wiggle');
    setTimeout(() => el.classList.remove('attention-wiggle'), 1800);
  }
  function check() {
    if (Date.now() - last > idleLimit) {
      playBeep();
      doWiggle();
      last = Date.now();
    }
  }
  function start() {
    ['mousemove','keydown','click','touchstart'].forEach(ev => {
      document.addEventListener(ev, reset, {passive:true});
    });
    setInterval(check, 5000);
  }
  function toggleWiggle(on) { state.wiggle = on; save(); }
  function toggleBeep(on) { state.beep = on; save(); }
  window.attentionSettings = { toggleWiggle, toggleBeep, state, start };
  document.addEventListener('DOMContentLoaded', () => {
    if (state.wiggle || state.beep) start();
  });
})();


//----- auto-outline.js -----
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


//----- bewertung.js -----
// bewertung.js -- OP-0 rating with swipe control

let ratingTexts = {};
let ratingInfo = {};
let detailsMap = {};
let candidateList = [];

function vibrateHeartbeat() {
  if (
    window.touchSettings &&
    window.touchSettings.state.haptics &&
    navigator.vibrate
  ) {
    navigator.vibrate([60, 40, 60]);
  }
}

async function loadRatingTexts() {
  try {
    const txt = await fetch('i18n/ui-text.json').then(r => r.json());
    const lang = (typeof getLanguage === 'function' ? getLanguage() : document.documentElement.lang) || 'de';
    ratingTexts = txt[lang] || txt.en || {};
  } catch {
    ratingTexts = {};
  }
}

async function loadRatings() {
  try {
    const list = await fetch('evidence/person-ratings.json').then(r => r.json());
    ratingInfo = {};
    list.forEach(r => {
      const num = parseInt(String(r.op_level).replace('OP-', '').split('.')[0], 10) || 0;
      if (!ratingInfo[r.human_id]) ratingInfo[r.human_id] = { counts: {}, max: 0 };
      ratingInfo[r.human_id].counts[r.rating] = (ratingInfo[r.human_id].counts[r.rating] || 0) + 1;
      if (num > ratingInfo[r.human_id].max) ratingInfo[r.human_id].max = num;
    });
  } catch {
    ratingInfo = {};
  }
}

async function loadDetails() {
  let details = [];
  try {
    details = await fetch('sources/persons/human-top100.json').then(r => r.json());
  } catch { details = []; }
  detailsMap = {};
  details.forEach(d => { detailsMap[d.human_id] = d; });
}

function pickRandomCandidate() {
  if (!candidateList.length) return null;
  const preferred = candidateList.filter(c => {
    const info = ratingInfo[c.human_id];
    return !info || info.max <= 1;
  });
  const pool = preferred.length ? preferred : candidateList;
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

async function initBewertung() {
  const container = document.getElementById('rating_container');
  if (!container) return;
  await loadRatingTexts();
  if (window.bewertungKeyHandler) {
    document.removeEventListener('keydown', window.bewertungKeyHandler);
    window.bewertungKeyHandler = null;
  }
  if (window.touchSettings && window.touchSettings.registerSwipeHandler)
    window.touchSettings.registerSwipeHandler(null);

  await loadRatings();
  await loadDetails();

  let list = [];
  let links = [];
  try {
    list = await fetch('sources/persons/human-op0-candidates.json').then(r => r.json());
  } catch { list = []; }
  try {
    links = await fetch('references/human-wiki-links.json').then(r => r.json());
  } catch { links = []; }
  const linkMap = {};
  links.forEach(l => { linkMap[l.human_id] = l.wiki; });
  candidateList = list.map(p => {
    const det = detailsMap[p.human_id] || {};
    return Object.assign({}, p, det);
  });
  const options = list.map(p => `<option value="${p.human_id}">${p.name}</option>`).join('');
  container.innerHTML = `
    <h3>Person bewerten</h3>
    <label for="human_search">Suche:</label>
    <input type="text" id="human_search" placeholder="Name oder ID" />
    <ul id="search_results"></ul>
    <label for="human_sel">Person:</label>
    <select id="human_sel">${options}</select>
    <div id="sed_card" style="margin:0.5em 0;"></div>
    <label for="rating_sel">Bewertung:</label>
    <select id="rating_sel">
      <option value="yes">Ethisch</option>
      <option value="unclear">Unsicher</option>
      <option value="no">Unethisch</option>
    </select>
    <button onclick="submitBewertung()">Speichern</button>
    <button class="secondary-button" type="button" onclick="initBewertung()">Reset</button>
  `;
  const sel = document.getElementById('human_sel');
  const randomPick = pickRandomCandidate();
  if (sel && randomPick) sel.value = randomPick.human_id;
  applySedCard();
  if (sel) sel.addEventListener('change', applySedCard);
  const searchInput = document.getElementById('human_search');
  const resultsList = document.getElementById('search_results');
  if (searchInput) searchInput.addEventListener('input', e => performSearch(e.target.value));

  function handle(dir) {
    const card = container;
    if (!card) return;
    card.classList.remove('swipe-left','swipe-right','swipe-up','swipe-down');
    const choiceEl = document.getElementById('rating_sel');
    if (dir === 'left') choiceEl.value = 'unclear';
    if (dir === 'up') choiceEl.value = 'yes';
    if (dir === 'down') choiceEl.value = 'no';
    if (dir === 'right') {
      const s = document.getElementById('human_sel');
      const id = s.value;
      const link = linkMap[id];
      if (link) window.open(link, '_blank');
      const info = ratingInfo[id];
      if (!info || info.max <= 1) {
        const total = info ? Object.values(info.counts).reduce((a, b) => a + b, 0) : 0;
        const choice = choiceEl.value;
        const same = info && info.counts[choice] ? info.counts[choice] : 0;
        const percent = total ? Math.round((same / total) * 100) : 0;
        alert(`Daten wurden in den Quellen überprüft. Anzahl bisherige Stimmen: ${total}, Stimmen gleicher Meinung: ${percent}%`);
      }
    }
    card.classList.add('swipe-' + dir);
    setTimeout(() => card.classList.remove('swipe-left','swipe-right','swipe-up','swipe-down'), 300);
  }

  if (window.touchSettings && window.touchSettings.registerSwipeHandler)
    window.touchSettings.registerSwipeHandler(handle);
  window.bewertungKeyHandler = e => {
    if (e.code === 'ArrowLeft') handle('left');
    if (e.code === 'ArrowUp') handle('up');
    if (e.code === 'ArrowDown') handle('down');
    if (e.code === 'ArrowRight') handle('right');
  };
  document.addEventListener('keydown', window.bewertungKeyHandler);

  function performSearch(q) {
    const query = q.toLowerCase();
    if (!resultsList) return;
    resultsList.innerHTML = '';
    if (!query) return;
    const matches = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.human_id && p.human_id.toLowerCase().includes(query))
    ).slice(0, 8);
    matches.forEach(m => {
      const li = document.createElement('li');
      li.textContent = `${m.name} (${m.human_id})`;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        if (sel) sel.value = m.human_id;
        applySedCard();
        if (resultsList) resultsList.innerHTML = '';
        if (searchInput) searchInput.value = '';
      });
      resultsList.appendChild(li);
    });
  }

  function applySedCard() {
    const s = document.getElementById('human_sel');
    const id = s.value;
    const obj = candidateList.find(p => p.human_id === id) || {};
    const link = linkMap[id];
    const sed = document.getElementById('sed_card');
    if (!sed) return;
    const img = obj.image ? `<img class="person-image" src="${obj.image}" alt="${obj.name}">` : '';
    const domain = obj.domain ? `<p>${obj.domain}</p>` : '';
    const era = obj.era ? `<p>${obj.era}</p>` : '';
    const desc = obj.description ? `<p>${obj.description}</p>` : '';
    sed.innerHTML = img + `<strong>${obj.name || ''}</strong>` +
      (link ? ` – <a href="${link}" target="_blank">Info</a>` : '') +
      domain + era + desc;
  }
}

function submitBewertung() {
  const sel = document.getElementById('human_sel');
  const human_id = sel.value;
  const human_name = sel.options[sel.selectedIndex].textContent;
  const rating = document.getElementById('rating_sel').value;
  const timestamp = new Date().toISOString();
  let operator = 'anonymous';
  let opLevel = 'OP-0';
  try {
    const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
    if (sig && sig.id) {
      operator = sig.id;
      opLevel = sig.op_level || 'OP-1';
    }
  } catch {}
  const evalData = {
    human_id,
    person: human_name,
    rating,
    operator,
    op_level: opLevel,
    timestamp
  };
  const out = document.getElementById('output');
  if (out) out.textContent = JSON.stringify(evalData, null, 2);
  if (typeof recordEvidence === 'function')
    recordEvidence(JSON.stringify(evalData), 'user');
  if (!ratingInfo[human_id]) ratingInfo[human_id] = { counts: {}, max: 0 };
  ratingInfo[human_id].counts[rating] = (ratingInfo[human_id].counts[rating] || 0) + 1;
  const lvl = parseInt(evalData.op_level.replace('OP-', '').split('.')[0], 10) || 0;
  if (lvl > ratingInfo[human_id].max) ratingInfo[human_id].max = lvl;
  alert(ratingTexts.rating_saved || 'Rating saved.');
  vibrateHeartbeat();
}

if (typeof module !== 'undefined') {
  module.exports = { initBewertung, submitBewertung };
}


//----- biometric-login.js -----
(function(){
  async function biometricLogin() {
    const statusEl = document.getElementById('login_status');
    if (!window.PublicKeyCredential) {
      if (statusEl) statusEl.textContent = 'Biometric login not supported.';
      return;
    }
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required'
        }
      });
      if (statusEl) statusEl.textContent = 'Biometric check successful.';
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Biometric check failed. Please try again.';
    }
  }
  window.biometricLogin = biometricLogin;
})();


//----- color-auth.js -----
const colorLocales = {
  en: {
    map: { red: 'red', green: 'green', blue: 'blue', yellow: 'yellow' },
    qNew: 'Choose a primary color for authentication ({c}):',
    qRepeat: 'Was your last color the same (at last start)? ({c})',
    invalid: 'Only basic colors {c} allowed.',
    confirmed: 'Color confirmed. Welcome back.',
    mismatch: 'Note: wrong user, no confirmation.',
    saved: 'Color saved: {color}'
  },
  de: {
    map: { rot: 'rot', gruen: 'grün', grün: 'grün', blau: 'blau', gelb: 'gelb' },
    qNew: 'Wähle eine Grundfarbe zur Authentifizierung ({c}):',
    qRepeat: 'War deine letzte Farbe gleich (beim letzten Start)? ({c})',
    invalid: 'Nur Grundfarben {c} wählbar.',
    confirmed: 'Farbe bestätigt. Willkommen zurück.',
    mismatch: 'Hinweis: falscher User, keine Bestätigung.',
    saved: 'Farbe gespeichert: {color}'
  },
  fr: {
    map: { rouge: 'rouge', vert: 'vert', bleu: 'bleu', jaune: 'jaune' },
    qNew: "Choisissez une couleur primaire pour l'authentification ({c}):",
    qRepeat: 'Votre dernière couleur était-elle identique (au dernier lancement)? ({c})',
    invalid: 'Seules les couleurs {c} sont autorisées.',
    confirmed: 'Couleur confirmée. Bon retour.',
    mismatch: 'Attention : mauvais utilisateur, aucune confirmation.',
    saved: 'Couleur enregistrée : {color}'
  },
  es: {
    map: { rojo: 'rojo', verde: 'verde', azul: 'azul', amarillo: 'amarillo' },
    qNew: 'Elige un color primario para autenticar ({c}):',
    qRepeat: '¿Tu último color era el mismo (en el último inicio)? ({c})',
    invalid: 'Solo se permiten los colores {c}.',
    confirmed: 'Color confirmado. Bienvenido de nuevo.',
    mismatch: 'Aviso: usuario incorrecto, sin confirmación.',
    saved: 'Color guardado: {color}'
  },
  pt: {
    map: { vermelho: 'vermelho', verde: 'verde', azul: 'azul', amarelo: 'amarelo' },
    qNew: 'Escolha uma cor primária para autenticação ({c}):',
    qRepeat: 'Sua última cor era a mesma (no último início)? ({c})',
    invalid: 'Apenas as cores {c} são permitidas.',
    confirmed: 'Cor confirmada. Bem-vindo de volta.',
    mismatch: 'Aviso: usuário errado, sem confirmação.',
    saved: 'Cor salva: {color}'
  },
  zh: {
    map: { '红': '红', '绿': '绿', '蓝': '蓝', '黄': '黄' },
    qNew: '请选择用于认证的基础颜色（{c}）：',
    qRepeat: '你上次选择的颜色相同吗（上次启动时）？（{c}）',
    invalid: '只允许选择基本颜色：{c}。',
    confirmed: '颜色确认。欢迎回来。',
    mismatch: '提示：用户错误，未确认。',
    saved: '颜色已保存：{color}'
  },
  hi: {
    map: { 'लाल': 'लाल', 'हरा': 'हरा', 'नीला': 'नीला', 'पीला': 'पीला' },
    qNew: 'प्रमाणीकरण के लिए एक प्राथमिक रंग चुनें ({c}):',
    qRepeat: 'क्या पिछली बार यही रंग था? ({c})',
    invalid: 'केवल {c} रंग चुनें।',
    confirmed: 'रंग पुष्टि किया गया। आपका स्वागत है।',
    mismatch: 'ध्यान दें: गलत उपयोगकर्ता, पुष्टि नहीं हुई।',
    saved: 'रंग सहेजा गया: {color}'
  },
  ar: {
    map: { 'أحمر': 'أحمر', 'أخضر': 'أخضر', 'أزرق': 'أزرق', 'أصفر': 'أصفر' },
    qNew: 'اختر لونًا أساسيًا للتوثيق ({c}):',
    qRepeat: 'هل كان لونك الأخير هو نفسه (عند آخر تشغيل)؟ ({c})',
    invalid: 'يُسمح فقط بالألوان {c}.',
    confirmed: 'تم تأكيد اللون. مرحبًا بعودتك.',
    mismatch: 'تنبيه: مستخدم خاطئ، لا يوجد تأكيد.',
    saved: 'تم حفظ اللون: {color}'
  },
  ja: {
    map: { '赤': '赤', '緑': '緑', '青': '青', '黄': '黄' },
    qNew: '認証に使う基本色を選択してください（{c}）:',
    qRepeat: '前回の色は同じでしたか（前回の起動時）？（{c}）',
    invalid: ' {c} のみ選択できます。',
    confirmed: '色が確認されました。お帰りなさい。',
    mismatch: '注意：別のユーザーです。確認されません。',
    saved: '色を保存しました: {color}'
  },
  sw: {
    map: { nyekundu: 'nyekundu', kijani: 'kijani', bluu: 'bluu', njano: 'njano' },
    qNew: 'Chagua rangi kuu kwa uthibitisho ({c}):',
    qRepeat: 'Je, rangi yako ya mwisho ilikuwa sawa? ({c})',
    invalid: 'Rangi zinazokubalika ni {c} pekee.',
    confirmed: 'Rangi imethibitishwa. Karibu tena.',
    mismatch: 'Tahadhari: mtumiaji si sahihi, hakuna uthibitisho.',
    saved: 'Rangi imehifadhiwa: {color}'
  },
  ru: {
    map: { 'красный': 'красный', 'зеленый': 'зеленый', 'синий': 'синий', 'желтый': 'желтый' },
    qNew: 'Выберите основной цвет для аутентификации ({c}):',
    qRepeat: 'Ваш последний цвет был таким же? ({c})',
    invalid: 'Можно использовать только цвета {c}.',
    confirmed: 'Цвет подтвержден. С возвращением.',
    mismatch: 'Замечание: неверный пользователь, подтверждения нет.',
    saved: 'Цвет сохранен: {color}'
  },
  it: {
    map: { rosso: 'rosso', verde: 'verde', blu: 'blu', giallo: 'giallo' },
    qNew: "Scegli un colore primario per l'autenticazione ({c}):",
    qRepeat: 'Il tuo ultimo colore era lo stesso (all\'ultimo avvio)? ({c})',
    invalid: 'Sono consentiti solo {c}.',
    confirmed: 'Colore confermato. Bentornato.',
    mismatch: 'Nota: utente errato, nessuna conferma.',
    saved: 'Colore salvato: {color}'
  },
  ko: {
    map: { '빨간': '빨간', '초록': '초록', '파랑': '파랑', '노랑': '노랑' },
    qNew: '인증을 위해 기본 색상을 선택하세요 ({c}):',
    qRepeat: '마지막 색상이 같았습니까? ({c})',
    invalid: '{c}만 선택 가능합니다.',
    confirmed: '색상이 확인되었습니다. 다시 오신 것을 환영합니다.',
    mismatch: '알림: 잘못된 사용자, 확인되지 않았습니다.',
    saved: '색상이 저장되었습니다: {color}'
  },
  fa: {
    map: { 'قرمز': 'قرمز', 'سبز': 'سبز', 'آبی': 'آبی', 'زرد': 'زرد' },
    qNew: 'برای احراز هویت یک رنگ اصلی انتخاب کنید ({c}):',
    qRepeat: 'آیا رنگ آخرتان همان بود؟ ({c})',
    invalid: 'تنها رنگ‌های {c} مجاز هستند.',
    confirmed: 'رنگ تأیید شد. خوش آمدید.',
    mismatch: 'توجه: کاربر اشتباه، تأیید نشد.',
    saved: 'رنگ ذخیره شد: {color}'
  },
  pl: {
    map: { czerwony: 'czerwony', zielony: 'zielony', niebieski: 'niebieski', żółty: 'żółty' },
    qNew: 'Wybierz podstawowy kolor do uwierzytelnienia ({c}):',
    qRepeat: 'Czy ostatni kolor był taki sam? ({c})',
    invalid: 'Dozwolone są tylko kolory {c}.',
    confirmed: 'Kolor potwierdzony. Witamy ponownie.',
    mismatch: 'Uwaga: zły użytkownik, brak potwierdzenia.',
    saved: 'Kolor zapisany: {color}'
  },
  nl: {
    map: { rood: 'rood', groen: 'groen', blauw: 'blauw', geel: 'geel' },
    qNew: 'Kies een primaire kleur voor authenticatie ({c}):',
    qRepeat: 'Was je laatste kleur hetzelfde (bij de laatste start)? ({c})',
    invalid: 'Alleen de kleuren {c} zijn toegestaan.',
    confirmed: 'Kleur bevestigd. Welkom terug.',
    mismatch: 'Opmerking: verkeerde gebruiker, geen bevestiging.',
    saved: 'Kleur opgeslagen: {color}'
  }
};

function getLang() {
  if (typeof getLanguage === 'function') return getLanguage();
  return (navigator.language || 'en').slice(0, 2);
}

function verifyColorAuth(locale) {
  const lastTime = parseInt(localStorage.getItem('ethicom_color_time') || '0', 10);
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (now - lastTime < twentyFourHours) return;

  localStorage.setItem('ethicom_color_time', String(now));

  const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
  const stored =
    (sig.private && sig.private.color) || localStorage.getItem('ethicom_color');
  const colors = Object.keys(locale.map);
  const list = colors.join(', ');
  const question = stored
    ? locale.qRepeat.replace('{c}', list)
    : locale.qNew.replace('{c}', list);
  const input = prompt(question);
  if (!input) return;
  const value = input.trim().toLowerCase();
  if (!locale.map[value]) {
    alert(locale.invalid.replace('{c}', list));
    return;
  }
  const normalized = locale.map[value];
  if (stored) {
    if (normalized === stored) {
      alert(locale.confirmed);
    } else {
      alert(locale.mismatch);
    }
  } else {
    if (!sig.private) sig.private = {};
    sig.private.color = normalized;
    localStorage.setItem('ethicom_signature', JSON.stringify(sig));
    localStorage.removeItem('ethicom_color');
    alert(locale.saved.replace('{color}', normalized));
  }
}

function initColorAuth() {
  const level =
    typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : null;
  if (!level || opLevelToNumber(level) < 1) return;
  const lang = getLang();
  const locale = colorLocales[lang] || colorLocales.en;
  verifyColorAuth(locale);
}

window.addEventListener('DOMContentLoaded', initColorAuth);


//----- color-utils.js -----
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


//----- color-wizard.js -----
// Stepwise color settings wizard

let tempColors = {};


function cwApplyTanna(c){
  applyTannaColor(c);
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
  const def = parseColor(getComputedStyle(document.documentElement).getPropertyValue(cssVar.var||cssVar));
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
  overlay.style.right=0; overlay.style.bottom=0; overlay.style.background='transparent';
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

  const tempTheme = localStorage.getItem('ethicom_theme') || 'dark';
  tempColors = {};

  const steps = [];
  // Step 0 Theme
  const step0 = document.createElement('div');
  step0.innerHTML = `<label for="cw_theme_select">Color Scheme:</label>
    <select id="cw_theme_select">
      <option value="dark">Dark</option>
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
  steps.push(cwBuildColorStep('Header','ethicom_header_color','--header-bg','cw_header',(c,css)=>document.documentElement.style.setProperty('--nav-bg',css)));

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
      else if (k==='ethicom_text_color') {
        document.documentElement.style.setProperty('--text-color',css);
        if (document.body) document.body.style.setProperty('--text-color',css);
      }
        else if (k==='ethicom_bg_color') {
          document.documentElement.style.setProperty('--bg-color',css);
          if (document.body) document.body.style.setProperty('--bg-color',css);
        }
      else if (k==='ethicom_module_color') document.documentElement.style.setProperty('--module-color',css);
      else if (k==='ethicom_header_color') {
        document.documentElement.style.setProperty('--header-bg',css);
        document.documentElement.style.setProperty('--nav-bg',css);
      }
    });
    overlay.remove();
  });

  steps.forEach(s=>stepWrap.appendChild(s));
  showStep(0);
}

window.openColorSettingsWizard = openColorSettingsWizard;

function openColorSettingsWizardCLI(){
  const themes=['dark','tanna-dark','tanna','transparent','ocean','desert','custom'];
  let theme=prompt('Color Scheme ('+themes.join(', ')+'):',localStorage.getItem('ethicom_theme')||'dark');
  if(theme&&themes.includes(theme)){
    localStorage.setItem('ethicom_theme',theme);
    if(typeof applyTheme==='function') applyTheme(theme);
  }

  function parse(v){return parseColor(v);} // reuse parser
  function ask(key,cssVar,label,apply){
    let def=parse(getComputedStyle(document.documentElement).getPropertyValue(cssVar));
    try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s) def=s;}catch{}
    const ans=prompt(label+' color as r,g,b',`${def.r},${def.g},${def.b}`);
    if(!ans) return;
    const m=ans.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
    if(!m){alert('Invalid format. Use r,g,b');return;}
    const c={r:Math.min(255,+m[1]),g:Math.min(255,+m[2]),b:Math.min(255,+m[3])};
    localStorage.setItem(key,JSON.stringify(c));
    const css=`rgb(${c.r},${c.g},${c.b})`;
    document.documentElement.style.setProperty(cssVar,css);
    if(cssVar==='--text-color' && document.body) document.body.style.setProperty('--text-color',css);
    if(apply) apply(c);
  }

  ask('ethicom_text_color','--text-color','Text');
  ask('ethicom_bg_color','--bg-color','Background');
  ask('ethicom_tanna_color','--primary-color','Tanna Symbol',cwApplyTanna);
  ask('ethicom_module_color','--module-color','Module');
  ask('ethicom_header_color','--header-bg','Header',c=>document.documentElement.style.setProperty('--nav-bg',`rgb(${c.r},${c.g},${c.b})`));
  alert('Colors updated');
}

window.openColorSettingsWizardCLI = openColorSettingsWizardCLI;


//----- connect.js -----
let uiText = {};

function applyTexts(){
  document.documentElement.lang = localStorage.getItem('ethicom_lang') || 'de';
  const t = uiText;
  document.querySelector('[data-ui="connect_title"]').textContent = t.connect_title || 'Connect';
  document.querySelector('[data-ui="connect_request"]').textContent = t.connect_request || 'Request connection';
  document.querySelector('[data-ui="connect_enter_sig"]').textContent = t.connect_enter_sig || 'Target signature:';
  document.querySelector('[data-ui="connect_pending"]').textContent = t.connect_pending || 'Pending requests';
  document.querySelector('[data-ui="connect_connections"]').textContent = t.connect_connections || 'Your connections';
  document.querySelectorAll('[data-ui="connect_approve"]').forEach(el=>{
    el.textContent = t.connect_approve || 'Approve';
  });
}

function init(){
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r=>r.json())
    .then(data=>{ uiText = data[lang] || data.en || {}; applyTexts(); load(); });
  document.getElementById('request_btn').addEventListener('click', sendRequest);
}

function sig(){
  try{ return JSON.parse(localStorage.getItem('ethicom_signature')||'{}'); }catch{return {};}
}

function sendRequest(){
  const target = document.getElementById('sig_input').value.trim();
  const status = document.getElementById('connect_status');
  status.textContent='';
  fetch('/api/connect/request', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ id: sig().id, target_id: target })
  })
  .then(r=>{ if(!r.ok) throw new Error('fail'); return r.json(); })
  .then(()=>{ status.textContent = uiText.connect_request_sent || 'Request sent.'; load(); })
  .catch(()=>{ status.textContent = uiText.connect_error || 'Request failed. Please check your connection.'; });
}

function approve(reqId){
  fetch('/api/connect/approve', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ id: sig().id, requester_id: reqId })
  }).then(()=> load());
}

function load(){
  const id = sig().id;
  if(!id) return;
  fetch('/api/connect/list?id='+encodeURIComponent(id))
    .then(r=>r.json())
    .then(data=>{
      const pendingList=document.getElementById('pending_list');
      const connList=document.getElementById('conn_list');
      pendingList.innerHTML='';
      connList.innerHTML='';
      data.pending.forEach(p=>{
        const li=document.createElement('li');
        li.textContent=p.requester;
        const btn=document.createElement('button');
        btn.dataset.ui='connect_approve';
        btn.addEventListener('click',()=>approve(p.requester));
        li.appendChild(btn);
        pendingList.appendChild(li);
      });
      applyTexts();
      data.connections.forEach(c=>{
        const li=document.createElement('li');
        li.textContent=`${c.id} (${c.op_level})`;
        connList.appendChild(li);
      });
    });
}

document.addEventListener('DOMContentLoaded', init);


//----- departments-loader.js -----
function loadDepartments(){
  const container = document.getElementById('departments_section');
  if(!container) return;
  fetch('sources/departments/bsvrb.json')
    .then(r => r.json())
    .then(list => {
      container.innerHTML = '';
      list.forEach(d => {
        if(d.dept_id === 'dept-qc'){
          const sec = document.createElement('section');
          sec.className = 'card';
          sec.innerHTML = `<h2>${d.title}</h2>` + (d.link ? `<p><a href="${d.link}">Details</a></p>` : '');
          container.appendChild(sec);
          return;
        }
        const details = document.createElement('details');
        details.className = 'card';
        const summary = document.createElement('summary');
        summary.innerHTML = `<a href="bsvrb-${d.dept_id}.html"><img src="${d.image}" alt="" class="inline-logo">${d.title}</a>`;
        details.appendChild(summary);
        const ul = document.createElement('ul');
        (d.points || []).forEach(p => {
          const li = document.createElement('li');
          li.textContent = p;
          ul.appendChild(li);
        });
        details.appendChild(ul);
        container.appendChild(details);
      });
    })
    .catch(() => { container.textContent = 'Konnte Abteilungen nicht laden.'; });
}

document.addEventListener('DOMContentLoaded', loadDepartments);


//----- disclaimer.js -----
function showDisclaimers(texts) {
  if (localStorage.getItem('disclaimer_accepted') === 'true') return;
  const overlay = document.createElement('div');
  overlay.id = 'disclaimer_overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.zIndex = 1000;
  const modal = document.createElement('div');
  modal.className = 'card';
  modal.style.maxWidth = '600px';
  modal.style.margin = '10% auto';
  modal.style.background = '#fff';
  modal.style.padding = '1em';
  const title = texts.disclaimer_title || 'Disclaimers';
  const items = Array.isArray(texts.disclaimer_items) ? texts.disclaimer_items : [];
  const accept = texts.btn_disclaimer_accept || 'I understand';
  modal.innerHTML = `
    <h3>${title}</h3>
    <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
    <button id="disclaimer_accept">${accept}</button>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.getElementById('disclaimer_accept').onclick = () => {
    localStorage.setItem('disclaimer_accepted', 'true');
    overlay.remove();
  };
}

if (typeof module !== 'undefined') {
  module.exports = { showDisclaimers };
}


//----- donate.js -----
let currentDonation = null;

function loadDonation() {
  try {
    const saved = localStorage.getItem('pending_donation');
    if (saved) currentDonation = JSON.parse(saved);
  } catch (err) {
    currentDonation = null;
  }
}

function updateView() {
  const output = document.getElementById('donation_output');
  if (output) output.textContent = currentDonation ? JSON.stringify(currentDonation, null, 2) : '';

  const review = document.getElementById('review_section');
  if (!review) return;

  if (!currentDonation || currentDonation.status !== 'pending') {
    review.style.display = 'none';
    return;
  }

  const current = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : null;
  const levelNum = typeof opLevelToNumber === 'function' ? opLevelToNumber(current) : 0;
  const isDonor = current && currentDonation.donorLevel && current === currentDonation.donorLevel;

  review.style.display = levelNum >= 9 && !isDonor ? 'block' : 'none';
}

function initDonation() {
  loadDonation();
  const donateBtn = document.getElementById('donate_btn');
  if (donateBtn) donateBtn.addEventListener('click', handleDonate);
  const approve = document.getElementById('approve_btn');
  if (approve) approve.addEventListener('click', approveDonation);
  const reject = document.getElementById('reject_btn');
  if (reject) reject.addEventListener('click', rejectDonation);
  updateView();
}

function handleDonate() {
  const amountInput = document.getElementById('donation_amount');
  const amount = parseFloat(amountInput.value);
  if (!amount || amount <= 0) {
    alert('Bitte gültigen Betrag eingeben.');
    return;
  }
  const donorLevel = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : 'OP-0';
  currentDonation = {
    amount,
    currency: 'CHF',
    status: 'pending',
    donorLevel
  };
  localStorage.setItem('pending_donation', JSON.stringify(currentDonation));
  updateView();
}

function approveDonation() {
  if (!currentDonation) return;
  currentDonation.status = 'accepted';
  currentDonation.verifiedBy = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : 'unknown';
  localStorage.setItem('pending_donation', JSON.stringify(currentDonation));
  updateView();
}

function rejectDonation() {
  if (!currentDonation) return;
  currentDonation.status = 'redirected';
  currentDonation.verifiedBy = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : 'unknown';
  localStorage.setItem('pending_donation', JSON.stringify(currentDonation));
  updateView();
}

if (typeof window !== 'undefined') {
  window.initDonation = initDonation;
  window.handleDonate = handleDonate;
  window.approveDonation = approveDonation;
  window.rejectDonation = rejectDonation;
}


//----- dynamic-help.js -----
const helpMap = {
  default: {
    title: 'Help – Operator Conduct',
    items: [
      'Always check if your actions meet the ethics of responsibility.',
      'Use only the tools assigned to your OP level.',
      'Document decisions in the manifest for verification.',
      'Nominations and feedback are structured and without personal pressure.',
      'Consult a higher structure (from OP-7) if unsure.',
      'Responsibility outweighs convenience.',
      'Create signatures locally and confirm them structurally.',
      'Withdrawals or corrections are part of the process, not weakness.',
      'Maintain transparency at every step, even with anonymous use.'
    ]
  },
  'OP-0': { title: 'OP-0 Tips', items: [
    'Anonymous ratings have minimal influence.',
    'Move to OP-1 to sign your evaluations. Editing stage.'
  ] },
  'OP-1': { title: 'OP-1 Tips', items: [
    'Signed evaluations store your signature ID.',
    'Explain why the chosen SRC fits. Editing stage.'
  ] },
  'OP-2': { title: 'OP-2 Tips', items: [
    'Add aspect tags to highlight angles of your evaluation.',
    'Private references stay internal only. Editing stage.'
  ] },
  'OP-3': { title: 'OP-3 Tips', items: [
    'Structured reasoning is required.',
    'Use visual selectors for SRC levels. Editing stage.'
  ] },
  'OP-4': { title: 'OP-4 Tips', items: [
    'Revisions become possible after 21 days.',
    'Your evaluation is traceable.'
  ] },
  'OP-5': { title: 'OP-5 Tips', items: [
    'You may retract previous evaluations.',
    'Explain the reason for each withdrawal.'
  ] },
  'OP-6': { title: 'OP-6 Tips', items: [
    'You can calculate consensus from anonymous ratings.'
  ] },
  'OP-7': { title: 'OP-7 Tips', items: [
    'You hold structural authority for nominations.'
  ] },
  'OP-8': { title: 'OP-8 Tips', items: [
    'Candidate stage for OP-9. OP-9+ may delegate functions.'
  ] },
  'OP-9': { title: 'OP-9 Tips', items: [
    'Nominate operators and verify donations.'
  ] },
  'OP-10': { title: 'OP-10 Tips', items: [
    'Digital candidate for Yokozuna (OP-11).'
  ] },
  'OP-11': { title: 'OP-11 Tips', items: [
    'Digital Yokozuna-level responsibilities apply.'
  ] },
  'OP-12': { title: 'OP-12 Tips', items: [
    'Fully digital, first non-human stage.'
  ] }
};

function isDevMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('dev')) return true;
  return localStorage.getItem('ethicom_dev') === 'true';
}

function buildDetails(title, items) {
  const details = document.createElement('details');
  details.open = true;
  const summary = document.createElement('summary');
  summary.textContent = title;
  details.appendChild(summary);
  const list = document.createElement('ol');
  if (Array.isArray(items) && items.length > 0) {
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No help content available.';
    list.appendChild(li);
  }
  details.appendChild(list);
  return details;
}

function setHelpSection(opLevel) {
  const section = document.getElementById('help_section');
  if (!section) return;
  section.innerHTML = '';

  if (isDevMode()) {
    Object.keys(helpMap)
      .filter(k => k !== 'default')
      .forEach(key => {
        const info = helpMap[key];
        section.appendChild(buildDetails(info.title, info.items));
      });
    return;
  }

  const data = helpMap[opLevel] || helpMap.default;
  const details = buildDetails(data.title, data.items);
  if (window.slowMode && window.slowMode.enabled) {
    const list = details.querySelector('ol');
    const items = Array.from(list.children);
    list.innerHTML = '';
    function step(i){
      if(i>=items.length) return;
      const li = items[i];
      li.textContent += ' – take a moment to reflect.';
      list.appendChild(li);
      setTimeout(() => step(i+1), 800);
    }
    step(0);
    section.appendChild(details);
  } else {
    section.appendChild(details);
  }
}

window.addEventListener('DOMContentLoaded', () => setHelpSection('default'));
window.setHelpSection = setHelpSection;


//----- dynamic-info.js -----
const infoTexts = {
  'ethicom': 'Ethicom zeigt den Ethik-Score in Prozent (100% = ethisch erstrebenswert).',
  'language-manager': 'Generate JSON snippets for new UI translations.',
  'semantic-manager': 'Generate JSON snippets for positive and negative words.',
  'op-0': 'Anonymous evaluation for visitors without a signature. No lasting influence and cannot be revised.',
  'op-0-human': 'Anonymous yes/no rating for historical figures. Stored only with OP level.',
  'op-1': 'You are submitting your first signed evaluation. It will be stored with your signature.',
  'op-1-human': 'Signed yes/no rating for historical figures. A justification is required.',
  'op-2': 'You are submitting a signed evaluation with visible SRC level and internal identity option.',
  'op-3': 'You are submitting a signed evaluation with structured reasoning and visual level selection.',
  'op-4': 'You are submitting a structured and traceable evaluation. A revision will become possible after 21 days.',
  'op-5': 'You can withdraw a previous evaluation. The original will be archived with your withdrawal reason.',
  'op-5.u': 'First DNA data released for analysis.',
  'op-6': 'You are allowed to calculate a consensus rating from anonymous evaluations.',
  'op-7': 'You are authorized to override previous evaluations if your OP-level is higher and justified.',
  'op-7.u': 'All biometric data is complete. Additional user privileges granted.',
  'op-8': 'You are in the candidate stage for OP-9; OP-9+ may delegate functions.',
  'op-8.m': 'Medical staff with limited access to health data.',
  'op-9': 'You may verify donations and confirm nominations. Every action is binding and will be logged structurally.',
  'op-9.m': 'Doctor-level access to medical data with user consent.',
  'op-10': 'You are in the candidate stage for Yokozuna (OP-11).',
  'op-11': 'Full structural autonomy. Finalize OP-10 evaluations and trigger self-sustaining loops.',
  'op-12': 'Observation only. Systems operate beyond human control.',
  'translation_challenge': 'Challenge: gather two OP signatures to confirm a language.',
  'translation_sig_count': 'Current signatures: {count}/2'
};

function getInfoText(key, data = {}) {
  let text = infoTexts[key] || '';
  for (const [k, v] of Object.entries(data)) {
    text = text.replace(new RegExp(`{${k}}`, 'g'), v);
  }
  return text;
}

function applyInfoTexts(root = document) {
  const elements = Array.from(root.querySelectorAll('[data-info]'));
  if (root.dataset && root.dataset.info) {
    elements.push(root);
  }
  elements.forEach(el => {
    const { info, ...vars } = el.dataset;
    const text = getInfoText(info, vars);
    el.textContent = text;
  });

  if (typeof isDevMode === 'function' && isDevMode()) {
    if (!document.getElementById('dev_info_box')) {
      const box = document.createElement('div');
      box.id = 'dev_info_box';
      box.className = 'card';
      box.innerHTML = '<h3>Info Texts</h3><ul>' +
        Object.entries(infoTexts)
          .map(([k, v]) => `<li><strong>${k}</strong>: ${v}</li>`)
          .join('') + '</ul>';
      document.body.prepend(box);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => applyInfoTexts());
window.applyInfoTexts = applyInfoTexts;


//----- ethicom-consensus.js -----

// ethicom-consensus.js
// Berechnet anonyme Konsensbewertung auf Basis von SRC-Level-Stimmen

function computeAnonymousConsensus(votes) {
  const srcMap = {
    "SRC-0": 0, "SRC-1": 1, "SRC-2": 2,
    "SRC-3": 3, "SRC-4": 4, "SRC-5": 5,
    "SRC-6": 6, "SRC-7": 7, "SRC-8+": 8
  };

  const reverseMap = Object.fromEntries(Object.entries(srcMap).map(([k,v]) => [v,k]));

  const values = votes.map(v => srcMap[v.src_lvl] || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const count = values.length;
  const average = count > 0 ? total / count : 0;
  const weight = +(average / 2).toFixed(2);
  const derived_level = reverseMap[Math.round(average)] || `SRC-${Math.round(average)}`;

  return {
    derived_src_level: derived_level,
    numeric_average: +average.toFixed(2),
    consensus_weight: weight,
    total_votes: count
  };
}

// Beispielverwendung:
// const result = computeAnonymousConsensus([{src_lvl: "SRC-3"}, {src_lvl: "SRC-4"}, ...]);
// console.log(result);

// Make available for Node.js tests
if (typeof module !== "undefined" && module.exports) {
  module.exports = { computeAnonymousConsensus };
}


//----- ethicom-interface.js -----
// ethicom-interface.js - simple search and cover flow for ethicom

async function initEthicom() {
  const cover = document.getElementById('cover_flow');
  const searchInput = document.getElementById('search_query');
  const results = document.getElementById('search_results');
  let scores = {};
  let sources = [];

  try {
    scores = await fetch('../references/ethik-scores.json').then(r => r.json());
  } catch {}

  try {
    const main = await fetch('../sources/institutions/src-0001.json').then(r => r.json());
    sources.push(main);
  } catch {}
  try {
    const cand = await fetch('../sources/institutions/src-candidates.json').then(r => r.json());
    sources = sources.concat(cand);
  } catch {}

  const srcMap = {
    'SRC-0': 0, 'SRC-1': 1, 'SRC-2': 2, 'SRC-3': 3,
    'SRC-4': 4, 'SRC-5': 5, 'SRC-6': 6, 'SRC-7': 7, 'SRC-8+': 8
  };

  function toPercent(level) {
    const num = typeof level === 'number' ? level : srcMap[level] || 4;
    return Math.round((num / 8) * 100);
  }

  if (cover) {
    cover.innerHTML = sources.map(s => {
      const sc = scores[s.source_id]?.score;
      const pct = toPercent(sc);
      return `<div class="cover-item"><strong>${s.title}</strong><span>${pct}%</span></div>`;
    }).join('');
  }

  function performSearch(q) {
    const query = q.toLowerCase();
    results.innerHTML = '';
    if (!query) return;
    const matches = sources.filter(s =>
      s.source_id.toLowerCase().includes(query) ||
      (s.title && s.title.toLowerCase().includes(query))
    );
    matches.forEach(s => {
      const sc = scores[s.source_id]?.score;
      const pct = toPercent(sc);
      const li = document.createElement('li');
      li.textContent = `${s.source_id}: ${s.title} – ${pct}%`;
      results.appendChild(li);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => performSearch(e.target.value));
  }
}

document.addEventListener('DOMContentLoaded', initEthicom);


//----- ethicom-utils.js -----

// ethicom-utils.js – Hilfsfunktionen für Interface-Anzeige
(function() {
  const FG_OPACITY_MAX = 65;
  function setForegroundOpacity(percent) {
    let p = parseInt(percent, 10);
    if (isNaN(p)) p = 0;
    if (p < 0) p = 0;
    if (p > FG_OPACITY_MAX) p = FG_OPACITY_MAX;
    document.documentElement.style.setProperty('--foreground-opacity', (p / 100).toString());
  }
  function applyTextColor(obj) {
    if (!obj) return;
    const css = `rgb(${obj.r},${obj.g},${obj.b})`;
    document.documentElement.style.setProperty('--text-color', css);
    if (document.body) document.body.style.setProperty('--text-color', css);
  }

  function applyStoredColors() {
    try {
      const custom = JSON.parse(localStorage.getItem('ethicom_colors') || '{}');
      if (custom && typeof custom === 'object') {
        Object.entries(custom).forEach(([name, val]) => {
          document.documentElement.style.setProperty(name, String(val));
        });
      }
    } catch {}

    try {
      const bg = JSON.parse(localStorage.getItem('ethicom_bg_color') || 'null');
      if (bg) {
        const val = `rgb(${bg.r},${bg.g},${bg.b})`;
        document.documentElement.style.setProperty('--bg-color', val);
        if (document.body) document.body.style.setProperty('--bg-color', val);
      }
    } catch {}

    try {
      const mod = JSON.parse(
        localStorage.getItem('ethicom_module_color') || 'null'
      );
      if (mod) {
        document.documentElement.style.setProperty(
          '--module-color',
          `rgb(${mod.r},${mod.g},${mod.b})`
        );
      }
    } catch {}

    try {
      const header = JSON.parse(
        localStorage.getItem('ethicom_header_color') || 'null'
      );
      if (header) {
        const css = `rgb(${header.r},${header.g},${header.b})`;
        document.documentElement.style.setProperty('--header-bg', css);
        document.documentElement.style.setProperty('--nav-bg', css);
      }
    } catch {}

    try {
      const tanna = JSON.parse(
        localStorage.getItem('ethicom_tanna_color') || 'null'
      );
      if (
        tanna &&
        (document.body.classList.contains('theme-tanna') ||
          document.body.classList.contains('theme-tanna-dark'))
      ) {
        const css = `rgb(${tanna.r},${tanna.g},${tanna.b})`;
        document.documentElement.style.setProperty('--primary-color', css);
        document.documentElement.style.setProperty('--accent-color', css);
        const h = `rgba(${Math.round(tanna.r * 0.2)},${Math.round(
          tanna.g * 0.2
        )},${Math.round(tanna.b * 0.2)},0.9)`;
        const n = `rgba(${Math.round(tanna.r * 0.3)},${Math.round(
          tanna.g * 0.3
        )},${Math.round(tanna.b * 0.3)},0.9)`;
        document.documentElement.style.setProperty('--header-bg', h);
        document.documentElement.style.setProperty('--nav-bg', n);
      }
    } catch {}
  }
  window.setForegroundOpacity = setForegroundOpacity;
  window.applyTextColor = applyTextColor;
  window.applyStoredColors = applyStoredColors;
  document.addEventListener('DOMContentLoaded', () => {
    let stored = parseInt(localStorage.getItem('ethicom_fg_opacity') || '0', 10);
    if (stored > FG_OPACITY_MAX) stored = FG_OPACITY_MAX;
    setForegroundOpacity(stored);
    try {
      const tc = JSON.parse(localStorage.getItem('ethicom_text_color') || 'null');
      if (tc) applyTextColor(tc);
    } catch {}
    applyStoredColors();
  });
  document.addEventListener('themeChanged', () => {
    try {
      const tc = JSON.parse(localStorage.getItem('ethicom_text_color') || 'null');
      if (tc) applyTextColor(tc);
    } catch {}
    applyStoredColors();
  });
  window.addEventListener('storage', e => {
    if (!e.key) return;
    const colorKeys = [
      'ethicom_colors',
      'ethicom_bg_color',
      'ethicom_module_color',
      'ethicom_tanna_color',
      'ethicom_text_color',
      'ethicom_header_color'
    ];
    if (colorKeys.includes(e.key)) {
      try {
        const tc = JSON.parse(localStorage.getItem('ethicom_text_color') || 'null');
        if (tc) applyTextColor(tc);
      } catch {}
      applyStoredColors();
    } else if (e.key === 'ethicom_theme' && typeof applyTheme === 'function') {
      applyTheme(e.newValue || 'dark');
    }
  });
})();

function getReadmePath(lang) {
  const prefix = window.location.pathname.includes('/interface/') ? '..' : '.';
  return lang === 'en'
    ? `${prefix}/README.html`
    : `${prefix}/i18n/README.${lang}.md`;
}

function renderBadge(currentRank, maxRank) {
  const badgeDisplay = document.getElementById("badge_display");
  if (!badgeDisplay) return;

  const mainSpan = document.createElement("span");
  mainSpan.className = `badge op-${currentRank.replace("OP-", "").replace(".", "")}`;
  mainSpan.textContent = currentRank;

  const lang = localStorage.getItem('ethicom_lang') || document.documentElement.lang || 'de';
  const mainLink = document.createElement("a");
  mainLink.href = `${getReadmePath(lang)}#${currentRank.toLowerCase().replace(/\./g, '-')}`;
  mainLink.appendChild(mainSpan);

  badgeDisplay.innerHTML = "";
  badgeDisplay.appendChild(mainLink);

  if (parseFloat(maxRank.replace("OP-", "")) > parseFloat(currentRank.replace("OP-", ""))) {
    const shadow = document.createElement("span");
    shadow.className = "badge shadow";
    shadow.textContent = `max: ${maxRank}`;
    badgeDisplay.appendChild(shadow);
  }
}

// Display all available badges in a gallery
function renderAllBadges() {
  const gallery = document.getElementById("badge_gallery");
  if (!gallery) return;

  const levels = [
    "OP-0",
    "OP-1",
    "OP-2",
    "OP-3",
    "OP-4",
    "OP-5",
    "OP-5.U",
    "OP-6",
    "OP-7",
    "OP-7.U",
    "OP-8",
    "OP-8.M",
    "OP-9",
    "OP-9.M",
    "OP-9.A",
    "OP-10",
    "OP-11",
    "OP-12"
  ];

  const lang = localStorage.getItem('ethicom_lang') || document.documentElement.lang || 'de';
  gallery.innerHTML = "";
  levels.forEach(lvl => {
    const span = document.createElement("span");
    span.className = `badge op-${lvl.replace("OP-", "").replace(/\./g, "")}`;
    span.textContent = lvl;
    const link = document.createElement("a");
    link.href = `${getReadmePath(lang)}#${lvl.toLowerCase().replace(/\./g, '-')}`;
    link.appendChild(span);
    gallery.appendChild(link);
  });
}

// Calculate a SHA-256 hash in both browser and Node.js environments
async function sha256(message) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(message);
    const buffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  if (typeof require !== "undefined") {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(message).digest("hex");
  }

  throw new Error("SHA-256 hashing not supported in this environment");
}

// Return HTML for a help icon with tooltip text
function help(text) {
  const safe = String(text).replace(/"/g, "&quot;");
  return `<span class="help-icon" title="${safe}">?</span>`;
}

// Use shared OP helpers
let opLevelToNumber;
let getStoredOpLevel;
if (typeof module !== 'undefined' && module.exports) {
  ({ opLevelToNumber, getStoredOpLevel } = require('../utils/op-level.js'));
} else if (typeof window !== 'undefined') {
  ({ opLevelToNumber, getStoredOpLevel } = window);
}

function showLoadingBadge(level) {
  const container = document.getElementById("loading_badge");
  if (!container) return;
  const span = container.querySelector("span");
  const lvl = level || "OP-0";
  if (span) {
    span.textContent = lvl;
    span.className = `badge op-${lvl.replace("OP-", "").replace(/\./g, "")} loading-badge`;
  }
  container.style.display = "block";
}

function hideLoadingBadge() {
  const container = document.getElementById("loading_badge");
  if (container) container.style.display = "none";
}

window.getStoredOpLevel = getStoredOpLevel;
window.opLevelToNumber = opLevelToNumber;
window.getReadmePath = getReadmePath;
window.showLoadingBadge = showLoadingBadge;
window.hideLoadingBadge = hideLoadingBadge;

// Check if user confirmed responsibility via "Sana"
function getSanaConfirmed() {
  try {
    return localStorage.getItem('sana_confirmed') === 'true';
  } catch (err) {
    return false;
  }
}

window.getSanaConfirmed = getSanaConfirmed;



//----- gatekeeper-temp.js -----
(function() {
  function checkToken() {
    const data = JSON.parse(localStorage.getItem('gate_temp_token') || 'null');
    if (!data) return;
    const now = Date.now();
    const warn = document.getElementById('temp_warning');
    if (data.expires && data.expires - now < 3600 * 1000 && warn) {
      warn.textContent = 'Gatekeeper token expires soon';
      warn.style.display = 'block';
    }
    if (data.expires && data.expires <= now) {
      localStorage.removeItem('gate_temp_token');
      if (warn) warn.style.display = 'none';
    }
  }
  document.addEventListener('DOMContentLoaded', checkToken);
})();


//----- hermes.js -----
const hermesTopics = [
  {
    name: 'Einführung',
    subtopics: [
      {
        name: 'Start',
        articles: [
          { title: 'Was ist Hermes?', file: '../sources/hermes/intro.md' }
        ]
      }
    ]
  }
];

function createTree(data) {
  const ul = document.createElement('ul');
  data.forEach(topic => {
    const li = document.createElement('li');
    li.textContent = topic.name;
    if (topic.subtopics) li.appendChild(createTree(topic.subtopics));
    if (topic.articles) {
      const aList = document.createElement('ul');
      topic.articles.forEach(a => {
        const aLi = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = a.title;
        link.href = '#';
        link.dataset.file = a.file;
        link.addEventListener('click', e => {
          e.preventDefault();
          loadArticle(a.file);
        });
        aLi.appendChild(link);
        aList.appendChild(aLi);
      });
      li.appendChild(aList);
    }
    ul.appendChild(li);
  });
  return ul;
}

async function loadArticle(file) {
  const container = document.getElementById('hermes_content');
  if (!container) return;
  container.textContent = 'Lade...';
  try {
    const md = await fetch(file).then(r => r.text());
    if (typeof renderMarkdown === 'function') {
      container.innerHTML = renderMarkdown(md);
    } else {
      container.textContent = md;
    }
  } catch {
    container.textContent = 'Inhalt konnte nicht geladen werden. Bitte Verbindung prüfen.';
  }
}

function initHermes() {
  const tree = document.getElementById('hermes_tree');
  if (tree) tree.appendChild(createTree(hermesTopics));
  loadArticle('../sources/hermes/intro.md');
}

if (typeof window !== 'undefined') window.initHermes = initHermes;


//----- interface-loader.js -----
// interface-loader.js – Lädt das passende OP-Modul ins Interface

function loadInterfaceForOP(op_level) {
  const target = document.getElementById("op_interface");
  if (!target) return;

  const normalized = op_level
    .toLowerCase()
    .replace("+", "plus")
    .replace(/[-.]/g, "");
  const moduleMap = {
    "op0": "op-0-interface.js",
    "op1": "op-1-interface.js",
    "op2": "op-2-interface.js",
    "op3": "op-3-interface.js",
    "op4": "op-4-interface.js",
    "op5": "op-5-interface.js",
    "op6": "op-6-interface.js",
    "op7": "op-7-interface.js",
    "op8": "op-8-interface.js",
    "op9": "op-9-interface.js",
    "op10": "op-10-analysis.js",
    "op11": "op-11-interface.js",
    "op12": "op-12-interface.js",
    "op0human": "op-0-human-interface.js",
    "op1human": "op-1-human-interface.js",
    "search": "source-search.js",
    "manifestviewer": "manifest-viewer.js",
    "revisionoverview": "revision-overview.js",
    "permissionsviewer": "permissions-viewer.js",
    "languagemanager": "language-manager.js",
    "semanticmanager": "semantic-manager.js",
    "translation": "op-3-translation.js",
    "chat": "chat-interface.js"
  };

  const script = document.createElement("script");
  const file = moduleMap[normalized];
  const status = document.getElementById("status");

  if (!file) {
    target.innerHTML = "<p>OP-level not recognized or unsupported.</p>";
    if (status) status.textContent = "Unknown OP level";
    if (window.hideLoadingBadge) window.hideLoadingBadge();
    return;
  }

  if (status) status.textContent = "Loading module...";
  if (window.showLoadingBadge) window.showLoadingBadge(op_level);

  script.src = `modules/${file}`;
  script.onload = () => {
    const initFunc = `init${op_level
      .replace(/[-.]/g, "")
      .replace("+", "plus")}Interface`;
    if (typeof window[initFunc] === "function") {
      window[initFunc]();
    } else if (op_level === "OP-10") {
      initOP10Analysis();
    } else if (op_level.toLowerCase() === "search") {
      initSourceSearch();
    } else if (op_level.toLowerCase() === "manifest-viewer") {
      initManifestViewer();
    } else if (op_level.toLowerCase() === "revision-overview") {
      initRevisionOverview();
    } else if (op_level.toLowerCase() === "permissions-viewer") {
      initPermissionsViewer();
    } else if (op_level.toLowerCase() === "language-manager") {
      initLanguageManager();
    } else if (op_level.toLowerCase() === "semantic-manager") {
      initSemanticManager();
    } else if (op_level.toLowerCase() === "chat") {
      initChatInterface();

    }
    if (typeof window.setHelpSection === "function") {
      window.setHelpSection(op_level);
    }
    if (["OP-0", "OP-1", "OP-2"].includes(op_level)) {
      const section = document.getElementById("help_section");
      if (section) {
        section.querySelectorAll("details").forEach(d => (d.open = true));
      }
    }
    if (status) status.textContent = "Module loaded";
    if (window.hideLoadingBadge) window.hideLoadingBadge();
  };
  document.body.appendChild(script);
}


//----- language-selector.js -----
// language-selector.js – 4789: bewusste Sprachwahl ohne Priorisierung


function askLanguageChoice() {
  const lang = prompt(
    "Please enter your preferred language code (e.g. en, de, fr, de-ch):"
  )
    ?.trim()
    .toLowerCase();

  const valid = /^[a-z]{2}(-[a-z]{2})?$/.test(lang || "");
  if (!valid) {
    alert(
      "Invalid language code. Use ISO-639-1 or a language-region code like 'de-ch'."
    );
    return null;
  }

  localStorage.setItem("ethicom_lang", lang);
  return lang;
}

function getLanguage() {
  let lang = localStorage.getItem("ethicom_lang");
  if (!lang) {
    lang = (navigator.language || "de-CH").toLowerCase();
  }
  document.documentElement.lang = lang;
  localStorage.setItem("ethicom_lang", lang);
  if (typeof updateReadmeLinks === "function") updateReadmeLinks(lang);
  return lang;
}

function getUiTextPath() {
  return window.location.pathname.includes("/interface/")
    ? "../i18n/ui-text.json"
    : "i18n/ui-text.json";
}

function updateReadmeLinks(lang) {
  const prefix = window.location.pathname.includes('/interface/') ? '..' : '.';
  const base = lang === 'en'
    ? `${prefix}/README.html`
    : `${prefix}/i18n/README.${lang}.md`;
  document.querySelectorAll('a.readme-link').forEach(a => {
    const anchor = a.getAttribute('href').split('#')[1];
    a.href = anchor ? `${base}#${anchor}` : base;
  });
}

// Initialize a language dropdown and reload on change
function initLanguageDropdown(selectId = "lang_select", textPath = getUiTextPath()) {
  fetch(textPath)
    .then(r => r.json())
    .then(texts => {
      const select = document.getElementById(selectId);
      if (!select) return;

      const base = texts.en || {};
      const keys = Object.keys(base);
      function isEmpty(v) {
        if (Array.isArray(v)) return v.length === 0 || v.every(x => !x);
        return v === undefined || v === null || v === "";
      }
      function isIncomplete(obj) {
        return keys.some(k =>
          !Object.prototype.hasOwnProperty.call(obj, k) ||
          isEmpty(obj[k]) ||
          JSON.stringify(obj[k]) === JSON.stringify(base[k])
        );
      }

      function displayLangNotice(msg) {
        let el = document.getElementById('lang_notice');
        if (!msg) {
          if (el) el.remove();
          return;
        }
        if (!el) {
          el = document.createElement('p');
          el.id = 'lang_notice';
          el.className = 'lang-notice';
          select.parentElement.appendChild(el);
        }
        el.textContent = msg;
      }

      Object.keys(texts)
        .sort()
        .forEach(code => {
          const opt = document.createElement("option");
          opt.value = code;
          const obj = texts[code] || {};
          const incomplete = keys.some(k => !Object.prototype.hasOwnProperty.call(obj, k) || isEmpty(obj[k]) || JSON.stringify(obj[k]) === JSON.stringify(base[k]));
          opt.textContent = incomplete ? `${code}*` : code;
          if (incomplete) opt.title = "Translation incomplete";
          select.appendChild(opt);
        });
      const current = getLanguage();
      select.value = current;
      function applyLanguage(lang) {
        const t = texts[lang] || texts.en || {};
        const notice = isIncomplete(t)
          ? t.translation_notice ||
            'Language not fully implemented. Contributions welcome.'
          : '';
        displayLangNotice(notice);
        if (typeof applyTexts === "function") {
          applyTexts(t);
        }
        if (typeof applySignupTexts === "function") {
          window.uiText = t;
          applySignupTexts();
        }
        if (typeof updateReadmeLinks === 'function') updateReadmeLinks(lang);
      }

      applyLanguage(current);
      select.addEventListener("change", e => {
        const lang = e.target.value.replace(/\*$/, "");
        localStorage.setItem("ethicom_lang", lang);
        applyLanguage(lang);
      });
    });
}



//----- login.js -----
let uiText = {};

function currentSuffix() {
  const now = new Date();
  now.setHours(now.getHours() + 4);
  now.setMinutes(now.getMinutes() + 44);
  const h = String(now.getHours() % 24).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return h + m;
}

function applyLoginTexts() {
  document.documentElement.lang = localStorage.getItem('ethicom_lang') || 'de';
  const t = uiText;
  const h2 = document.querySelector('[data-ui="login_title"]');
  if (h2) h2.textContent = t.login_title || h2.textContent;
  const emailLabel = document.querySelector('label[for="email_input"]');
  if (emailLabel) emailLabel.textContent = t.login_email || emailLabel.textContent;
  const pwLabel = document.querySelector('label[for="pw_input"]');
  if (pwLabel) pwLabel.textContent = t.login_password || pwLabel.textContent;
  const authLabel = document.querySelector('label[for="auth_input"]');
  if (authLabel) authLabel.textContent = t.login_auth || authLabel.textContent;
  const loginBtn = document.getElementById('login_btn');
  if (loginBtn) loginBtn.textContent = t.login_btn || loginBtn.textContent;
  const hint = document.getElementById('time_hint');
  if (hint && t.login_time_hint) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    hint.textContent = t.login_time_hint.replace('{time}', `${h}:${m}`);
  }
}

function initLogin() {
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r => r.json())
    .then(data => {
      uiText = data[lang] || data.en || {};
      applyLoginTexts();
    });
}

function handleLogin() {
  const emailInput = document.getElementById('email_input');
  const pwInput = document.getElementById('pw_input');
  const authInput = document.getElementById('auth_input');
  const statusEl = document.getElementById('login_status');
  const email = emailInput.value.trim();
  let password = pwInput.value;
  const auth = authInput.value.trim();
  statusEl.textContent = '';

  const suffix = currentSuffix();
  if (!password.endsWith(suffix)) password += suffix;

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    statusEl.textContent = uiText.login_invalid || 'Login failed. Please check your credentials.';
    return;
  }

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, auth_code: auth })
  })
    .then(r => {
      if (!r.ok) throw new Error('fail');
      return r.json();
    })
    .then(data => {
      const sig = { email, id: data.id, op_level: data.op_level, alias: data.alias };
      localStorage.setItem('ethicom_signature', JSON.stringify(sig));
      statusEl.textContent = uiText.login_saved || 'Login successful. ID stored.';
      setTimeout(() => { window.location.href = 'ethicom.html'; }, 500);
    })
    .catch(() => {
      statusEl.textContent = uiText.login_invalid || 'Login failed. Please check your credentials.';
    });
}

function startGithubLogin() {
  window.location.href = '/auth/github';
}

function startGoogleLogin() {
  window.location.href = '/auth/google';
}

window.addEventListener('DOMContentLoaded', initLogin);


//----- logo-background.js -----
function initLogoBackground() {
  const container = document.getElementById('op_background');
  if (!container) return;

  let RESTITUTION = 1;
  const storedRest = parseFloat(localStorage.getItem('ethicom_bg_restitution'));
  if (!Number.isNaN(storedRest)) RESTITUTION = storedRest;

  const MIN_VELOCITY = 0.05;

  function rgbToHue(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    let h;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    return h * 60;
  }

  function colorToHue(str) {
    const hex = str.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return rgbToHue(r, g, b);
    }
    const m = hex.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return m ? rgbToHue(+m[1], +m[2], +m[3]) : NaN;
  }

  function getThemeHueDiff() {
    let color;
    try {
      const stored = JSON.parse(localStorage.getItem('ethicom_tanna_color') || 'null');
      if (stored) color = `rgb(${stored.r},${stored.g},${stored.b})`;
    } catch {}
    if (!color) {
      const style = getComputedStyle(document.documentElement);
      color = style.getPropertyValue('--primary-color');
    }
    const h = colorToHue(color);
    return isNaN(h) ? 0 : h - 120;
  }

  function getBgHue() {
    const style = getComputedStyle(document.documentElement);
    const c = style.getPropertyValue('--bg-color');
    return colorToHue(c);
  }

  let symbolHue = parseInt(localStorage.getItem('ethicom_bg_symbol_hue') || '0', 10);
  const lowMotion = localStorage.getItem('ethicom_bg_low_motion') === 'true';

  let themeHue = getThemeHueDiff();
  let bgHue = getBgHue();
  document.addEventListener('themeChanged', () => {
    themeHue = getThemeHueDiff();
    bgHue = getBgHue();
    symbolHue = parseInt(localStorage.getItem('ethicom_bg_symbol_hue') || '0', 10);
  });

  window.addEventListener('storage', e => {
    if (!e.key) return;
    const keys = [
      'ethicom_tanna_color',
      'ethicom_bg_symbol_hue',
      'ethicom_bg_color',
      'ethicom_theme'
    ];
    if (keys.includes(e.key)) {
      themeHue = getThemeHueDiff();
      bgHue = getBgHue();
      symbolHue = parseInt(localStorage.getItem('ethicom_bg_symbol_hue') || '0', 10);
    }
  });

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const storedLevel =
    typeof getStoredOpLevel === 'function'
      ? opLevelToNumber(getStoredOpLevel())
      : 0;
  const maxStored = Number.isFinite(storedLevel) ? storedLevel : 0;
  const sameLevelCount = storedLevel >= 1
    ? Math.max(1, parseInt(localStorage.getItem('ethicom_same_level_count') || '1', 10))
    : 1;
  const levels = [];
  for (let i = 0; i <= maxStored && i <= 9; i++) {
    const reps = i === storedLevel && storedLevel >= 1 ? sameLevelCount : 1;
    for (let n = 0; n < reps; n++) levels.push(i);
  }
  if (levels.length === 0) levels.push(0);
  const maxLvl = Math.max(...levels);
  const minScale = 0.5;
  const FADE_MS = 1000;
  const imgBase = window.location.pathname.includes('/interface/')
    ? '../sources/images/op-logo/'
    : 'sources/images/op-logo/';
  const images = levels.map(lvl => {
    const img = new Image();
    const src = lvl >= 8 ? 7 : lvl;
    img.src = `${imgBase}tanna_op${src}.png`;
    return img;
  });

  const symbols = [];
  // Density of floating symbols can be customized via settings
  const storedPct = parseInt(localStorage.getItem('ethicom_bg_fill') || '40', 10);
  const fillRatio = Number.isFinite(storedPct) ? storedPct / 100 : 0.4;
  const storedSize = parseInt(localStorage.getItem('ethicom_bg_symbol_size') || '100', 10);
  const sizeScale = Number.isFinite(storedSize) ? storedSize / 100 : 1;
  const avgSize =
    levels.reduce((sum, lvl) => sum + (30 + lvl * 10 + 5) * sizeScale, 0) /
    levels.length;
  const avgArea = avgSize * avgSize;
  const maxSymbols = Math.floor(canvas.width * canvas.height / avgArea);
  const total = Math.max(20, Math.floor(maxSymbols * fillRatio));
  const collisionsEnabled = !lowMotion &&
    localStorage.getItem('ethicom_bg_collisions') !== 'false';
  for (let i = 0; i < total; i++) {
    const lvl = levels[i % levels.length];
    const img = images[lvl >= 8 ? 7 : lvl];
    const mass = lvl + 1;
    const count = lvl >= 8 ? lvl - 6 : 1;
    const hue = lvl >= 8 ? (lvl - 7) * 30 : 0;
    const size = (30 + lvl * 10 + Math.random() * 10) * sizeScale;
    const radius = size / 2;
    const subSize = size / count;
    const x = Math.random() * (canvas.width - size) + radius;
    const y = Math.random() * (canvas.height - size) + radius;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 1.5) * (lowMotion ? 0.4 : 1);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
    symbols.push({
      img,
      lvl,
      count,
      hue,
      subSize,
      mass,
      x,
      y,
      dx,
      dy,
      size,
      radius,
      rotation: 0,
      rotSpeed: 0,
      rotFrames: 0,
      alpha: 1,
      scale: 1,
      scaleDir: 0,
      fadeOut: false,
      fadeStart: 0,
      collisionCount: 0,
    });
  }

  function resolveCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;

    const nx = dx / dist;
    const ny = dy / dist;
    const relVelX = a.dx - b.dx;
    const relVelY = a.dy - b.dy;
    const relDot = relVelX * nx + relVelY * ny;
    if (relDot > 0) return;

    const m1 = a.mass;
    const m2 = b.mass;
    const impulse = (2 * relDot * RESTITUTION) / (m1 + m2);
    a.dx -= impulse * m2 * nx;
    a.dy -= impulse * m2 * ny;
    b.dx += impulse * m1 * nx;
    b.dy += impulse * m1 * ny;

    const minDist = a.radius * a.scale + b.radius * b.scale;
    const overlap = minDist - dist;
    if (overlap > 0) {
      a.x += nx * overlap * (m2 / (m1 + m2));
      a.y += ny * overlap * (m2 / (m1 + m2));
      b.x -= nx * overlap * (m1 / (m1 + m2));
      b.y -= ny * overlap * (m1 / (m1 + m2));
    }
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < symbols.length; i++) {
      const s = symbols[i];

      s.x += s.dx;
      s.y += s.dy;

      if (s.x <= s.radius * s.scale || s.x >= canvas.width - s.radius * s.scale) s.dx *= -1;
      if (s.y <= s.radius * s.scale || s.y >= canvas.height - s.radius * s.scale) s.dy *= -1;

      if (collisionsEnabled) {
        for (let j = i + 1; j < symbols.length; j++) {
          const o = symbols[j];
          const dx = s.x - o.x;
          const dy = s.y - o.y;
          const dist = Math.hypot(dx, dy);
          const minDist = s.radius * s.scale + o.radius * o.scale;
          if (dist < minDist) {
            resolveCollision(s, o);
            if (s.lvl === maxLvl) {
              s.collisionCount++;
              if (s.collisionCount % 10000 === 0) {
                const base = 0.2 + Math.random() * 0.3;
                const factor = 1 - s.lvl / (maxLvl + 1);
                s.rotSpeed = base * factor;
                s.rotFrames = 180;
                s.scaleDir = -1;
                s.fadeOut = true;
                s.fadeStart = performance.now();
                s.collisionCount = 0;
              }
            }
            if (o.lvl === maxLvl) {
              o.collisionCount++;
              if (o.collisionCount % 10000 === 0) {
                const base = 0.2 + Math.random() * 0.3;
                const factor = 1 - o.lvl / (maxLvl + 1);
                o.rotSpeed = base * factor;
                o.rotFrames = 180;
                o.scaleDir = -1;
                o.fadeOut = true;
                o.fadeStart = performance.now();
                o.collisionCount = 0;
              }
            }
            if (s.lvl < o.lvl) {
              const base = 0.2 + Math.random() * 0.3;
              const factor = 1 - s.lvl / (maxLvl + 1);
              s.rotSpeed = base * factor;
              s.rotFrames = 60;
              s.scaleDir = -1;
              s.fadeOut = true;
              s.fadeStart = performance.now();
            } else if (o.lvl < s.lvl) {
              const base = 0.2 + Math.random() * 0.3;
              const factor = 1 - o.lvl / (maxLvl + 1);
              o.rotSpeed = base * factor;
              o.rotFrames = 60;
              o.scaleDir = -1;
              o.fadeOut = true;
              o.fadeStart = performance.now();
            }
          }
        }
      }

      s.dx *= RESTITUTION;
      s.dy *= RESTITUTION;

      if (Math.hypot(s.dx, s.dy) < MIN_VELOCITY) {
        const angle = Math.random() * Math.PI * 2;
        const baseSpeed = 0.5 + Math.random() * 1.5;
        const speed = baseSpeed * (lowMotion ? 0.4 : 1);
        s.dx = Math.cos(angle) * speed;
        s.dy = Math.sin(angle) * speed;
      }

      if (s.rotFrames > 0) {
        s.rotation += s.rotSpeed;
        s.rotFrames--;
        } else {
          s.rotSpeed = 0;
        }

        if (s.scaleDir !== 0) {
          if (s.scaleDir === -1) {
            s.scale -= 0.1;
            if (s.scale <= minScale) {
              s.scale = minScale;
              s.scaleDir = s.fadeOut ? 0 : 1;
            }
          } else if (s.scaleDir === 1) {
            s.scale += 0.02;
            if (s.scale >= 1) {
              s.scale = 1;
              s.scaleDir = 0;
            }
          }
        }

        if (s.fadeOut) {
          const elapsed = performance.now() - s.fadeStart;
          if (elapsed < FADE_MS / 2) {
            s.alpha = 1 - elapsed / (FADE_MS / 2);
          } else if (elapsed < FADE_MS) {
            s.alpha = (elapsed - FADE_MS / 2) / (FADE_MS / 2);
            s.scaleDir = 1;
          } else {
            s.alpha = 1;
            s.fadeOut = false;
            s.scaleDir = 0;
          }
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        if (s.rotation) ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        const baseHue = themeHue + s.hue + symbolHue;
        let totalHue = baseHue;
        if (!isNaN(bgHue)) {
          const diff = Math.abs((baseHue - bgHue + 360) % 360);
          if (diff < 15) totalHue = (baseHue + 30) % 360;
        }
        ctx.filter = totalHue ? `hue-rotate(${totalHue}deg)` : 'none';

        const start = -s.radius * s.scale;
        for (let n = 0; n < s.count; n++) {
          const xOff = start + n * s.subSize * s.scale;
          ctx.drawImage(
            s.img,
            xOff,
            -s.subSize * s.scale / 2,
            s.subSize * s.scale,
            s.subSize * s.scale
          );
        }
        ctx.filter = 'none';
        ctx.restore();
      }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', initLogoBackground);


//----- module-arranger.js -----
function getModuleOrder(){
  try {
    return JSON.parse(localStorage.getItem('module_order') || '[]');
  } catch {
    return [];
  }
}

function setModuleOrder(order){
  localStorage.setItem('module_order', JSON.stringify(order));
}

function applyStoredModuleOrder(){
  const main = document.querySelector('main');
  if(!main) return;
  const order = getModuleOrder();
  order.forEach(id => {
    const el = document.getElementById(id);
    if(el) main.appendChild(el);
  });
}

if (typeof module !== 'undefined') {
  module.exports = { getModuleOrder, setModuleOrder, applyStoredModuleOrder };
}


//----- module-logo.js -----
// module-logo.js - insert current OP logo into page headers
// If a logo for the given OP level does not exist, the OP-0 logo is used.

function getLogoPath(opLevel) {
  const num = parseInt(String(opLevel).replace('OP-', '').split('.')[0], 10);
  const n = Number.isFinite(num) ? num : 0;
  const prefix = window.location.pathname.includes('/interface/') ||
                 window.location.pathname.includes('/wings/')
                   ? '../sources/images/op-logo/'
                   : 'sources/images/op-logo/';
  return `${prefix}tanna_op${n}.png`;
}

function insertModuleLogo() {
  const header = document.querySelector('header');
  if (!header) return;
  const custom = header.getAttribute('data-logo');
  const level = typeof getStoredOpLevel === 'function'
    ? (getStoredOpLevel() || 'OP-0')
    : 'OP-0';
  const src = getLogoPath(level);
  const fallback = src.includes('../') ? '../sources/images/op-logo/tanna_op0.png' : 'sources/images/op-logo/tanna_op0.png';
  const h1 = header.querySelector('h1');
  const size = h1 ? getComputedStyle(h1).fontSize : '1em';
  header.classList.add('with-logo');
  header.style.backgroundImage = `url('${src}')`;
  header.style.backgroundRepeat = 'no-repeat';
  header.style.backgroundPosition = '0.5em center';
  header.style.backgroundSize = `auto calc(${size} * 1.5)`;
  header.style.paddingLeft = `calc(${size} * 1.5 + 1em)`;

  // Make the OP logo area on the left clickable
  const link = document.createElement('a');
  link.className = 'op-status-link';
  const base = window.location.pathname.includes('/interface/') ||
               window.location.pathname.includes('/wings/')
                 ? '../'
                 : '';
  link.href = `${base}interface/start.html`;
  link.setAttribute('aria-label', 'OP Status');
  link.style.width = `calc(${size} * 1.5 + 1em)`;
  link.style.height = '100%';
  header.appendChild(link);

  if (!h1) return;
  const img = new Image();
  img.onerror = () => { header.style.backgroundImage = `url('${fallback}')`; };
  img.src = src;
}

if (typeof window !== 'undefined') {
  window.getLogoPath = getLogoPath;
  document.addEventListener('DOMContentLoaded', insertModuleLogo);
}


//----- navigator.js -----
function sanitize(path) {
  return path.replace(/\.{2,}/g, '').replace(/\\/g, '/');
}

async function loadExplorer(path = '') {
  const res = await fetch(`/api/explorer?path=${encodeURIComponent(path)}`);
  if (!res.ok) return;
  const entries = await res.json();
  const list = document.getElementById('file_list');
  list.innerHTML = '';
  const up = path.split('/').filter(Boolean);
  if (up.length) {
    const parent = up.slice(0, -1).join('/');
    const li = document.createElement('li');
    li.innerHTML = `<button data-path="${parent}">..</button>`;
    list.appendChild(li);
  }
  entries.forEach(e => {
    const li = document.createElement('li');
    if (e.dir) {
      li.innerHTML = `<button data-path="${sanitize(path ? path + '/' + e.name : e.name)}">${e.name}/</button>`;
    } else {
      li.textContent = e.name;
    }
    list.appendChild(li);
  });
  list.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => loadExplorer(btn.dataset.path));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadExplorer();
});

if (typeof window !== 'undefined') {
  window.loadExplorer = loadExplorer;
}


//----- offline-signup.js -----
async function storeOfflineProfile() {
  const emailEl = document.getElementById('email_input');
  const pwEl = document.getElementById('pw_input');
  const statusEl = document.getElementById('status');
  const email = emailEl.value.trim();
  const pw = pwEl.value;
  statusEl.textContent = '';

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    statusEl.textContent = 'Invalid email format.';
    return;
  }
  if (pw.length < 8) {
    statusEl.textContent = 'Password must be at least 8 characters.';
    return;
  }

  const salt = Math.random().toString(36).slice(2, 10);
  const emailHash = await sha256(email);
  const pwHash = await sha256(pw + salt);
  const created = new Date().toISOString();
  const obj = { emailHash, pwHash, salt, created };
  localStorage.setItem('ethicom_offline_user', JSON.stringify(obj));
  statusEl.textContent = 'Profile stored locally.';
}

if (typeof window !== 'undefined') {
  window.storeOfflineProfile = storeOfflineProfile;
}


//----- op-overview.js -----
function renderOpOverview() {
  const container = document.getElementById('op_overview');
  if (!container) return;

  fetch('permissions/op-permissions-expanded.json')
    .then(r => r.json())
    .then(data => {
      const levels = [
        'OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-5.U','OP-6',
        'OP-7','OP-7.U','OP-8','OP-8.M','OP-9','OP-9.M','OP-9.A',
        'OP-10','OP-11','OP-12'
      ];
      container.innerHTML = '';
      levels.forEach(level => {
        const card = document.createElement('section');
        card.className = 'card';
        const infoKey = level.toLowerCase();
        const perms = data[level] ? Object.keys(data[level]).filter(k => data[level][k]) : [];
        const list = perms.map(p => `<li>${p}</li>`).join('');
        card.innerHTML = `<h3>${level}</h3><p class="info" data-info="${infoKey}"></p>` +
          (list ? `<ul>${list}</ul>` : '<p>Keine Daten vorhanden.</p>');
        container.appendChild(card);
      });
      if (typeof applyInfoTexts === 'function') {
        applyInfoTexts(container);
      }
    })
    .catch(() => {
      container.textContent = 'Konnte OP-Daten nicht laden.';
    });
}

document.addEventListener('DOMContentLoaded', renderOpOverview);


//----- op-side-nav.js -----
function setupOpSideNav(container){
  const list = container.querySelector('#op_side_nav');
  if(!list) return;
  const levels=['OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-5.U','OP-6','OP-7','OP-7.U','OP-8','OP-8.M','OP-9','OP-9.M','OP-9.A','OP-10','OP-11','OP-12'];
  list.innerHTML = levels.map(l => `<li><button class="accent-button" data-level="${l}">${l}</button></li>`).join('');
  list.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof handleOpButton==='function') handleOpButton(btn.dataset.level);
      if(typeof toggleSideDrop==='function') toggleSideDrop();
    });
  });
}
if(typeof window!=='undefined') window.setupOpSideNav=setupOpSideNav;


//----- op-story.js -----
const levels = ['OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-6','OP-7','OP-8','OP-9','OP-10','OP-11','OP-12'];
let index = 0;

function renderSlide(){
  const level = levels[index];
  const titleEl = document.getElementById('story_title');
  if(titleEl) titleEl.textContent = level;
  const infoEl = document.getElementById('story_info');
  if(infoEl){
    infoEl.dataset.info = level.toLowerCase();
    infoEl.textContent = '';
    if(typeof applyInfoTexts==='function') applyInfoTexts(infoEl);
  }
  if(typeof setHelpSection==='function') setHelpSection(level);
  const prev = document.getElementById('prev_btn');
  const next = document.getElementById('next_btn');
  if(prev) prev.disabled = index === 0;
  if(next) next.disabled = index === levels.length - 1;
}

function nextSlide(){ if(index < levels.length - 1){ index++; renderSlide(); } }
function prevSlide(){ if(index > 0){ index--; renderSlide(); } }

window.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('prev_btn');
  const next = document.getElementById('next_btn');
  if(prev) prev.addEventListener('click', prevSlide);
  if(next) next.addEventListener('click', nextSlide);
  renderSlide();
});


//----- op0-navigation.js -----
(function(){
  function getOpLevelFromUser(obj){
    if(obj && typeof obj.op_level !== 'undefined'){ return parseInt(obj.op_level, 10); }
    return null;
  }
  function getOpLevel(){
    let lvl = getOpLevelFromUser(window.user);
    if(lvl === null && typeof getStoredOpLevel === 'function'){
      const stored = getStoredOpLevel();
      if(stored){ lvl = parseInt(String(stored).replace('OP-',''), 10); }
    }
    if(Number.isNaN(lvl)) lvl = null;
    return lvl;
  }
  function insertNav(){
    if(document.querySelector('nav')) return;
    const base = (location.pathname.includes('/interface/') || location.pathname.includes('/wings/')) ? '../' : '';
    const navHtml =
      '<nav class="op0-nav">'+
      `<a href="${base}home.html" class="icon-only" aria-label="Home">\u{1F3E0}</a>`+
      `<a href="${base}interface/settings.html" class="icon-only" aria-label="Settings">\u2699</a>`+
      `<a href="${base}interface/login.html" class="icon-only" aria-label="Login">\u{1F511}</a>`+
      `<a href="${base}interface/signup.html">Signup</a>`+
      `<a href="${base}README.html" class="icon-only readme-link" aria-label="Help">?</a>`+
      '</nav>';
    document.body.insertAdjacentHTML('afterbegin', navHtml);
  }
  document.addEventListener('DOMContentLoaded', function(){
    const level = getOpLevel();
    if(level === 0){ insertNav(); }
  });
})();


//----- op0-testmode.js -----
const storage = typeof localStorage === 'undefined'
  ? {
      data: {},
      removeItem(k) { delete this.data[k]; },
      getItem() { return undefined; },
      setItem() {}
    }
  : localStorage;

function enableOP0TestMode() {
  storage.removeItem('op0_test');
}

function disableOP0TestMode() {
  storage.removeItem('op0_test');
}

function toggleOP0TestMode() {
  disableOP0TestMode();
  if (typeof window !== 'undefined') {
    alert('OP-0 test mode disabled for security (4789).');
  }
}

function isOP0TestMode() {
  return false;
}

if (typeof module !== 'undefined') {
  module.exports = { enableOP0TestMode, disableOP0TestMode, toggleOP0TestMode, isOP0TestMode };
}

if (typeof window !== 'undefined') {
  window.toggleOP0TestMode = toggleOP0TestMode;
  window.isOP0TestMode = isOP0TestMode;
}


//----- ratings.js -----
// ratings.js - display overall ratings and rating history

async function loadConfig() {
  try {
    return await fetch('../config.json').then(r => r.json());
  } catch {
    return {};
  }
}

async function initRatings() {
  const cfg = await loadConfig();
  const baseUrl = (cfg && cfg.baseUrl) || 'http://localhost:8080';
  const summary = document.getElementById('rating_summary');
  const library = document.getElementById('rating_library');
  const categories = document.getElementById('rating_categories');
  if (!summary || !library) return;

  try {
    const index = await fetch('../manifests/index.json').then(r => r.json());
    const ratings = [];

    const candidates = await fetch('../sources/institutions/src-candidates.json').then(r => r.json()).catch(() => []);
    const candidateMap = {};
    candidates.forEach(c => { candidateMap[c.source_id] = c; });

    for (const file of index) {
      const data = await fetch(`../manifests/${file}`).then(r => r.json());
      let details = null;
      try {
        details = await fetch(`../sources/institutions/${data.source_id}.json`).then(r => r.json());
      } catch {
        details = candidateMap[data.source_id] || null;
      }
      data.category = details && details.category ? details.category : '';
      data.title = details && details.title ? details.title : data.source_id;
      data.url = details && details.url ? details.url : '';
      data.image = details && details.image ? details.image : '';
      ratings.push(data);
    }

    ratings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = 'Bewertungsverlauf';
    table.appendChild(caption);
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Zeitstempel</th><th>Quelle</th><th>Bild</th><th>Kategorie</th><th>SRC</th><th>OP</th><th>Logo</th><th>Kommentar</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    function makeOpLogo(level) {
      const base = parseInt(String(level).replace('OP-', '').split('.')[0], 10);
      const count = typeof getSignatureStrength === 'function'
        ? getSignatureStrength(level)
        : (base >= 8 ? base - 6 : 1);
      const hue = base >= 8 ? (base - 7) * 30 : 0;
      const srcNum = base >= 8 ? 7 : base;
      let html = '<span class="op-logo-group">';
      for (let i = 0; i < count; i++) {
        html += `<img class="citation-logo" src="../sources/images/op-logo/tanna_op${srcNum}.png" alt="Logo ${level}" style="filter: hue-rotate(-80deg) saturate(0.7) hue-rotate(${hue}deg);">`;
      }
      html += '</span>';
      return html;
    }

    const srcMap = {
      'SRC-0': 0, 'SRC-1': 1, 'SRC-2': 2, 'SRC-3': 3,
      'SRC-4': 4, 'SRC-5': 5, 'SRC-6': 6, 'SRC-7': 7, 'SRC-8+': 8
    };
    const reverseMap = Object.fromEntries(Object.entries(srcMap).map(([k,v]) => [v, k]));

    const perSource = {};
    const sourceInfo = {};

    const perCategory = {};

    ratings.forEach(r => {
      const row = document.createElement('tr');
      const logo = makeOpLogo(r.op_level);
      const link = r.url ? `<a href="${r.url}" target="_blank">${r.title}</a>` : r.title;
      const img = r.image ? `<img class="source-image" src="../${r.image}" alt="${r.title}">` : '';
      row.innerHTML = `<td>${r.timestamp}</td><td title="${r.source_id}">${link}</td><td>${img}</td><td>${r.category}</td><td>${r.src_lvl}</td><td>${r.op_level}</td><td>${logo}</td><td>${r.comment || ''}</td>`;
      tbody.appendChild(row);

      if (!sourceInfo[r.source_id]) sourceInfo[r.source_id] = { title: r.title, url: r.url, image: r.image };

      const num = srcMap[r.src_lvl] || 0;
      if (!perSource[r.source_id]) perSource[r.source_id] = [];
      perSource[r.source_id].push(num);
      if (!perCategory[r.category]) perCategory[r.category] = [];
      perCategory[r.category].push(num);
    });

    table.appendChild(tbody);
    library.appendChild(table);

    const searchInput = document.getElementById('rating_search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        Array.from(tbody.rows).forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }

    const list = document.createElement('ul');
    for (const [src, nums] of Object.entries(perSource)) {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const level = reverseMap[Math.round(avg)] || `SRC-${Math.round(avg)}`;
      const li = document.createElement('li');
      const info = sourceInfo[src] || { title: src, url: '' };
      if (info.url) {
        const a = document.createElement('a');
        a.href = info.url;
        a.target = '_blank';
        a.textContent = info.title;
        li.appendChild(a);
      } else {
        li.textContent = info.title;
      }
      li.appendChild(document.createTextNode(`: ${level} (ø ${avg.toFixed(2)})`));
      list.appendChild(li);
    }
    summary.appendChild(list);

    if (categories) {
      const clist = document.createElement('ul');
      for (const [cat, nums] of Object.entries(perCategory)) {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        const level = reverseMap[Math.round(avg)] || `SRC-${Math.round(avg)}`;
        const li = document.createElement('li');
        li.textContent = `${cat || 'Unbekannt'}: ${level} (ø ${avg.toFixed(2)})`;
        clist.appendChild(li);
      }
      categories.appendChild(clist);
    }
  } catch (e) {
    library.innerHTML =
      'Bibliothek konnte nicht geladen werden. ' +
      'Bitte starten Sie die Seite mit <code>npm run serve-gh</code> ' +
      `und öffnen Sie <a href="${baseUrl}/ethicom.html">${baseUrl}</a>.`;
  }
}

document.addEventListener('DOMContentLoaded', initRatings);


//----- render-markdown.js -----
function convertInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(md) {
  const lines = md.split(/\n/);
  let html = '';
  let inList = false;
  let inCode = false;
  for (let line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        html += '</code></pre>';
        inCode = false;
      } else {
        inCode = true;
        html += '<pre><code>';
      }
      continue;
    }
    if (inCode) {
      html += line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '\n';
      continue;
    }
    if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += '<li>' + convertInline(line.substring(2).trim()) + '</li>';
      continue;
    }
    if (inList) {
      html += '</ul>';
      inList = false;
    }
    let m = line.match(/^(#{1,6})\s+(.*)$/);
    if (m) {
      const level = m[1].length;
      html += `<h${level}>` + convertInline(m[2].trim()) + `</h${level}>`;
      continue;
    }
    if (line.trim() === '') {
      continue;
    }
    html += '<p>' + convertInline(line.trim()) + '</p>';
  }
  if (inList) html += '</ul>';
  if (inCode) html += '</code></pre>';
  return html;
}


//----- side-drop.js -----
// side-drop.js – simple slide-out menu for OP badge
let sideDropUrl = null;
let sideDropLoaded = false;

function initSideDrop(url) {
  const level =
    typeof getStoredOpLevel === 'function' &&
    typeof opLevelToNumber === 'function'
      ? opLevelToNumber(getStoredOpLevel())
      : 0;
  if (level < 6) return; // side drop only from OP‑6 interface

  sideDropUrl = url;
  const container = document.getElementById('side_drop');
  if (!container) return;

  container.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'side-drop-header badge-row';

  const badge = document.getElementById('badge_display');
  if (badge) {
    const badgeClone = badge.cloneNode(true);
    badgeClone.id = 'side_drop_badge';
    badgeClone.tabIndex = 0;
    badgeClone.addEventListener('click', toggleSideDrop);
    badgeClone.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSideDrop(); }
    });
    header.appendChild(badgeClone);
  }

  const closeBtn = document.createElement('button');
  closeBtn.id = 'side_close_btn';
  if (typeof uiText !== 'undefined' && uiText.side_close) {
    closeBtn.textContent = uiText.side_close;
  } else {
    closeBtn.textContent = 'Close';
  }
  closeBtn.className = 'accent-button';
  closeBtn.addEventListener('click', toggleSideDrop);
  closeBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSideDrop(); }
  });
  header.appendChild(closeBtn);

  container.appendChild(header);

  const content = document.createElement('div');
  content.id = 'side_drop_content';
  container.appendChild(content);
}

async function toggleSideDrop() {
  const container = document.getElementById('side_drop');
  if (!container) return;
  if (!sideDropLoaded && sideDropUrl) {
    try {
      const html = await fetch(sideDropUrl).then(r => r.text());
      const content = container.querySelector('#side_drop_content');
      if (content) {
        content.innerHTML = html;
        if (typeof applyTexts === 'function' && typeof uiText !== 'undefined') {
          applyTexts(uiText);
        }
        if (typeof applyInfoTexts === 'function') {
          applyInfoTexts(content);
        }
        if (typeof setupOpSideNav === 'function') {
          setupOpSideNav(content);
        }
      }
      sideDropLoaded = true;
    } catch {}
  }
  container.classList.toggle('open');
}

if (typeof window !== 'undefined') {
  window.initSideDrop = initSideDrop;
  window.toggleSideDrop = toggleSideDrop;
}


//----- signature-strength.js -----
(function(global){
  function getSignatureStrength(level) {
    const base = parseInt(String(level).replace('OP-', '').split('.')[0], 10);
    return base >= 8 ? base - 6 : 1;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSignatureStrength };
  } else {
    global.getSignatureStrength = getSignatureStrength;
  }
})(this);


//----- signature-verifier.js -----
// signature-verifier.js - verify stored signature via password

async function verifySignature(minOP = 'OP-1') {
  const stored = localStorage.getItem('ethicom_signature');
  if (!stored) {
    return { valid: false, reason: 'No local signature found.' };
  }

  let sig;
  try {
    sig = JSON.parse(stored);
  } catch {
    return { valid: false, reason: 'Signature data corrupted.' };
  }

  const required = {
    'OP-1': 4,
    'OP-2': 6,
    'OP-3': 8,
    'OP-4': 10,
    'OP-5': 12,
    'OP-6': 14,
    'OP-7': 16,
    'OP-11': 18
  };

  const minLength = required[minOP] || 6;

  if (!sig.hash || !sig.id || !sig.created) {
    return { valid: false, reason: 'Signature data incomplete.' };
  }

  const pw = prompt(`Enter your password for ${sig.id}:`);
  if (!pw || pw.length < minLength) {
    return { valid: false, reason: 'Password too short or cancelled.' };
  }

  const raw = `${sig.id}|${sig.created}|${pw}`;
  const hashed = await sha256(raw);

  if (hashed !== sig.hash) {
    return { valid: false, reason: 'Hash mismatch – invalid password.' };
  }

  return {
    valid: true,
    id: sig.id,
    level: sig.op_level,
    hash: sig.hash,
    created: sig.created
  };
}

if (typeof window !== 'undefined') {
  window.verifySignature = verifySignature;
}

if (typeof module !== 'undefined') {
  module.exports = { verifySignature };
}



//----- signup.js -----
const secureHosts = [
  'protonmail.com',
  'tutanota.com',
  'mailbox.org',
  'posteo.de'
];

const countryPhoneMap = {
  CH: '+41',
  DE: '+49',
  AT: '+43',
  US: '+1',
  FR: '+33'
};

let uiText = {};

function updatePhonePlaceholder() {
  const phoneInput = document.getElementById('phone_input');
  const countryInput = document.getElementById('country_input');
  if (!phoneInput || !countryInput) return;
  const prefix = countryPhoneMap[countryInput.value];
  if (prefix) phoneInput.placeholder = prefix + '123456789';
}

function applySignupTexts() {
  document.documentElement.lang = localStorage.getItem('ethicom_lang') || 'de';
  const t = uiText;
  const h2 = document.querySelector('[data-ui="signup_title"]');
  if (h2) h2.textContent = t.signup_title || h2.textContent;
  const emailLabel = document.querySelector('label[for="email_input"]');
  if (emailLabel) emailLabel.textContent = t.signup_email || emailLabel.textContent;
  const pwLabel = document.querySelector('label[for="pw_input"]');
  if (pwLabel) pwLabel.textContent = t.signup_password || pwLabel.textContent;
  const nickLabel = document.querySelector('label[for="nick_input"]');
  if (nickLabel) nickLabel.textContent = t.signup_nick || nickLabel.textContent;
  const signupBtn = document.getElementById('signup_btn');
  if (signupBtn) signupBtn.textContent = t.signup_btn || signupBtn.textContent;
  const emailInput = document.getElementById('email_input');
  if (emailInput && t.signup_placeholder_email) emailInput.placeholder = t.signup_placeholder_email;
  const pwInput = document.getElementById('pw_input');
  if (pwInput && t.signup_placeholder_pw) pwInput.placeholder = t.signup_placeholder_pw;
  const nickInput = document.getElementById('nick_input');
  if (nickInput && t.signup_placeholder_nick) nickInput.placeholder = t.signup_placeholder_nick;
  const addrLabel = document.querySelector('label[for="addr_input"]');
  if (addrLabel) addrLabel.textContent = t.signup_address || addrLabel.textContent;
  const addrInput = document.getElementById('addr_input');
  if (addrInput && t.signup_placeholder_address) addrInput.placeholder = t.signup_placeholder_address;
  const countryLabel = document.querySelector('label[for="country_input"]');
  if (countryLabel) countryLabel.textContent = t.signup_country || 'Country/Region:';
  const countryInput = document.getElementById('country_input');
  if (countryInput && t.signup_placeholder_country) {
    countryInput.value = t.signup_placeholder_country;
  }
  const phoneLabel = document.querySelector('label[for="phone_input"]');
  if (phoneLabel) phoneLabel.textContent = t.signup_phone || phoneLabel.textContent;
  const phoneInput = document.getElementById('phone_input');
  if (phoneInput && t.signup_placeholder_phone) phoneInput.placeholder = t.signup_placeholder_phone;
  updatePhonePlaceholder();
}

function hideNickInputIfNoob() {
  const level = getStoredOpLevel() || 'OP-1';
  const levelNum = opLevelToNumber(level);
  if (levelNum < 2) {
    const nickLabel = document.querySelector('label[for="nick_input"]');
    const nickInput = document.getElementById('nick_input');
    if (nickLabel) nickLabel.style.display = 'none';
    if (nickInput) {
      nickInput.style.display = 'none';
      nickInput.disabled = true;
    }
  }
}

function initSignup() {
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r => r.json())
    .then(data => {
      uiText = data[lang] || data.en || {};
      applySignupTexts();
      const countryInput = document.getElementById('country_input');
      if (countryInput) countryInput.addEventListener('change', updatePhonePlaceholder);
      updatePhonePlaceholder();
      hideNickInputIfNoob();
    });
}

function handleSignup() {
  const emailInput = document.getElementById('email_input');
  const pwInput = document.getElementById('pw_input');
  const addrInput = document.getElementById('addr_input');
  const phoneInput = document.getElementById('phone_input');
  const countryInput = document.getElementById('country_input');
  const nickInput = document.getElementById('nick_input');
  const statusEl = document.getElementById('signup_status');
  const email = emailInput.value.trim();
  const password = pwInput.value;
  const address = addrInput ? addrInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const country = countryInput ? countryInput.value.trim() : '';
  const nickname = nickInput ? nickInput.value.trim() : '';
  statusEl.textContent = '';

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    statusEl.textContent = uiText.signup_invalid_email || 'Invalid email format.';
    return;
  }

  const domain = email.split('@')[1].toLowerCase();
  const level = getStoredOpLevel() || 'OP-1';
  const levelNum = opLevelToNumber(level);
  if (!secureHosts.includes(domain)) {
    if (levelNum >= 6) {
      statusEl.textContent = uiText.signup_unsupported || 'Email provider not supported. Use a secure host.';
      return;
    } else {
      statusEl.textContent = uiText.signup_insecure_warn || 'Insecure email host. Allowed only until OP-5.';
    }
  }

  if (password.length < 8) {
    statusEl.textContent = uiText.signup_pw_short || 'Password must be at least 8 characters.';
    return;
  }

  fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, address, phone, country, nickname })
  })
    .then(async r => {
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || 'Signup failed. Please check the form.');
      }
      return r.json();
    })
    .then(data => {
      const nick = data.nickname || nickname;
      const sig = { email, id: data.id, op_level: 'OP-1', nickname: nick, alias: data.alias };
      localStorage.setItem('ethicom_signature', JSON.stringify(sig));
      const msgSaved = uiText.signup_saved || 'Signup complete. ID stored.';
      const msgAlias = (uiText.signup_alias || 'Alias: {alias}').replace('{alias}', data.alias);
      const msgSecret = (uiText.signup_secret || 'Authenticator secret: {secret}')
        .replace('{secret}', data.secret);
      statusEl.textContent = msgSaved + '\n' + msgAlias + '\n' + msgSecret;
    })
    .catch(err => {
      statusEl.textContent = err.message || 'Signup failed. Please check the form.';
    });
}

window.addEventListener('DOMContentLoaded', initSignup);


//----- slow-mode.js -----
(function(){
  const KEY='ethicom_slow_mode';
  function set(val){
    localStorage.setItem(KEY,val?'true':'false');
    document.body.classList.toggle('slow-mode',val);
    if(window.slowMode) window.slowMode.enabled=val;
  }
  const state=localStorage.getItem(KEY)==='true';
  window.slowMode={
    enabled:state,
    toggle(){set(!this.enabled);},
    pause(ms){return new Promise(res=>setTimeout(res,this.enabled?ms:0));}
  };
  document.addEventListener('DOMContentLoaded',()=>set(state));
})();


//----- start.js -----
const infoEl = document.getElementById('op_info');
function showInfo(key){
  if(!infoEl) return;
  infoEl.dataset.info = key;
  infoEl.textContent = '';
  if(typeof applyInfoTexts==='function') applyInfoTexts(infoEl);
}
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.op-list li').forEach(li => {
    const key = li.dataset.infoKey;
    if(!key) return;
    li.tabIndex = 0;
    li.addEventListener('click', () => showInfo(key));
    li.addEventListener('keydown', e => {
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        showInfo(key);
      }
    });
  });
});


//----- tanna-animation.js -----
function startTannaAnimation(id, fps = 4) {
  const img = document.getElementById(id);
  if (!img) return;
  const prefix = window.location.pathname.includes('/interface/') ? '../sources/images/op-logo/' : 'sources/images/op-logo/';
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


//----- theme-manager.js -----
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
  const slider = document.getElementById('theme_slider');
  const label = document.getElementById('theme_slider_label');
  const themes = ['dark','tanna-dark','tanna','transparent','ocean','desert','custom'];
  const labels = ['Dark','Dark Tanna','Tanna','Transparent','Sea Blue','Desert','Custom'];
  let theme = localStorage.getItem('ethicom_theme') || 'dark';
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
    '--accent-color': 'Accent',
    '--header-bg': 'Header',
    '--nav-bg': 'Navigation',
    '--module-color': 'Module'
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
      if (document.body && setCSS === '--text-color')
        document.body.style.setProperty('--text-color', css);
      else if (setCSS === '--bg-color' && document.body)
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
    if (document.body && setCSS === '--text-color')
      document.body.style.setProperty('--text-color', css);
    else if (setCSS === '--bg-color' && document.body)
      document.body.style.setProperty('--bg-color', css);
  } else if(setCSS.apply) setCSS.apply(c,css);
}

function resetSlidersFromTheme(){
  updateSliderSet('text_r_p','text_g_p','text_b_p','text_r_p_val','text_g_p_val','text_b_p_val','text_preview_p','ethicom_text_color','--text-color');
  updateSliderSet('bg_r','bg_g','bg_b','bg_r_val','bg_g_val','bg_b_val','bg_preview','ethicom_bg_color','--bg-color');
  updateSliderSet('tanna_r_p','tanna_g_p','tanna_b_p','tanna_r_p_val','tanna_g_p_val','tanna_b_p_val','tanna_preview_p','ethicom_tanna_color',{var:'--primary-color',apply:applyTannaCSS});
  updateSliderSet('module_r','module_g','module_b','module_r_val','module_g_val','module_b_val','module_preview','ethicom_module_color','--module-color');
  updateSliderSet('header_r','header_g','header_b','header_r_val','header_g_val','header_b_val','header_preview','ethicom_header_color','--header-bg');
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
    <option value="dark">Dark</option>
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
 </div></details>
<details class="card"><summary>Header</summary>
 <div id="header_color_pop">
  <label>R: <input type="range" id="header_r" min="0" max="255"> <span id="header_r_val"></span></label><br/>
  <label>G: <input type="range" id="header_g" min="0" max="255"> <span id="header_g_val"></span></label><br/>
  <label>B: <input type="range" id="header_b" min="0" max="255"> <span id="header_b_val"></span></label>
  <span id="header_preview" class="color-preview"></span>
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

  const themes=['dark','tanna-dark','tanna','transparent','ocean','desert','custom'];
  const labels=['Dark','Dark Tanna','Tanna','Transparent','Sea Blue','Desert','Custom'];
  const scheme=document.getElementById('theme_select_pop');
  if(scheme){
    const stored=localStorage.getItem('ethicom_theme')||'dark';
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
  initSliderSet('header_r','header_g','header_b','header_r_val','header_g_val','header_b_val','header_preview','ethicom_header_color','--header-bg');
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
  const vars=['--bg-color','--text-color','--primary-color','--accent-color','--header-bg','--nav-bg','--module-color'];
  const custom={};
  vars.forEach(v=>custom[v]=getComputedStyle(document.documentElement).getPropertyValue(v).trim());
  localStorage.setItem('ethicom_custom_theme',JSON.stringify(custom));
}

window.addEventListener('beforeunload',saveCurrentAsCustom);

function exportColorSettings(){
  const keys=['ethicom_theme','ethicom_custom_theme','ethicom_text_color','ethicom_bg_color','ethicom_tanna_color','ethicom_module_color','ethicom_header_color'];
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


//----- touch-features.js -----
// touch-features.js -- basic touch interactions for Ethicom

(function() {
  const settings = JSON.parse(localStorage.getItem('ethicom_touch') || '{}');
  const gesturesEnabled = settings.gestures !== 'false';
  const state = {
    gestures: gesturesEnabled,
    haptics: settings.haptics === 'true',
    drawing: settings.drawing === 'true',
    bigButtons: settings.bigButtons === 'true',
    longPressMenu: settings.longPressMenu === 'true'
  };

  let pointers = new Map();
  let startDist = 0;
  let baseScale = 1;
  let swipeStart = null;
  let swipeHandler = null;

  function save() {
    localStorage.setItem('ethicom_touch', JSON.stringify(state));
  }

  function vibrate(ms) {
    if (state.haptics && navigator.vibrate) navigator.vibrate(ms);
  }

  // Gestures: pinch to zoom whole body
  function pointerDown(e) {
    pointers.set(e.pointerId, e);
    swipeStart = { x: e.clientX, y: e.clientY };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      startDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      baseScale = parseFloat(document.body.style.getPropertyValue('--scale') || 1);
    }
  }

  function pointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, e);
    if (state.gestures && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const scale = baseScale * (dist / startDist);
      document.body.style.setProperty('--scale', scale);
      document.body.style.transform = `scale(${scale})`;
    }
  }

  function pointerUp(e) {
    pointers.delete(e.pointerId);
    if (swipeStart) {
      const dx = e.clientX - swipeStart.x;
      const dy = e.clientY - swipeStart.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const threshold = 30;
      if ((absX > threshold || absY > threshold) && swipeHandler) {
        let dir;
        if (absX > absY) dir = dx > 0 ? 'right' : 'left';
        else dir = dy > 0 ? 'down' : 'up';
        swipeHandler(dir);
      }
    }
    swipeStart = null;
    startDist = 0;
  }

  // Drawing overlay
  let canvas, ctx, drawing = false;
  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'drawing-overlay';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = state.drawing ? 'block' : 'none';
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    canvas.addEventListener('pointerdown', e => {
      drawing = true;
      ctx.moveTo(e.clientX, e.clientY);
      vibrate(10);
    });
    canvas.addEventListener('pointermove', e => {
      if (!drawing) return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    });
    canvas.addEventListener('pointerup', () => drawing = false);
  }

  function toggleDrawing(on) {
    state.drawing = on;
    if (canvas) canvas.style.display = on ? 'block' : 'none';
    save();
  }

  function toggleGestures(on) {
    state.gestures = on;
    if (on) {
      document.addEventListener('pointerdown', pointerDown);
      document.addEventListener('pointermove', pointerMove);
      document.addEventListener('pointerup', pointerUp);
    } else {
      document.removeEventListener('pointerdown', pointerDown);
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('pointerup', pointerUp);
    }
    save();
  }
  function toggleHaptics(on) { state.haptics = on; save(); }
  function toggleBigButtons(on) {
    state.bigButtons = on;
    document.body.classList.toggle('touch-big-buttons', on);
    save();
  }
  function toggleLongPressMenu(on) { state.longPressMenu = on; save(); }

  // Long press quick menu
  let pressTimer = null;
  function handleLongPress(e) {
    if (!state.longPressMenu) return;
    const target = e.currentTarget;
    pressTimer = setTimeout(() => {
      const txt = target.dataset.context || 'Options';
      alert(txt);
      vibrate(20);
    }, 500);
  }
  function cancelLongPress() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }

  function initLongPressElements() {
    document.querySelectorAll('[data-context]').forEach(el => {
      el.addEventListener('pointerdown', handleLongPress);
      el.addEventListener('pointerup', cancelLongPress);
      el.addEventListener('pointerleave', cancelLongPress);
    });
  }

  function registerSwipeHandler(fn) {
    swipeHandler = typeof fn === 'function' ? fn : null;
  }

  window.touchSettings = {
    toggleGestures,
    toggleHaptics,
    toggleDrawing,
    toggleBigButtons,
    toggleLongPressMenu,
    state,
    registerSwipeHandler
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (state.bigButtons) document.body.classList.add('touch-big-buttons');
    if (state.drawing) initCanvas();
    initLongPressElements();
  });
})();



//----- translation-manager.js -----
// translation-manager.js – allow users to add or confirm UI translations

let uiTexts = {}; // merged translations
let pendingLangs = JSON.parse(localStorage.getItem("ethicom_pending_langs") || "{}");

function getSignatureId() {
  try {
    const sig = JSON.parse(localStorage.getItem("ethicom_signature") || "{}");
    return sig.id || null;
  } catch (err) {
    return null;
  }
}

function loadUiTexts() {
  return fetch("../i18n/ui-text.json")
    .then(r => r.json())
    .then(data => {
      uiTexts = data;
      // merge pending translations
      Object.keys(pendingLangs).forEach(code => {
        if (pendingLangs[code] && pendingLangs[code].text) {
          uiTexts[code] = pendingLangs[code].text;
        }
      });
      return uiTexts;
    });
}

function savePendingLang(code, obj) {
  const sig = getSignatureId();
  const current = pendingLangs[code] || { text: obj, signatures: [], confirmed: false };
  current.text = obj;
  if (sig && !current.signatures.includes(sig)) {
    current.signatures.push(sig);
  }
  current.confirmed = current.signatures.length >= 2;
  pendingLangs[code] = current;
  localStorage.setItem("ethicom_pending_langs", JSON.stringify(pendingLangs));
}

function confirmPendingLang(code) {
  if (!pendingLangs[code]) return;
  const sig = getSignatureId();
  if (sig && !pendingLangs[code].signatures.includes(sig)) {
    pendingLangs[code].signatures.push(sig);
  }
  pendingLangs[code].confirmed = pendingLangs[code].signatures.length >= 2;
  localStorage.setItem("ethicom_pending_langs", JSON.stringify(pendingLangs));
}

function applyTexts(t) {
  if (!t) return;
  const lang = localStorage.getItem("ethicom_lang") || document.documentElement.lang;
  document.documentElement.lang = lang;
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = t.title || titleEl.textContent;
  const sourceLabel = document.querySelector('label[for="sig_input"]');
  if (sourceLabel) sourceLabel.textContent = t.label_source || sourceLabel.textContent;
  const passLabel = document.querySelector('label[for="sig_pass"]');
  if (passLabel) passLabel.textContent = t.signup_password || passLabel.textContent;
  const verifyBtn = document.querySelector('#signature_area button');
  if (verifyBtn) verifyBtn.textContent = t.btn_generate || verifyBtn.textContent;

  const helpTitle = document.querySelector('#help_section summary');
  if (helpTitle) helpTitle.textContent = t.help_title || helpTitle.textContent;
  const helpList = document.querySelector('#help_section ol');
  if (helpList && Array.isArray(t.help_items)) {
    helpList.innerHTML = t.help_items.map(i => `<li>${i}</li>`).join('');
  }

  const suTitle = document.querySelector('[data-ui="signup_title"]');
  if (suTitle) suTitle.textContent = t.signup_title || suTitle.textContent;
  const suEmail = document.querySelector('[data-ui="signup_email"]');
  if (suEmail) suEmail.textContent = t.signup_email || suEmail.textContent;
  const suPw = document.querySelector('[data-ui="signup_password"]');
  if (suPw) suPw.textContent = t.signup_password || suPw.textContent;
  const suBtn = document.getElementById('signup_btn');
  if (suBtn) suBtn.textContent = t.signup_btn || suBtn.textContent;
  const emailInput = document.getElementById('email_input');
  if (emailInput && t.signup_placeholder_email) emailInput.placeholder = t.signup_placeholder_email;
  const pwInput = document.getElementById('pw_input');
  if (pwInput && t.signup_placeholder_pw) pwInput.placeholder = t.signup_placeholder_pw;

  const acTitle = document.querySelector('[data-ui="access_title"]');
  if (acTitle) acTitle.textContent = t.access_title || acTitle.textContent;
  const acVision = document.querySelector('[data-ui="access_label_vision"]');
  if (acVision) acVision.textContent = t.access_label_vision || acVision.textContent;
  const acHearing = document.querySelector('[data-ui="access_label_hearing"]');
  if (acHearing) acHearing.textContent = t.access_label_hearing || acHearing.textContent;
  const acSpeech = document.querySelector('[data-ui="access_label_speech"]');
  if (acSpeech) acSpeech.textContent = t.access_label_speech || acSpeech.textContent;
  const acSave = document.getElementById('access_save');
  if (acSave) acSave.textContent = t.access_save_btn || acSave.textContent;

  document.querySelectorAll('option[data-ui="access_opt_yes"]').forEach(o => {
    if (t.access_opt_yes) o.textContent = t.access_opt_yes;
  });
  document.querySelectorAll('option[data-ui="access_opt_no"]').forEach(o => {
    if (t.access_opt_no) o.textContent = t.access_opt_no;
  });
  document.querySelectorAll('option[data-ui="access_opt_yes_nospeech"]').forEach(o => {
    if (t.access_opt_yes_nospeech) o.textContent = t.access_opt_yes_nospeech;
  });

  const navStart = document.querySelector('[data-ui="nav_start"]');
  if (navStart) navStart.textContent = t.nav_start || navStart.textContent;
  const navRatings = document.querySelector('[data-ui="nav_ratings"]');
  if (navRatings) navRatings.textContent = t.nav_ratings || navRatings.textContent;
  const navSignup = document.querySelector('[data-ui="nav_signup"]');
  if (navSignup) navSignup.textContent = t.nav_signup || navSignup.textContent;
  const navReadme = document.querySelector('[data-ui="nav_readme"]');
  if (navReadme) navReadme.textContent = t.nav_readme || navReadme.textContent;
  const navTools = document.querySelector('[data-ui="nav_tools"]');
  if (navTools) navTools.textContent = t.nav_tools || navTools.textContent;
  const navStory = document.querySelector('[data-ui="nav_story"]');
  if (navStory) navStory.textContent = t.nav_story || navStory.textContent;
  document.querySelectorAll('[data-ui="nav_settings"]').forEach(el => {
    if (el.classList.contains('icon-only')) {
      const text = t.nav_settings || el.getAttribute('title') || '';
      el.setAttribute('title', text);
      el.setAttribute('aria-label', text);
    } else {
      el.textContent = t.nav_settings || el.textContent;
    }
  });


  const chooseLabel = document.querySelector('[data-ui="choose_language_label"]');
  if (chooseLabel) chooseLabel.textContent = t.label_choose_language || chooseLabel.textContent;
}

function initTranslationManager() {
  const langSelect = document.getElementById("lang_select");
  if (!langSelect) return;
  const container = document.getElementById("lang_selection");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Add/Improve Translation";
  const challenge = document.createElement("p");
  challenge.className = "info";
  challenge.dataset.info = "translation_challenge";
  applyInfoTexts(challenge);
  container.appendChild(challenge);
  container.appendChild(editBtn);

  const op = opLevelToNumber(getStoredOpLevel());
  if (op >= 5) {
    const semanticBtn = document.createElement("button");
    semanticBtn.textContent = "New Languages Editor";
    semanticBtn.addEventListener("click", () => {
      loadInterfaceForOP("semantic-manager");
    });
    container.appendChild(semanticBtn);
  }

  editBtn.addEventListener("click", () => {
    const code = langSelect.value.trim();
    if (!code) {
      alert("Select a language code first.");
      return;
    }
    const data = uiTexts[code] || {
      title: "",
      label_source: "",
      label_srclvl: "",
      label_aspects: "",
      label_comment: "",
      btn_generate: "",
      btn_download: "",
      aspects: ["", "", "", "", ""],
      signup_title: "",
      signup_email: "",
      signup_password: "",
      signup_btn: "",
      signup_placeholder_email: "",
      signup_placeholder_pw: "",
      signup_invalid_email: "",
      signup_unsupported: "",
      signup_pw_short: "",
      signup_saved: "",
      access_title: "",
      access_label_vision: "",
      access_label_hearing: "",
      access_label_speech: "",
      access_save_btn: "",
      access_opt_yes: "",
      access_opt_no: "",
      access_opt_yes_nospeech: "",
      help_title: "",
      help_items: ["", "", "", "", "", "", "", "", "", ""]
    };
    showTranslationEditor(code, data);
  });

  checkPendingConfirmation();
}

function showTranslationEditor(code, data) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.overflow = "auto";
  overlay.style.zIndex = 1000;

  const form = document.createElement("div");
  form.className = "card";
  form.style.background = "#fff";
  form.style.color = "#000";
  const sigCount = pendingLangs[code]?.signatures?.length || 0;
  form.innerHTML = `
    <h3>Edit translation for ${code}</h3>
    <p class="info" data-info="translation_sig_count" data-count="${sigCount}"></p>
    <label>Title:<br><input id="tr_title" value="${data.title || ""}"></label><br>
    <label>Label Source:<br><input id="tr_src" value="${data.label_source || ""}"></label><br>
    <label>Label SRCLvl:<br><input id="tr_srclvl" value="${data.label_srclvl || ""}"></label><br>
    <label>Label Aspects:<br><input id="tr_aspects" value="${data.label_aspects || ""}"></label><br>
    <label>Label Comment:<br><input id="tr_comment" value="${data.label_comment || ""}"></label><br>
    <label>Button Generate:<br><input id="tr_generate" value="${data.btn_generate || ""}"></label><br>
    <label>Button Download:<br><input id="tr_download" value="${data.btn_download || ""}"></label><br>
    <label>Aspects (comma separated):<br><input id="tr_aspectlist" value="${(data.aspects || []).join(", ")}"></label><br>
    <h4>Signup</h4>
    <label>Title:<br><input id="tr_su_title" value="${data.signup_title || ""}"></label><br>
    <label>Email Label:<br><input id="tr_su_email" value="${data.signup_email || ""}"></label><br>
    <label>Password Label:<br><input id="tr_su_pw" value="${data.signup_password || ""}"></label><br>
    <label>Button Text:<br><input id="tr_su_btn" value="${data.signup_btn || ""}"></label><br>
    <label>Email Placeholder:<br><input id="tr_su_ph_email" value="${data.signup_placeholder_email || ""}"></label><br>
    <label>Password Placeholder:<br><input id="tr_su_ph_pw" value="${data.signup_placeholder_pw || ""}"></label><br>
    <label>Msg Invalid Email:<br><input id="tr_su_invalid" value="${data.signup_invalid_email || ""}"></label><br>
    <label>Msg Unsupported:<br><input id="tr_su_unsupported" value="${data.signup_unsupported || ""}"></label><br>
    <label>Msg Short Password:<br><input id="tr_su_pwshort" value="${data.signup_pw_short || ""}"></label><br>
    <label>Msg Saved:<br><input id="tr_su_saved" value="${data.signup_saved || ""}"></label><br>
    <h4>Accessibility</h4>
    <label>Title:<br><input id="tr_ac_title" value="${data.access_title || ""}"></label><br>
    <label>Label Vision:<br><input id="tr_ac_vision" value="${data.access_label_vision || ""}"></label><br>
    <label>Label Hearing:<br><input id="tr_ac_hearing" value="${data.access_label_hearing || ""}"></label><br>
    <label>Label Speech:<br><input id="tr_ac_speech" value="${data.access_label_speech || ""}"></label><br>
    <label>Button Text:<br><input id="tr_ac_save" value="${data.access_save_btn || ""}"></label><br>
    <label>Opt Yes:<br><input id="tr_ac_yes" value="${data.access_opt_yes || ""}"></label><br>
    <label>Opt No:<br><input id="tr_ac_no" value="${data.access_opt_no || ""}"></label><br>
    <label>Opt Hear+NoSpeak:<br><input id="tr_ac_yes_nospeech" value="${data.access_opt_yes_nospeech || ""}"></label><br>
    <h4>Help Section</h4>
    <label>Help Title:<br><input id="tr_help_title" value="${data.help_title || ""}"></label><br>
    <label>Help Items (comma separated):<br><input id="tr_help_items" value="${(data.help_items || []).join(', ')}"></label><br>
    <button id="tr_save">Save</button>
    <button id="tr_cancel">Cancel</button>
  `;
  overlay.appendChild(form);
  applyInfoTexts(form);
  document.body.appendChild(overlay);

  document.getElementById("tr_cancel").addEventListener("click", () => overlay.remove());
  document.getElementById("tr_save").addEventListener("click", () => {
    const obj = {
      title: document.getElementById("tr_title").value,
      label_source: document.getElementById("tr_src").value,
      label_srclvl: document.getElementById("tr_srclvl").value,
      label_aspects: document.getElementById("tr_aspects").value,
      label_comment: document.getElementById("tr_comment").value,
      btn_generate: document.getElementById("tr_generate").value,
      btn_download: document.getElementById("tr_download").value,
      aspects: document.getElementById("tr_aspectlist").value.split(/,\s*/),
      signup_title: document.getElementById("tr_su_title").value,
      signup_email: document.getElementById("tr_su_email").value,
      signup_password: document.getElementById("tr_su_pw").value,
      signup_btn: document.getElementById("tr_su_btn").value,
      signup_placeholder_email: document.getElementById("tr_su_ph_email").value,
      signup_placeholder_pw: document.getElementById("tr_su_ph_pw").value,
      signup_invalid_email: document.getElementById("tr_su_invalid").value,
      signup_unsupported: document.getElementById("tr_su_unsupported").value,
      signup_pw_short: document.getElementById("tr_su_pwshort").value,
      signup_saved: document.getElementById("tr_su_saved").value,
      access_title: document.getElementById("tr_ac_title").value,
      access_label_vision: document.getElementById("tr_ac_vision").value,
      access_label_hearing: document.getElementById("tr_ac_hearing").value,
      access_label_speech: document.getElementById("tr_ac_speech").value,
      access_save_btn: document.getElementById("tr_ac_save").value,
      access_opt_yes: document.getElementById("tr_ac_yes").value,
      access_opt_no: document.getElementById("tr_ac_no").value,
      access_opt_yes_nospeech: document.getElementById("tr_ac_yes_nospeech").value,
      help_title: document.getElementById("tr_help_title").value,
      help_items: document.getElementById("tr_help_items").value.split(/,\s*/)
    };
    savePendingLang(code, obj);
    uiTexts[code] = obj;
    overlay.remove();
    applyTexts(obj);
    alert("Translation saved locally. Another user with this language can confirm it.");
  });
}

function checkPendingConfirmation() {
  const lang = localStorage.getItem("ethicom_lang");
  if (lang && pendingLangs[lang] && !pendingLangs[lang].confirmed) {
    const needed = 2 - (pendingLangs[lang].signatures?.length || 0);
    const box = document.createElement("div");
    box.className = "card";
    box.innerHTML = `
      <p>Unconfirmed translation for ${lang} found. ${needed} more confirmation(s) required.</p>
      <button id="tr_yes">Confirm</button>
      <button id="tr_edit">Edit</button>
    `;
    document.body.insertBefore(box, document.body.firstChild);
    document.getElementById("tr_yes").addEventListener("click", () => {
      confirmPendingLang(lang);
      box.remove();
    });
    document.getElementById("tr_edit").addEventListener("click", () => {
      box.remove();
      showTranslationEditor(lang, pendingLangs[lang].text);
    });
  }
}


//----- user-registers.js -----
window.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('last_page', location.pathname.replace(/^\//, ''));
  const token = localStorage.getItem('jwt');
  if(!token) return;

  const existing = document.getElementById('user_registers');
  if (existing) existing.remove();

  const modules = [
    { name: 'Bewertung', href: 'bewertung.html' },
    { name: 'Ethicom', href: 'interface/ethicom.html' },
    { name: 'Fish', href: 'interface/fish.html' }
  ];

  const aside = document.createElement('nav');
  aside.id = 'user_registers';
  aside.className = 'side-registers';

  const base = location.pathname.includes('/interface/') || location.pathname.includes('/wings/') ? '../' : '';
  aside.innerHTML = modules.map(m => `<a href="${base}${m.href}">${m.name}</a>`).join('');
  document.body.prepend(aside);

  const info = document.getElementById('user_info');
  if (info) {
    try {
      const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
      const name = sig.nickname || sig.alias || sig.email || 'User';
      const last = localStorage.getItem('last_page') || '';
      info.textContent = `${name} – letzte Seite: ${last}`;
    } catch {}
  }
});

