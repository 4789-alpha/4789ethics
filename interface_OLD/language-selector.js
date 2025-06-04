// language-selector.js – 4789: bewusste Sprachwahl ohne Priorisierung

function askLanguageChoice() {
  const lang = prompt("Please enter your preferred language code (e.g. en, de, fr, sw, hi, ar…):")
    ?.trim()
    .toLowerCase();

  if (!lang || lang.length !== 2) {
    alert("Invalid language code. Please enter a valid ISO-639-1 code (e.g. 'en', 'fr', 'sw').");
    return null;
  }

  localStorage.setItem("ethicom_lang", lang);
  return lang;
}

function getLanguage() {
  const stored = localStorage.getItem("ethicom_lang");
  const lang = stored || "de";
  if (lang) {
    document.documentElement.lang = lang;
    localStorage.setItem("ethicom_lang", lang);
  }
  if (typeof updateReadmeLinks === 'function') updateReadmeLinks(lang);
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
    : `${prefix}/i18n/README.${lang}.html`;
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
      select.addEventListener("change", e => {
        const lang = e.target.value.replace(/\*$/, "");
        localStorage.setItem("ethicom_lang", lang);
        const t = texts[lang] || texts.en || {};
        if (typeof applyTexts === "function") {
          applyTexts(t);
        }
        if (typeof applySignupTexts === "function") {
          window.uiText = t;
          applySignupTexts();
        }
        if (typeof updateReadmeLinks === 'function') updateReadmeLinks(lang);
      });
    });
}

