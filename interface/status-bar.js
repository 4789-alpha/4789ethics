function checkServerStatus(url = 'config.json') {
  return fetch(url, { method: 'HEAD', cache: 'no-cache' })
    .then(r => r.ok)
    .catch(() => false);
}

function showStatus(msg, online) {
  const bar = document.getElementById('status_bar') || createStatusBar();
  bar.textContent = msg;
  bar.className = online ? 'status-bar status-online' : 'status-bar status-offline';
  bar.style.display = 'block';
}

function createStatusBar() {
  const bar = document.createElement('div');
  bar.id = 'status_bar';
  bar.className = 'status-bar';
  document.body.prepend(bar);
  return bar;
}

async function initStatusBar() {
  if (location.protocol === 'file:') {
    showStatus('Server offline', false);
    return;
  }
  const online = await checkServerStatus();
  if (!online) showStatus('Server offline', false);
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initStatusBar);
  window.showStatus = showStatus;
}
