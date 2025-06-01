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
    statusEl.textContent = uiText.login_invalid || 'Login failed.';
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
      statusEl.textContent = uiText.login_invalid || 'Login failed.';
    });
}

function startGithubLogin() {
  window.location.href = '/auth/github';
}

function startGoogleLogin() {
  window.location.href = '/auth/google';
}

window.addEventListener('DOMContentLoaded', initLogin);
