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
  return stored || askLanguageChoice();
}

// Initialize a language dropdown and reload on change
function initLanguageDropdown(selectId = "lang_select") {
  fetch("../i18n/ui-text.json")
    .then(r => r.json())
    .then(texts => {
      const select = document.getElementById(selectId);
      if (!select) return;
      Object.keys(texts)
        .sort()
        .forEach(code => {
          const opt = document.createElement("option");
          opt.value = code;
          opt.textContent = code;
          select.appendChild(opt);
        });
      const current = getLanguage();
      select.value = current;
      select.addEventListener("change", e => {
        localStorage.setItem("ethicom_lang", e.target.value);
        location.reload();
      });
    });
}
