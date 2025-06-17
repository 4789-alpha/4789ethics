function getParam(name) {
  const m = new URLSearchParams(location.search).get(name);
  return m ? m.replace(/[^a-z0-9_-]/gi, '') : '';
}

async function savePassword(user) {
  const pw1 = document.getElementById('pw1').value;
  const pw2 = document.getElementById('pw2').value;
  const status = document.getElementById('status');
  status.textContent = '';
  if (pw1 !== pw2) { status.textContent = 'Passw\u00f6rter stimmen nicht \u00fcberein.'; return; }
  if (pw1.length < 8) { status.textContent = 'Mindestens 8 Zeichen.'; return; }
  const hash = await sha256(pw1);
  localStorage.setItem('pw_' + user, hash);
  localStorage.setItem('pwSet_' + user, '1');
  status.textContent = 'Gespeichert.';
  setTimeout(() => { location.href = '../index.html'; }, 500);
}

window.addEventListener('DOMContentLoaded', () => {
  const user = getParam('u');
  const label = document.getElementById('user_label');
  if (user === 'ref') label.textContent = 'Login f\u00fcr RL';
  else if (user === 'baduren') label.textContent = 'Login f\u00fcr MB';
  else label.textContent = user;
  document.getElementById('save_btn').addEventListener('click', () => savePassword(user));
});
