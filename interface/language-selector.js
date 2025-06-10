// language-selector.js – 4789: bewusste Sprachwahl ohne Priorisierung

// Minimal English texts for offline OP-0 use
const offlineUiText = {
  "en": {
    "title": "Ethicom: Human Evaluation",
    "label_source": "Source (URL or Title)",
    "label_srclvl": "Ethical Level (SRC)",
    "label_aspects": "Optional Aspects",
    "label_comment": "Comment",
    "btn_generate": "Show My Evaluation",
    "btn_download": "Download as File",
    "aspects": [
      "Transparency",
      "Repairability",
      "System Reflection",
      "Error Handling",
      "Purpose Clarity"
    ],
    "signup_title": "Sign up",
    "signup_email": "Email:",
    "signup_password": "Password:",
    "signup_btn": "Create Account",
    "signup_placeholder_email": "name@provider.com",
    "signup_placeholder_pw": "At least 8 characters",
    "signup_address": "Address:",
    "signup_phone": "Phone:",
    "signup_nick": "Nickname:",
    "signup_placeholder_nick": "Optional nickname",
    "signup_alias": "Alias (public): {alias}",
    "signup_placeholder_address": "Optional address",
    "signup_placeholder_phone": "+12025550123",
    "signup_country": "Country/Region:",
    "signup_placeholder_country": "US",
    "signup_invalid_email": "Invalid email format.",
    "signup_unsupported": "Email provider not supported. Use a secure host.",
    "signup_insecure_warn": "Insecure email host. Allowed only until OP-5.",
    "signup_pw_short": "Password must be at least 8 characters.",
    "signup_saved": "Signup complete. ID stored.",
    "signup_secret": "Authenticator secret: {secret}",
    "help_title": "Help – Operator Conduct",
    "help_items": [
      "Always check if your actions meet the ethics of responsibility.",
      "Use only the tools assigned to your OP level.",
      "Document decisions in the manifest for verification.",
      "Nominations and feedback are structured and without personal pressure.",
      "Consult a higher structure (from OP-7) if unsure.",
      "Responsibility outweighs convenience.",
      "Create signatures locally and confirm them structurally.",
      "Withdrawals or corrections are part of the process, not weakness.",
      "Maintain transparency at every step, even with anonymous use."
    ],
    "access_title": "Accessibility Setup",
    "access_label_vision": "Can you see the screen?",
    "access_label_hearing": "Can you hear from this device?",
    "access_label_speech": "Can you speak?",
    "access_label_simple": "Simplified interface?",
    "access_opt_yes": "Yes",
    "access_save_btn": "Save Setup",
    "access_opt_no": "No",
    "access_opt_yes_nospeech": "Yes, but cannot speak",
    "access_saved": "Accessibility preferences saved.",
    "nav_start": "Start",
    "nav_ratings": "Ratings",
    "nav_signup": "Signup",
    "nav_readme": "README",
    "nav_tools": "Tools",
    "nav_settings": "Settings",
    "label_choose_language": "Choose your language (ISO 639-1):",
    "status_verifying_sig": "Verifying signature...",
    "status_sig_missing": "Signature not found or incomplete.",
    "status_sig_invalid": "Signature invalid or password incorrect.",
    "status_sig_valid": "Signature valid: {level}",
    "status_loading_op0": "Loading OP-0...",
    "rating_yes": "Yes",
    "rating_partial": "Partly",
    "rating_no": "No",
    "simple_toggle_label": "Toggle Simple Mode",
    "simple_mode_on": "Simple mode is active.",
    "simple_mode_off": "Simple mode is off.",
    "disclaimer_title": "Disclaimers",
    "disclaimer_items": [
      "This structure is provided without warranty.",
      "Use is at your own risk.",
      "The operators and contributors accept no liability; BSVRB is an association under Swiss law (Swiss Civil Code art. 60 ff.: https://www.fedlex.admin.ch/eli/cc/24/233_245_233/en).",
      "4789 is a standard for responsibility, not a person or belief system.",
      "Use only with reflection and consequence; no manipulation or uncontrolled automation.",
      "If a contradiction arises, apply self-reflection (structure_9874).",
      "Humor is allowed if responsibility and clarity remain.",
      "Each user’s TOTP secret is stored as plain text."
    ],
    "btn_disclaimer_accept": "I understand",
    "attention_toggle_wiggle": "Wiggle when idle",
    "attention_toggle_beep": "Beep when idle",
    "side_close": "Close",
    "side_menu_need_op6": "OP-6 required.",
    "rating_saved": "Rating saved.",
    "login_title": "Login",
    "login_email": "Email:",
    "login_password": "Password:",
    "login_time_hint": "Current time: {time}",
    "login_auth": "Authenticator code:",
    "login_btn": "Log in",
    "login_github": "Login with GitHub",
    "login_google": "Login with Google",
    "login_invalid": "Login failed.",
    "login_saved": "Login successful. ID stored.",
    "connect_title": "Connect",
    "connect_request": "Request connection",
    "connect_enter_sig": "Target signature:",
    "connect_pending": "Pending requests",
    "connect_connections": "Your connections",
    "connect_approve": "Approve",
    "connect_request_sent": "Request sent.",
    "connect_error": "Request failed.",
    "nav_navigator": "Navigator Menu",
    "nav_story": "Story"
  }
};

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
      const texts = typeof offlineUiText !== 'undefined' ? offlineUiText : null;
      if (texts) {
        const select = document.getElementById(selectId);
        if (select) {
          select.innerHTML = Object.keys(texts)
            .sort()
            .map(c => `<option value="${c}">${c}</option>`)
            .join('');
          select.value = 'en';
        }
        localStorage.setItem('ethicom_lang', 'en');
        if (typeof applyTexts === 'function') applyTexts(texts.en || {});
        if (typeof updateReadmeLinks === 'function') updateReadmeLinks('en');
      } else {
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
      }
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

