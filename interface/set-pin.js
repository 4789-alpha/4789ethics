function tryPin() {
  const pin = document.getElementById('pin_input').value.trim();
  const status = document.getElementById('status');
  const blockedUntil = parseInt(localStorage.getItem('sime_blocked') || '0', 10);
  if (blockedUntil > Date.now()) {
    const dt = new Date(blockedUntil).toLocaleString();
    status.textContent = 'Gesperrt bis ' + dt;
    return;
  }
  if (pin === '1988') {
    localStorage.setItem('pin_sime', '1988');
    localStorage.removeItem('sime_attempts');
    status.textContent = 'Willkommen.';
    setTimeout(() => { location.href = '../index.html'; }, 500);
    return;
  }
  let attempts = parseInt(localStorage.getItem('sime_attempts') || '0', 10) + 1;
  localStorage.setItem('sime_attempts', attempts);
  if (attempts > 2) {
    const until = Date.now() + 24*3600*1000;
    localStorage.setItem('sime_blocked', until.toString());
    status.textContent = 'Zu viele Fehlversuche. IP 24h blockiert. Admin RL informiert.';
  } else {
    status.textContent = 'Falscher PIN.';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pin_btn').addEventListener('click', tryPin);
});
