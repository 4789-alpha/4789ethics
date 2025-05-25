const secureHosts = [
  'protonmail.com',
  'tutanota.com',
  'mailbox.org',
  'posteo.de'
];

let uiText = {};

function applySignupTexts() {
  document.documentElement.lang = localStorage.getItem('ethicom_lang') || 'de';
  const t = uiText;
  const h2 = document.querySelector('[data-ui="signup_title"]');
  if (h2) h2.textContent = t.signup_title || h2.textContent;
  const emailLabel = document.querySelector('label[for="email_input"]');
  if (emailLabel) emailLabel.textContent = t.signup_email || emailLabel.textContent;
  const pwLabel = document.querySelector('label[for="pw_input"]');
  if (pwLabel) pwLabel.textContent = t.signup_password || pwLabel.textContent;
  const signupBtn = document.getElementById('signup_btn');
  if (signupBtn) signupBtn.textContent = t.signup_btn || signupBtn.textContent;
  const emailInput = document.getElementById('email_input');
  if (emailInput && t.signup_placeholder_email) emailInput.placeholder = t.signup_placeholder_email;
  const pwInput = document.getElementById('pw_input');
  if (pwInput && t.signup_placeholder_pw) pwInput.placeholder = t.signup_placeholder_pw;
}

function initSignup() {
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r => r.json())
    .then(data => {
      uiText = data[lang] || data.en || {};
      applySignupTexts();
    });
}

function handleSignup() {
  const emailInput = document.getElementById('email_input');
  const pwInput = document.getElementById('pw_input');
  const statusEl = document.getElementById('signup_status');
  const email = emailInput.value.trim();
  const password = pwInput.value;
  statusEl.textContent = '';

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    statusEl.textContent = uiText.signup_invalid_email || 'Invalid email format.';
    return;
  }

  const domain = email.split('@')[1].toLowerCase();
  const level = getStoredOpLevel() || 'OP-1';
  const levelNum = opLevelToNumber(level);
  if (!secureHosts.includes(domain)) {
    if (levelNum >= 6) {
      statusEl.textContent = uiText.signup_unsupported || 'Email provider not supported. Use a secure host.';
      return;
    } else {
      statusEl.textContent = uiText.signup_insecure_warn || 'Insecure email host. Allowed only until OP-5.';
    }
  }

  if (password.length < 8) {
    statusEl.textContent = uiText.signup_pw_short || 'Password must be at least 8 characters.';
    return;
  }

  localStorage.setItem('ethicom_signup_email', email);
  statusEl.textContent = uiText.signup_saved || 'Signup information saved locally.';
}

window.addEventListener('DOMContentLoaded', initSignup);
