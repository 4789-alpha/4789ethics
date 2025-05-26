function loadWebContent(url, containerId = 'web_content') {
  const container = document.getElementById(containerId);
  if (!container || !url) return;
  container.innerHTML = '...';
  fetch('/proxy?url=' + encodeURIComponent(url))
    .then(r => r.text())
    .then(html => { container.innerHTML = html; })
    .catch(() => { container.textContent = 'Failed to load content.'; });
}

if (typeof window !== 'undefined') {
  window.loadWebContent = loadWebContent;
}
