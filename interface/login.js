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
