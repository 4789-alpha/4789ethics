// op-7.5-interface.js – OP-7.5: Vorschlagsberechtigung, nicht Verleihung

function initOP75Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Responsibility Tier (OP-7.5)</h3>
      <p class="info">You are recognized as a structurally consistent operator. You may prepare nominations and review OP-8 observations, but not execute structural changes.</p>

      <h4>Propose Nomination</h4>
      <label for="propose_id">Operator Signature:</label>
      <input type="text" id="propose_id" placeholder="e.g. sig-4321" />

      <label for="propose_target">Proposed Target Rank:</label>
      <select id="propose_target">
        <option value="OP-2">OP-2</option>
        <option value="OP-3">OP-3</option>
        <option value="OP-4">OP-4</option>
        <option value="OP-5">OP-5</option>
        <option value="OP-6">OP-6</option>
        <option value="OP-7">OP-7</option>
      </select>

      <label for="propose_reason">Why does this operator qualify?</label>
      <textarea id="propose_reason" rows="3" required placeholder="Document your rationale structurally..."></textarea>

      <button onclick="prepareNomination()">Create Nomination Proposal</button>
    </div>
  `;
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
    op_level: "OP-7.5",
    nominee: op_id,
    suggested_rank: rank,
    reason,
    timestamp,
    review_status: "open"
  };

  document.getElementById("output").textContent = JSON.stringify(proposal, null, 2);
}
