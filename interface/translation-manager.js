// translation-manager.js – allow users to add or confirm UI translations

let uiTexts = {}; // merged translations
let pendingLangs = JSON.parse(localStorage.getItem("ethicom_pending_langs") || "{}");

function loadUiTexts() {
  return fetch("i18n/ui-text.json")
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
  pendingLangs[code] = { text: obj, confirmed: false };
  localStorage.setItem("ethicom_pending_langs", JSON.stringify(pendingLangs));
}

function confirmPendingLang(code) {
  if (pendingLangs[code]) {
    pendingLangs[code].confirmed = true;
    localStorage.setItem("ethicom_pending_langs", JSON.stringify(pendingLangs));
  }
}

function applyTexts(t) {
  if (!t) return;
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = t.title || titleEl.textContent;
  const sourceLabel = document.querySelector('label[for="sig_input"]');
  if (sourceLabel) sourceLabel.textContent = t.label_source || sourceLabel.textContent;
  const commentLabel = document.querySelector('label[for="sig_pass"]');
  if (commentLabel) commentLabel.textContent = t.label_comment || commentLabel.textContent;
  const verifyBtn = document.querySelector('#signature_area button');
  if (verifyBtn) verifyBtn.textContent = t.btn_generate || verifyBtn.textContent;
}

function initTranslationManager() {
  const langSelect = document.getElementById("lang_select");
  if (!langSelect) return;
  const container = document.getElementById("lang_selection");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Add/Improve Translation";
  container.appendChild(editBtn);

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
      aspects: ["", "", "", "", ""]
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
  form.innerHTML = `
    <h3>Edit translation for ${code}</h3>
    <label>Title:<br><input id="tr_title" value="${data.title || ""}"></label><br>
    <label>Label Source:<br><input id="tr_src" value="${data.label_source || ""}"></label><br>
    <label>Label SRCLvl:<br><input id="tr_srclvl" value="${data.label_srclvl || ""}"></label><br>
    <label>Label Aspects:<br><input id="tr_aspects" value="${data.label_aspects || ""}"></label><br>
    <label>Label Comment:<br><input id="tr_comment" value="${data.label_comment || ""}"></label><br>
    <label>Button Generate:<br><input id="tr_generate" value="${data.btn_generate || ""}"></label><br>
    <label>Button Download:<br><input id="tr_download" value="${data.btn_download || ""}"></label><br>
    <label>Aspects (comma separated):<br><input id="tr_aspectlist" value="${(data.aspects || []).join(", ")}"></label><br>
    <button id="tr_save">Save</button>
    <button id="tr_cancel">Cancel</button>
  `;
  overlay.appendChild(form);
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
      aspects: document.getElementById("tr_aspectlist").value.split(/,\s*/)
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
    const box = document.createElement("div");
    box.className = "card";
    box.innerHTML = `
      <p>Unconfirmed translation for ${lang} found. Confirm?</p>
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
