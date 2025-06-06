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
  return window.location.pathname.includes('/interface/') ||
    window.location.pathname.includes('/wings/')
    ? '../i18n/ui-text.json'
    : 'i18n/ui-text.json';
}

function updateReadmeLinks(lang) {
  const prefix = window.location.pathname.includes('/interface/') ||
    window.location.pathname.includes('/wings/') ? '..' : '.';
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
    })
    .catch(() => {
      displayLangNotice(
        'Start the interface with `node tools/serve-interface.js`. Then open `http://localhost:8080/ethicom.html` in your browser. Opening the HTML file directly (e.g. via `file://`) bypasses the local server and causes the language list to remain empty. Always access the interface through the provided `localhost` address so that translation files load correctly.'
      );
      const select = document.getElementById(selectId);
      if (select) {
        select.innerHTML = '<option value="en">en</option>';
        select.value = 'en';
      }
      localStorage.setItem('ethicom_lang', 'en');
      if (typeof applyTexts === 'function') applyTexts({});
      if (typeof updateReadmeLinks === 'function') updateReadmeLinks('en');
    });
}

// Ensure a language is set and supported
function checkLanguageSetup() {
  let lang =
    localStorage.getItem("ethicom_lang") ||
    (navigator.language || "de-CH").toLowerCase();
  if (!/^[a-z]{2}(?:-[a-z]{2})?$/.test(lang)) {
    lang = askLanguageChoice() || "de-ch";
  }
  document.documentElement.lang = lang;
  localStorage.setItem("ethicom_lang", lang);
  if (typeof updateReadmeLinks === "function") updateReadmeLinks(lang);
}

