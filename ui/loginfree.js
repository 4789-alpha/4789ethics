// Simple presence check placeholder
window.addEventListener('DOMContentLoaded', () => {
  const ctx = { name: 'example' };
  fetch('/gatekeeper').catch(() => {});
});
