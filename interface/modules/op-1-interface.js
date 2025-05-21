// op-1-interface.js – OP-1: Erste signierte Bewertung

function initOP1Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Signed Evaluation (OP-1)</h3>
      <p class="info" data-info="op-1"></p>

      <label for="src_lvl">Select the SRC level:</label>
      ${help('SRC describes the ethical consciousness of the evaluated source.')}
      <select id="src_lvl">
        <option value="SRC-0">SRC-0: Unconscious</option>
        <option value="SRC-1">SRC-1: Externally Controlled</option>
        <option value="SRC-2">SRC-2: Reactive</option>
        <option value="SRC-3">SRC-3: Ethically Attempting</option>
        <option value="SRC-4">SRC-4: Structurally Ethical</option>
      </select>

      <label for="comment">Ethical justification (required):</label>
      ${help('Explain briefly why this SRC level fits the source.')}
      <textarea id="comment" rows="3" required placeholder="Why is this the correct SRC level?"></textarea>

      <button onclick="generateSignedManifest()">Submit Evaluation</button>
      <button class="secondary-button" type="button" onclick="initOP1Interface()">Reset</button>
    </div>
  `;
  applyInfoTexts(container);
}

function generateSignedManifest() {
  const src_lvl = document.getElementById("src_lvl").value;
  const comment = document.getElementById("comment").value;
  const timestamp = new Date().toISOString();

  if (!comment.trim()) {
    alert("Please provide an ethical justification.");
    return;
  }

  const evalData = {
    source_id: "undefined",
    operator: "sig-xxxx",  // wird durch Interface gesetzt
    op_level: "OP-1",
    src_lvl,
    comment,
    timestamp,
    verified: true,
    weight: 1.0
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);
}
