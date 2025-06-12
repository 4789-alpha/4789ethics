// semantic-manager.js – manage positive and negative word lists

let lexicon = {};
let pending = JSON.parse(localStorage.getItem('ethicom_pending_semantic') || '{}');

function getSignatureId() {
  try {
    const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
    return sig.id || null;
  } catch {
    return null;
  }
}

function loadLexicon() {
  return fetch('../i18n/semantic-words.json')
    .then(r => r.json())
    .catch(() => ({}))
    .then(data => {
      lexicon = data;
      Object.keys(pending).forEach(code => {
        if (pending[code] && pending[code].words) {
          lexicon[code] = pending[code].words;
        }
      });
      return lexicon;
    });
}

function savePending(code, obj) {
  const sig = getSignatureId();
  const entry = pending[code] || { words: obj, signatures: [], confirmed: false };
  entry.words = obj;
  if (sig && !entry.signatures.includes(sig)) entry.signatures.push(sig);
  entry.confirmed = entry.signatures.length >= 2;
  pending[code] = entry;
  localStorage.setItem('ethicom_pending_semantic', JSON.stringify(pending));
}

function confirmPending(code) {
  if (!pending[code]) return;
  const sig = getSignatureId();
  if (sig && !pending[code].signatures.includes(sig)) {
    pending[code].signatures.push(sig);
  }
  pending[code].confirmed = pending[code].signatures.length >= 2;
  localStorage.setItem('ethicom_pending_semantic', JSON.stringify(pending));
}

function showEditor(code, data) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.overflow = 'auto';
  overlay.style.zIndex = 1000;

  const form = document.createElement('div');
  form.className = 'card';
  form.style.background = '#fff';
  form.style.color = '#000';
  const sigCount = pending[code]?.signatures?.length || 0;
  form.innerHTML = `
    <h3>Edit semantic words for ${code}</h3>
    <p class="info" data-info="translation_sig_count" data-count="${sigCount}"></p>
    <label>Positive words (comma separated):<br>
      <input id="sem_pos" value="${(data.positive || []).join(', ')}"></label><br>
    <label>Negative words (comma separated):<br>
      <input id="sem_neg" value="${(data.negative || []).join(', ')}"></label><br>
    <button id="sem_save">Save</button>
    <button id="sem_cancel">Cancel</button>
  `;
  overlay.appendChild(form);
  if (typeof applyInfoTexts === 'function') applyInfoTexts(form);
  document.body.appendChild(overlay);

  document.getElementById('sem_cancel').addEventListener('click', () => overlay.remove());
  document.getElementById('sem_save').addEventListener('click', () => {
    const obj = {
      positive: document.getElementById('sem_pos').value.split(/,\s*/),
      negative: document.getElementById('sem_neg').value.split(/,\s*/)
    };
    savePending(code, obj);
    lexicon[code] = obj;
    overlay.remove();
    alert('Semantic words saved locally. Another user can confirm them.');
  });
}

function checkPending() {
  const lang = localStorage.getItem('ethicom_lang');
  if (lang && pending[lang] && !pending[lang].confirmed) {
    const needed = 2 - (pending[lang].signatures?.length || 0);
    const box = document.createElement('div');
    box.className = 'card';
    box.innerHTML = `
      <p>Unconfirmed semantic words for ${lang} found. ${needed} more confirmation(s) required.</p>
      <button id="sem_yes">Confirm</button>
      <button id="sem_edit">Edit</button>
    `;
    document.body.insertBefore(box, document.body.firstChild);
    document.getElementById('sem_yes').addEventListener('click', () => {
      confirmPending(lang);
      box.remove();
    });
    document.getElementById('sem_edit').addEventListener('click', () => {
      box.remove();
      showEditor(lang, pending[lang].words);
    });
  }
}

function initSemanticManager() {
  loadLexicon().then(() => {
    const container = document.getElementById('semantic_manager');
    if (!container) return;
    const select = document.createElement('select');
    Object.keys(lexicon)
      .sort()
      .forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = code;
        select.appendChild(opt);
      });
    select.value = localStorage.getItem('ethicom_lang') || 'en';
    const btn = document.createElement('button');
    btn.textContent = 'Edit Word Lists';
    container.appendChild(select);
    container.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = select.value.trim();
      const data = lexicon[code] || { positive: [], negative: [] };
      showEditor(code, data);
    });

    checkPending();
  });
}

if (typeof module !== 'undefined') {
  module.exports = { loadLexicon };
}
