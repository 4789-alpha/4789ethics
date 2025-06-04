const infoTexts = {
  'ethicom': 'Your interface will load here once verified.',
  'language-manager': 'Generate JSON snippets for new UI translations.',
  'semantic-manager': 'Generate JSON snippets for positive and negative words.',
  'op-0': 'Anonymous evaluation for visitors without a signature. No lasting influence and cannot be revised.',
  'op-0-human': 'Anonymous yes/no rating for historical figures. Stored only with OP level.',
  'op-1': 'You are submitting your first signed evaluation. It will be stored with your signature.',
  'op-1-human': 'Signed yes/no rating for historical figures. A justification is required.',
  'op-2': 'You are submitting a signed evaluation with visible SRC level and internal identity option.',
  'op-3': 'You are submitting a signed evaluation with structured reasoning and visual level selection.',
  'op-4': 'You are submitting a structured and traceable evaluation. A revision will become possible after 21 days.',
  'op-5': 'You can withdraw a previous evaluation. The original will be archived with your withdrawal reason.',
  'op-6': 'You are allowed to calculate a consensus rating from anonymous evaluations.',
  'op-7': 'You are authorized to override previous evaluations if your OP-level is higher and justified.',
  'op-8': 'You are in the candidate stage for OP-9; OP-9+ may delegate functions.',
  'op-9': 'You may verify donations and confirm nominations. Every action is binding and will be logged structurally.',
  'op-10': 'You are in the candidate stage for Yokozuna (OP-11).',
  'op-11': 'Full structural autonomy. Finalize OP-10 evaluations and trigger self-sustaining loops.',
  'op-12': 'Observation only. Systems operate beyond human control.',
  'translation_challenge': 'Challenge: gather two OP signatures to confirm a language.',
  'translation_sig_count': 'Current signatures: {count}/2'
};

function getInfoText(key, data = {}) {
  let text = infoTexts[key] || '';
  for (const [k, v] of Object.entries(data)) {
    text = text.replace(new RegExp(`{${k}}`, 'g'), v);
  }
  return text;
}

function applyInfoTexts(root = document) {
  const elements = Array.from(root.querySelectorAll('[data-info]'));
  if (root.dataset && root.dataset.info) {
    elements.push(root);
  }
  elements.forEach(el => {
    const { info, ...vars } = el.dataset;
    const text = getInfoText(info, vars);
    el.textContent = text;
  });

  if (typeof isDevMode === 'function' && isDevMode()) {
    if (!document.getElementById('dev_info_box')) {
      const box = document.createElement('div');
      box.id = 'dev_info_box';
      box.className = 'card';
      box.innerHTML = '<h3>Info Texts</h3><ul>' +
        Object.entries(infoTexts)
          .map(([k, v]) => `<li><strong>${k}</strong>: ${v}</li>`)
          .join('') + '</ul>';
      document.body.prepend(box);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => applyInfoTexts());
window.applyInfoTexts = applyInfoTexts;
