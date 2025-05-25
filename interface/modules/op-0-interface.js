// op-0-interface.js – OP-0: Anonyme Bewertung (keine Signatur, minimale Verantwortung)

async function initOP0Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  let humans = [];
  try {
    humans = await fetch("../sources/persons/human-top100.json").then(r => r.json());
  } catch {
    humans = [];
  }
  const human = humans[Math.floor(Math.random() * humans.length)] || {};

  container.innerHTML = `
    <div class="card">
      <h3>Anonymous Rating (OP-0)</h3>
      ${typeof isOP0TestMode === 'function' && isOP0TestMode() ? '<p class="warn">Test Mode: Results are not recorded.</p>' : ''}
      <p class="info" data-info="op-0"></p>

      <p><strong>Name:</strong> ${human.name || 'Unknown'}</p>
      ${human.era ? `<p><strong>Era:</strong> ${human.era}</p>` : ''}
      ${human.domain ? `<p><strong>Domain:</strong> ${human.domain}</p>` : ''}
      ${human.description ? `<p><strong>Description:</strong> ${human.description}</p>` : ''}

      <div>
        <label><input type="radio" name="op0_vote" value="yes"> Ja</label>
        <label><input type="radio" name="op0_vote" value="partial"> Zum Teil</label>
        <label><input type="radio" name="op0_vote" value="no"> Nein</label>
      </div>

      <button onclick="submitOP0Vote('${human.human_id || ''}')">Bewerten</button>
      <button class="secondary-button" type="button" onclick="initOP0Interface()">Nächste Person</button>

      <p id="op0_result"></p>
    </div>
  `;
  applyInfoTexts(container);
}

function submitOP0Vote(id) {
  const choice = document.querySelector('input[name="op0_vote"]:checked');
  if (!choice) return;

  const store = JSON.parse(localStorage.getItem('op0_votes') || '{}');
  if (!store[id]) store[id] = { yes: 0, partial: 0, no: 0 };
  store[id][choice.value] += 1;
  localStorage.setItem('op0_votes', JSON.stringify(store));

  const counts = store[id];
  const total = counts.yes + counts.partial + counts.no;
  const max = Math.max(counts.yes, counts.partial, counts.no);
  let label = 'ja';
  if (max === counts.partial) label = 'zum Teil';
  if (max === counts.no) label = 'nein';
  const percent = total ? Math.round((max / total) * 100) : 0;

  const result = document.getElementById('op0_result');
  if (result) result.textContent = `Aktueller Anteil: ${label} (${percent}%)`;

  if (typeof recordEvidence === 'function') {
    const evalData = {
      human_id: id,
      rating: choice.value,
      op_level: 'OP-0',
      timestamp: new Date().toISOString()
    };
    recordEvidence(JSON.stringify(evalData), 'user');
  }
}
