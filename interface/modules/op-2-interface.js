// op-2-interface.js – OP-2: Bewertung mit Signatur + optionalem Klarname

function initOP2Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Structured Evaluation (OP-2)</h3>
      <p class="info" data-info="op-2"></p>

      <label for="src_lvl">Select the SRC level:</label>
      ${help('SRC describes the ethical consciousness of the evaluated source.')}
      <select id="src_lvl">
        <option value="SRC-0">SRC-0: Unconscious</option>
        <option value="SRC-1">SRC-1: Externally Controlled</option>
        <option value="SRC-2">SRC-2: Reactive</option>
        <option value="SRC-3">SRC-3: Ethically Attempting</option>
        <option value="SRC-4">SRC-4: Structurally Ethical</option>
      </select>

      <label for="aspects">Aspect tags (comma-separated):</label>
      ${help('Keywords that highlight specific angles of your evaluation.')}
      <input type="text" id="aspects" placeholder="e.g. transparency, repairability" />

      <label for="comment">Ethical justification:</label>
      ${help('Explain why the source deserves this SRC level.')}
      <textarea id="comment" rows="3" required placeholder="Why do you assign this level?"></textarea>

      <label for="private_id">Private identity (optional, not public):</label>
      ${help('Reference code only you can link back to yourself.')}
      <input type="text" id="private_id" placeholder="(optional) e.g. initials, memory code" />

      <button onclick="generateStructuredManifest()">Submit Evaluation</button>
    </div>
  `;
  applyInfoTexts(container);
}

function generateStructuredManifest() {
  const src_lvl = document.getElementById("src_lvl").value;
  const comment = document.getElementById("comment").value;
  const tags = document.getElementById("aspects").value.trim().split(",").map(t => t.trim());
  const private_id = document.getElementById("private_id").value.trim();
  const timestamp = new Date().toISOString();

  if (!comment) {
    alert("Please justify your ethical choice.");
    return;
  }

  const evalData = {
    source_id: "undefined",
    operator: "sig-xxxx",
    op_level: "OP-2",
    src_lvl,
    aspects: tags.filter(t => t !== ""),
    comment,
    timestamp,
    verified: true,
    weight: 1.0
  };

  if (private_id) {
    evalData.private_reference = true;
  }

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);
}
