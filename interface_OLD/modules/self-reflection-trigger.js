function triggerSelfReflection(reason) {
  const container = document.getElementById('op_interface');
  if (!container) return;
  const box = document.createElement('div');
  box.className = 'card';
  box.innerHTML = `<h3>Self-Reflection</h3><p>${reason || 'Refer to structure_9874 for guidance.'}</p><button onclick="this.parentElement.remove()">OK</button>`;
  container.prepend(box);
}

if (typeof module !== 'undefined') {
  module.exports = { triggerSelfReflection };
} else {
  window.triggerSelfReflection = triggerSelfReflection;
}
