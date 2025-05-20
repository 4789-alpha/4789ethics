// op-4-interface.js – OP-4: Bewertung mit sichtbarer Revisionsmöglichkeit

function initOP4Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Structured Evaluation (OP-4)</h3>
      <p class="info">You are submitting a structured and traceable evaluation. A revision will become possible after 21 days.</p>

      <label for="src_lvl">SRC Level:</label>
      <select id="src_lvl">
        <option value="SRC-0">SRC-0: Unconscious</option>
        <option value="SRC-1">SRC-1: Externally Controlled</option>
        <option value="SRC-2">SRC-2: Reactive</option>
        <option value="SRC-3">SRC-3: Ethically Attempting</option>
        <option value="SRC-4">SRC-4: Structurally Ethical</option>
        <option value="SRC-5">SRC-5: System-Conscious</option>
      </select>

      <label for="comment">Justification (required):</label>
      <textarea id="comment" rows="3" required placeholder="Your ethical justification..."></textarea>

      <p><strong>Note:</strong> After submission, this evaluation is final for 21 days. After that, you may revise it.</p>
      <button onclick="generateTraceableManifest()">Submit</button>
    </div>
  `;
}

function generateTraceableManifest() {
  const src_lvl = document.getElementById("src_lvl").value;
  const comment = document.getElementById("comment").value;
  const timestamp = new Date().toISOString();

  if (!comment.trim()) {
    alert("Please provide a justification.");
    return;
  }

  const revision_date = new Date();
  revision_date.setDate(revision_date.getDate() + 21);

  const evalData = {
    source_id: "undefined",
    operator: "sig-xxxx",
    op_level: "OP-4",
    src_lvl,
    comment,
    timestamp,
    verified: true,
    weight: 1.0,
    status: "finalized",
    edit_eligible_from: revision_date.toISOString()
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);
}
