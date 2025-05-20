// op-0-interface.js – OP-0: Anonyme Bewertung (keine Signatur, minimale Verantwortung)

function initOP0Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Anonymous Rating (OP-0)</h3>
      <p class="info">You are submitting an anonymous evaluation. It will have no lasting influence and cannot be revised.</p>

      <label for="src_lvl">Select a general ethical level (SRC):</label>
      <select id="src_lvl">
        <option value="SRC-0">SRC-0: Unconscious</option>
        <option value="SRC-1">SRC-1: Externally Controlled</option>
        <option value="SRC-2">SRC-2: Reactive</option>
        <option value="SRC-3">SRC-3: Ethically Attempting</option>
        <option value="SRC-4">SRC-4: Structurally Ethical</option>
      </select>

      <label for="comment">Optional comment:</label>
      <textarea id="comment" rows="3" placeholder="(optional) Your ethical note..."></textarea>

      <button onclick="generateAnonymousManifest()">Evaluate</button>
    </div>
  `;
}

function generateAnonymousManifest() {
  const src_lvl = document.getElementById("src_lvl").value;
  const comment = document.getElementById("comment").value;
  const timestamp = new Date().toISOString();

  const evalData = {
    source_id: "undefined",
    operator: "anonymous",
    op_level: "OP-0",
    src_lvl,
    comment,
    timestamp,
    verified: false,
    weight: 0.05
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);
}
