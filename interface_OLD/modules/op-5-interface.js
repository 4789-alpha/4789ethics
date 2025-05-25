// op-5-interface.js – OP-5: Rückzug von Bewertungen mit Dokumentation

function initOP5Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Withdraw Evaluation (OP-5)</h3>
      <p class="info" data-info="op-5"></p>

      <label for="original_id">Original Manifest filename:</label>
      ${help('Name of the manifest file you previously generated.')}
      <input type="text" id="original_id" placeholder="e.g. op-eval-4321-src-0011.json" />

      <label for="reason">Reason for withdrawal (required):</label>
      ${help('Describe why the earlier evaluation should be withdrawn.')}
      <textarea id="reason" rows="3" required placeholder="Explain why this evaluation should no longer be considered valid."></textarea>

      <button onclick="generateWithdrawal()">Withdraw Evaluation</button>
    </div>
  `;
  applyInfoTexts(container);
}

function generateWithdrawal() {
  const original_id = document.getElementById("original_id").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const timestamp = new Date().toISOString();

  if (!original_id || !reason) {
    alert("Both fields are required.");
    return;
  }

  const withdrawalData = {
    withdrawn_by: "sig-xxxx",
    op_level: "OP-5",
    original_manifest: original_id,
    timestamp_withdrawn: timestamp,
    reason,
    status: "withdrawn",
    hash: "preserved"
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(withdrawalData, null, 2);

  if (typeof recordEvidence === "function") {
    recordEvidence(JSON.stringify(withdrawalData), "operator");
  }
}
