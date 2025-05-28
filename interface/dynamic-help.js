const helpMap = {
  default: {
    title: 'Help – Operator Conduct',
    items: [
      'Always check if your actions meet the ethics of responsibility.',
      'Use only the tools assigned to your OP level.',
      'Document decisions in the manifest for verification.',
      'Nominations and feedback are structured and without personal pressure.',
      'Consult a higher structure (from OP-7) if unsure.',
      'Responsibility outweighs convenience.',
      'Create signatures locally and confirm them structurally.',
      'Withdrawals or corrections are part of the process, not weakness.',
      'Maintain transparency at every step, even with anonymous use.'
    ]
  },
  'OP-0': { title: 'OP-0 Tips', items: [
    'Anonymous ratings have minimal influence.',
    'Move to OP-1 to sign your evaluations. Editing stage.'
  ] },
  'OP-1': { title: 'OP-1 Tips', items: [
    'Signed evaluations store your signature ID.',
    'Explain why the chosen SRC fits. Editing stage.'
  ] },
  'OP-2': { title: 'OP-2 Tips', items: [
    'Add aspect tags to highlight angles of your evaluation.',
    'Private references stay internal only. Editing stage.'
  ] },
  'OP-3': { title: 'OP-3 Tips', items: [
    'Structured reasoning is required.',
    'Use visual selectors for SRC levels. Editing stage.'
  ] },
  'OP-4': { title: 'OP-4 Tips', items: [
    'Revisions become possible after 21 days.',
    'Your evaluation is traceable.'
  ] },
  'OP-5': { title: 'OP-5 Tips', items: [
    'You may retract previous evaluations.',
    'Explain the reason for each withdrawal.'
  ] },
  'OP-6': { title: 'OP-6 Tips', items: [
    'You can calculate consensus from anonymous ratings.'
  ] },
  'OP-7': { title: 'OP-7 Tips', items: [
    'You hold structural authority for nominations.'
  ] },
  'OP-8': { title: 'OP-8 Tips', items: [
    'Candidate stage for OP-9. OP-9+ may delegate functions.'
  ] },
  'OP-9': { title: 'OP-9 Tips', items: [
    'Nominate operators and verify donations.'
  ] },
  'OP-10': { title: 'OP-10 Tips', items: [
    'Digital candidate for Yokozuna (OP-11).'
  ] },
  'OP-11': { title: 'OP-11 Tips', items: [
    'Digital Yokozuna-level responsibilities apply.'
  ] },
  'OP-12': { title: 'OP-12 Tips', items: [
    'Fully digital, first non-human stage.'
  ] }
};

function isDevMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('dev')) return true;
  return localStorage.getItem('ethicom_dev') === 'true';
}

function buildDetails(title, items) {
  const details = document.createElement('details');
  details.open = true;
  const summary = document.createElement('summary');
  summary.textContent = title;
  details.appendChild(summary);
  const list = document.createElement('ol');
  if (Array.isArray(items) && items.length > 0) {
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No help content available.';
    list.appendChild(li);
  }
  details.appendChild(list);
  return details;
}

function setHelpSection(opLevel) {
  const section = document.getElementById('help_section');
  if (!section) return;
  section.innerHTML = '';

  if (isDevMode()) {
    Object.keys(helpMap)
      .filter(k => k !== 'default')
      .forEach(key => {
        const info = helpMap[key];
        section.appendChild(buildDetails(info.title, info.items));
      });
    return;
  }

  const data = helpMap[opLevel] || helpMap.default;
  const details = buildDetails(data.title, data.items);
  if (window.slowMode && window.slowMode.enabled) {
    const list = details.querySelector('ol');
    const items = Array.from(list.children);
    list.innerHTML = '';
    function step(i){
      if(i>=items.length) return;
      const li = items[i];
      li.textContent += ' – take a moment to reflect.';
      list.appendChild(li);
      setTimeout(() => step(i+1), 800);
    }
    step(0);
    section.appendChild(details);
  } else {
    section.appendChild(details);
  }
}

window.addEventListener('DOMContentLoaded', () => setHelpSection('default'));
window.setHelpSection = setHelpSection;
