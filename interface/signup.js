const secureHosts = [
  'protonmail.com',
  'tutanota.com',
  'mailbox.org',
  'posteo.de'
];

function handleSignup() {
  const emailInput = document.getElementById('email_input');
  const pwInput = document.getElementById('pw_input');
  const statusEl = document.getElementById('signup_status');
  const email = emailInput.value.trim();
  const password = pwInput.value;
  statusEl.textContent = '';

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    statusEl.textContent = 'Invalid email format.';
    return;
  }

  const domain = email.split('@')[1].toLowerCase();
  if (!secureHosts.includes(domain)) {
    statusEl.textContent = 'Email provider not supported. Use a secure host.';
    return;
  }

  if (password.length < 8) {
    statusEl.textContent = 'Password must be at least 8 characters.';
    return;
  }

  localStorage.setItem('ethicom_signup_email', email);
  statusEl.textContent = 'Signup information saved locally.';
}
