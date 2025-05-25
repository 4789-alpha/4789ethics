// op-8-interface.js – OP-8: Vorschlagsberechtigung, nicht Verleihung

async function initOP8Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  let extra = '';
  try {
    const data = await fetch('../op-permissions.json').then(r => r.json());
    if (data.op8_temp_privilege) {
      await loadOp9Module();
      if (typeof getOP9Card === 'function') extra = getOP9Card();
    }
  } catch {}

  container.innerHTML = `
    <div class="card">
      <h3>Responsibility Tier (OP-8)</h3>
      <p class="info" data-info="op-8"></p>

      <h4>Propose Nomination</h4>
      <label for="propose_id">Operator Signature:</label>
      ${help('Signature ID of the operator you want to nominate.')}
      <input type="text" id="propose_id" placeholder="e.g. sig-4321" />

      <label for="propose_target">Proposed Target Rank:</label>
      ${help('OP-level you believe the operator has earned.')}
      <select id="propose_target">
        <option value="OP-2">OP-2</option>
        <option value="OP-3">OP-3</option>
        <option value="OP-4">OP-4</option>
        <option value="OP-5">OP-5</option>
        <option value="OP-6">OP-6</option>
        <option value="OP-7">OP-7</option>
      </select>

      <label for="propose_reason">Why does this operator qualify?</label>
      ${help('State your structural reasoning for the nomination.')}
      <textarea id="propose_reason" rows="3" required placeholder="Document your rationale structurally..."></textarea>

      <button onclick="prepareNomination()">Create Nomination Proposal</button>
    </div>
    ${extra}
  `;
  applyInfoTexts(container);
}

function loadOp9Module() {
  return new Promise(res => {
    if (typeof getOP9Card === 'function') return res();
    const s = document.createElement('script');
    s.src = 'modules/op-9-interface.js';
    s.onload = res;
    document.head.appendChild(s);
  });
}

function prepareNomination() {
  const op_id = document.getElementById("propose_id").value.trim();
  const rank = document.getElementById("propose_target").value;
  const reason = document.getElementById("propose_reason").value.trim();
  const timestamp = new Date().toISOString();

  if (!op_id || !reason) {
    alert("Please fill in all fields.");
    return;
  }

  const proposal = {
    proposed_by: "sig-xxxx",
    op_level: "OP-8",
    nominee: op_id,
    suggested_rank: rank,
    reason,
    timestamp,
    review_status: "open"
  };

  document.getElementById("output").textContent = JSON.stringify(proposal, null, 2);
}
