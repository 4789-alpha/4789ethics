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
  const commentLabel = document.querySelector('label[for="sig_pass"]');
  if (commentLabel) commentLabel.textContent = t.label_comment || commentLabel.textContent;
  const verifyBtn = document.querySelector('#signature_area button');
  if (verifyBtn) verifyBtn.textContent = t.btn_generate || verifyBtn.textContent;

  if (typeof window.setHelpSection !== 'function') {
    const helpTitle = document.querySelector('#help_section summary');
    if (helpTitle) helpTitle.textContent = t.help_title || helpTitle.textContent;
    const helpList = document.querySelector('#help_section ol');
    if (helpList && Array.isArray(t.help_items)) {
      helpList.innerHTML = t.help_items.map(i => `<li>${i}</li>`).join('');
    }
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

  const previewMsg = document.querySelector('[data-ui="preview_msg"]');
  if (previewMsg) previewMsg.textContent = t.preview_msg || previewMsg.textContent;
  const previewBtn = document.querySelector('[data-ui="preview_btn"]');
  if (previewBtn) previewBtn.textContent = t.preview_btn || previewBtn.textContent;

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
