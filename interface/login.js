let uiText = {};

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
  const formalityLabel = document.querySelector('label[for="formality_select"]');
  if (formalityLabel) {
    const lang = document.documentElement.lang || 'de';
    if (lang.startsWith('de')) formalityLabel.textContent = 'Ansprache:';
    else formalityLabel.textContent = 'Address formality:';
  }
  const humorLabel = document.querySelector('label[for="humor_toggle"]');
  if (humorLabel) humorLabel.textContent = t.humor_toggle_label || humorLabel.textContent;
}

function makeWelcome(name, formality, humor) {
  const lang = document.documentElement.lang || 'de';
  if (lang.startsWith('de')) {
    if (formality === 'sie') return `Sch\u00f6n, dass Sie wieder da sind, ${name}.`;
    if (formality === 'neutral') return `Willkommen zur\u00fcck, ${name}.`;
    let msg = `Sch\u00f6n, dass du wieder da bist, ${name}.`;
    if (humor) msg += ' \u263A';
    return msg;
  }
  let msg = (uiText.login_welcome || 'Welcome back, {name}.').replace('{name}', name);
  if (humor) msg += ' \u263A';
  return msg;
}

function initLogin() {
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r => r.json())
    .then(data => {
      uiText = data[lang] || data.en || {};
      applyLoginTexts();
      loadProfile();
    });
}

function loadProfile() {
  fetch('/api/profile')
    .then(r => r.json())
    .then(p => {
      if (p.lang) {
        localStorage.setItem('ethicom_lang', p.lang);
      }
      const sel = document.getElementById('formality_select');
      if (sel && p.formality) sel.value = p.formality;
      const humorBox = document.getElementById('humor_toggle');
      if (humorBox) humorBox.checked = !!p.humor;
      if (p.alias) {
        const statusEl = document.getElementById('login_status');
        statusEl.textContent = makeWelcome(p.alias, p.formality, p.humor);
      }
    })
    .catch(() => {});
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

  if (password.length < 8) {
    statusEl.textContent = 'Password must be at least 8 characters.';
    return;
  }

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
      const formality = document.getElementById('formality_select')?.value || 'du';
      const humor = document.getElementById('humor_toggle')?.checked || false;
      fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias: data.alias, lang: getLanguage(), formality, humor })
      }).catch(() => {});
      statusEl.textContent = uiText.login_saved || 'Login successful. ID stored.';
      setTimeout(() => { window.location.href = 'ethicom.html'; }, 500);
    })
    .catch(() => {
      statusEl.textContent =
        uiText.login_invalid ||
        'Login failed. Check email, password and authenticator code.';
    });
}

function startGithubLogin() {
  window.location.href = '/auth/github';
}

function startGoogleLogin() {
  window.location.href = '/auth/google';
}

window.addEventListener('DOMContentLoaded', initLogin);
