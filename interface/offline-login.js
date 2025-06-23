async function offlineLogin() {
  const emailEl = document.getElementById('email_input');
  const pwEl = document.getElementById('pw_input');
  const statusEl = document.getElementById('status');
  const email = emailEl.value.trim();
  const pw = pwEl.value;
  statusEl.textContent = '';

  const stored = localStorage.getItem('ethicom_offline_user');
  if (!stored) {
    statusEl.textContent = 'No offline profile found. Use offline-signup.html.';
    return;
  }
  const profile = JSON.parse(stored);
  const emailHash = await sha256(email);
  if (emailHash !== profile.emailHash) {
    statusEl.textContent = 'Email not found.';
    return;
  }
  const pwHash = await sha256(pw + profile.salt);
  if (pwHash !== profile.pwHash) {
    statusEl.textContent = 'Password incorrect.';
    return;
  }
  const sig = {
    emailHash: profile.emailHash,
    op_level: profile.op_level || 'OP-1',
    alias: profile.alias || ''
  };
  localStorage.setItem('ethicom_signature', JSON.stringify(sig));
  statusEl.textContent = 'Login successful.';
  setTimeout(() => { window.location.href = 'ethicom.html'; }, 500);
}

if (typeof window !== 'undefined') {
  window.offlineLogin = offlineLogin;
}
