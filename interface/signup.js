const secureHosts = [
  'protonmail.com',
  'tutanota.com',
  'mailbox.org',
  'posteo.de'
];

const countryPhoneMap = {
  CH: '+41',
  DE: '+49',
  AT: '+43',
  US: '+1',
  FR: '+33'
};

let uiText = {};

function updatePhonePlaceholder() {
  const phoneInput = document.getElementById('phone_input');
  const countryInput = document.getElementById('country_input');
  if (!phoneInput || !countryInput) return;
  const prefix = countryPhoneMap[countryInput.value];
  if (prefix) phoneInput.placeholder = prefix + '123456789';
}

function applySignupTexts() {
  document.documentElement.lang = localStorage.getItem('ethicom_lang') || 'de';
  const t = uiText;
  const h2 = document.querySelector('[data-ui="signup_title"]');
  if (h2) h2.textContent = t.signup_title || h2.textContent;
  const emailLabel = document.querySelector('label[for="email_input"]');
  if (emailLabel) emailLabel.textContent = t.signup_email || emailLabel.textContent;
  const pwLabel = document.querySelector('label[for="pw_input"]');
  if (pwLabel) pwLabel.textContent = t.signup_password || pwLabel.textContent;
  const nickLabel = document.querySelector('label[for="nick_input"]');
  if (nickLabel) nickLabel.textContent = t.signup_nick || nickLabel.textContent;
  const signupBtn = document.getElementById('signup_btn');
  if (signupBtn) signupBtn.textContent = t.signup_btn || signupBtn.textContent;
  const emailInput = document.getElementById('email_input');
  if (emailInput && t.signup_placeholder_email) emailInput.placeholder = t.signup_placeholder_email;
  const pwInput = document.getElementById('pw_input');
  if (pwInput && t.signup_placeholder_pw) pwInput.placeholder = t.signup_placeholder_pw;
  const nickInput = document.getElementById('nick_input');
  if (nickInput && t.signup_placeholder_nick) nickInput.placeholder = t.signup_placeholder_nick;
  const addrLabel = document.querySelector('label[for="addr_input"]');
  if (addrLabel) addrLabel.textContent = t.signup_address || addrLabel.textContent;
  const addrInput = document.getElementById('addr_input');
  if (addrInput && t.signup_placeholder_address) addrInput.placeholder = t.signup_placeholder_address;
  const countryLabel = document.querySelector('label[for="country_input"]');
  if (countryLabel) countryLabel.textContent = t.signup_country || 'Country/Region:';
  const countryInput = document.getElementById('country_input');
  if (countryInput && t.signup_placeholder_country) {
    countryInput.value = t.signup_placeholder_country;
  }
  const phoneLabel = document.querySelector('label[for="phone_input"]');
  if (phoneLabel) phoneLabel.textContent = t.signup_phone || phoneLabel.textContent;
  const phoneInput = document.getElementById('phone_input');
  if (phoneInput && t.signup_placeholder_phone) phoneInput.placeholder = t.signup_placeholder_phone;
  const serverNotice = document.getElementById('server_notice');
  if (serverNotice && t.signup_server_notice) serverNotice.textContent = t.signup_server_notice;
  updatePhonePlaceholder();
}

function hideNickInputIfNoob() {
  const level = getStoredOpLevel() || 'OP-1';
  const levelNum = opLevelToNumber(level);
  if (levelNum < 2) {
    const nickLabel = document.querySelector('label[for="nick_input"]');
    const nickInput = document.getElementById('nick_input');
    if (nickLabel) nickLabel.style.display = 'none';
    if (nickInput) {
      nickInput.style.display = 'none';
      nickInput.disabled = true;
    }
  }
}

function initSignup() {
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r => r.json())
    .then(data => {
      uiText = data[lang] || data.en || {};
      applySignupTexts();
      const countryInput = document.getElementById('country_input');
      if (countryInput) countryInput.addEventListener('change', updatePhonePlaceholder);
      updatePhonePlaceholder();
      hideNickInputIfNoob();
    });
}

function handleSignup() {
  const emailInput = document.getElementById('email_input');
  const pwInput = document.getElementById('pw_input');
  const addrInput = document.getElementById('addr_input');
  const phoneInput = document.getElementById('phone_input');
  const countryInput = document.getElementById('country_input');
  const nickInput = document.getElementById('nick_input');
  const statusEl = document.getElementById('signup_status');
  const email = emailInput.value.trim();
  const password = pwInput.value;
  const address = addrInput ? addrInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const country = countryInput ? countryInput.value.trim() : '';
  const nickname = nickInput ? nickInput.value.trim() : '';
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

  fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, address, phone, country, nickname })
  })
    .then(async r => {
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || 'Signup failed. Please check the form.');
      }
      return r.json();
    })
    .then(data => {
      const nick = data.nickname || nickname;
      const sig = { email, id: data.id, op_level: 'OP-1', nickname: nick, alias: data.alias };
      localStorage.setItem('ethicom_signature', JSON.stringify(sig));
      const msgSaved = uiText.signup_saved || 'Signup complete. ID stored.';
      const msgAlias = (uiText.signup_alias || 'Alias: {alias}').replace('{alias}', data.alias);
      const msgSecret = (uiText.signup_secret || 'Authenticator secret: {secret}')
        .replace('{secret}', data.secret);
      statusEl.textContent = msgSaved + '\n' + msgAlias + '\n' + msgSecret;
    })
    .catch(err => {
      statusEl.textContent = err.message || 'Signup failed. Please check the form.';
    });
}

window.addEventListener('DOMContentLoaded', initSignup);
