async function storeOfflineProfile() {
  const emailEl = document.getElementById('email_input');
  const pwEl = document.getElementById('pw_input');
  const statusEl = document.getElementById('status');
  const email = emailEl.value.trim();
  const pw = pwEl.value;
  statusEl.textContent = '';

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    statusEl.textContent = 'Invalid email format.';
    return;
  }
  if (pw.length < 8) {
    statusEl.textContent = 'Password must be at least 8 characters.';
    return;
  }

  const salt = Math.random().toString(36).slice(2, 10);
  const emailHash = await sha256(email);
  const pwHash = await sha256(pw + salt);
  const created = new Date().toISOString();
  const obj = { emailHash, pwHash, salt, created };
  localStorage.setItem('ethicom_offline_user', JSON.stringify(obj));
  statusEl.textContent = 'Profile stored locally.';
}

if (typeof window !== 'undefined') {
  window.storeOfflineProfile = storeOfflineProfile;
}
