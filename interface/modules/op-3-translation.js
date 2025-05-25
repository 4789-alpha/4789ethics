// op-3-translation.js – simple translation contributor for OP-3+

async function initOP3Translation() {
  const container = document.getElementById('op_interface');
  if (!container) return;

  const level = window.opLevelToNumber ? window.opLevelToNumber(window.getStoredOpLevel()) : 0;
  if (level < 3) {
    container.innerHTML = '<p>OP-3 erforderlich, um Übersetzungen beizutragen.</p>';
    return;
  }

  let corpus = {};
  try {
    corpus = await fetch('../i18n/language-corpus.json').then(r => r.json());
  } catch {
    corpus = {};
  }
  const words = Object.keys(corpus.de || corpus.en || {});
  let index = 0;

  container.innerHTML = `
    <div class="card">
      <h3>Translation Module (OP-3+)</h3>
      <p><span id="orig_word"></span></p>
      <input id="tr_input" aria-label="Translation" type="text"/>
      <button id="tr_confirm" disabled>Bestätigen</button>
      <button id="tr_next">Weiter</button>
      <p id="tr_msg"></p>
    </div>`;

  const orig = document.getElementById('orig_word');
  const input = document.getElementById('tr_input');
  const confirm = document.getElementById('tr_confirm');
  const next = document.getElementById('tr_next');
  const msg = document.getElementById('tr_msg');

  function loadWord() {
    orig.textContent = words[index] || '';
    input.value = '';
    confirm.disabled = true;
    msg.textContent = '';
  }

  input.addEventListener('input', () => {
    confirm.disabled = !input.value.trim();
  });

  confirm.addEventListener('click', () => {
    msg.textContent = 'Vorschlag gespeichert';
  });

  next.addEventListener('click', () => {
    index = (index + 1) % words.length;
    loadWord();
  });

  loadWord();
}
