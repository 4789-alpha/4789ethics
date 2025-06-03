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

function showLanguageSetup() {
  if (document.getElementById('language_setup_overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'language_setup_overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.zIndex = 1000;
  const modal = document.createElement('div');
  modal.className = 'card';
  modal.style.maxWidth = '400px';
  modal.style.margin = '10% auto';
  modal.style.background = '#fff';
  modal.style.padding = '1em';
  modal.innerHTML = `
    <label for="lang_setup_select">Language:</label>
    <select id="lang_setup_select"></select>
    <button id="lang_setup_save">OK</button>
    <p style="font-size:0.8em;">Change later in Settings.</p>`;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  initLanguageDropdown('lang_setup_select');
  document.getElementById('lang_setup_save').addEventListener('click', () => {
    const select = document.getElementById('lang_setup_select');
    const lang = select.value.replace(/\*$/, '');
    localStorage.setItem('ethicom_lang', lang);
    document.documentElement.lang = lang;
    if (typeof updateReadmeLinks === 'function') updateReadmeLinks(lang);
    overlay.remove();
    if (typeof applyTexts === 'function' || typeof applySignupTexts === 'function') {
      fetch(getUiTextPath())
        .then(r => r.json())
        .then(texts => {
          const t = texts[lang] || texts.en || {};
          if (typeof applyTexts === 'function') applyTexts(t);
          if (typeof applySignupTexts === 'function') { window.uiText = t; applySignupTexts(); }
        });
    }
  });
}

function checkLanguageSetup() {
  if (!localStorage.getItem('ethicom_lang')) showLanguageSetup();
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

