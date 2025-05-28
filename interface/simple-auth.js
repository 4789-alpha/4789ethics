// simple-auth.js - local login helper

function loginWithStoredToken() {
  const token = localStorage.getItem('oauth_token');
  if (!token) return Promise.resolve(false);
  return fetch('/api/token-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
    .then(r => {
      if (!r.ok) throw new Error('fail');
      return r.json();
    })
    .then(data => {
      localStorage.setItem('ethicom_signature', JSON.stringify(data));
      return true;
    })
    .catch(() => false);
}

function loginWithCredentials(username, password) {
  return fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: username, password })
  })
    .then(r => {
      if (!r.ok) throw new Error('fail');
      return r.json();
    })
    .then(data => {
      const sig = { email: username, id: data.id, op_level: data.op_level };
      localStorage.setItem('ethicom_signature', JSON.stringify(sig));
      return true;
    });
}

function savePreferences() {
  const language = localStorage.getItem('ethicom_lang') || 'de';
  const theme = localStorage.getItem('ethicom_theme') || 'tanna-dark';
  fetch('/api/userprofile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, theme })
  }).catch(() => {});
}

window.simpleAuth = { loginWithStoredToken, loginWithCredentials, savePreferences };
