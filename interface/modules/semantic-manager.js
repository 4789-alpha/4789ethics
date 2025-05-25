// semantic-manager.js – Add or modify emotion word lists for languages

function initSemanticManager() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Semantic Word Management</h3>
      <p class="info" data-info="semantic-manager"></p>
      <label for="sem_code">Language Code (ISO 639-1):</label>
      <input type="text" id="sem_code" maxlength="2" />
      <label for="sem_pos">Positive words (comma separated):</label>
      <input type="text" id="sem_pos" />
      <label for="sem_neg">Negative words (comma separated):</label>
      <input type="text" id="sem_neg" />
      <button onclick="generateSemanticSnippet()">Generate Snippet</button>
      <pre id="sem_output" style="white-space:pre-wrap;"></pre>
    </div>
  `;
  applyInfoTexts(container);
}

function generateSemanticSnippet() {
  const code = document.getElementById("sem_code").value.trim();
  const pos = document.getElementById("sem_pos").value.trim();
  const neg = document.getElementById("sem_neg").value.trim();
  if (!code || !pos || !neg) {
    alert("Please fill in all fields.");
    return;
  }
  const snippet = {
    [code]: {
      positive: pos.split(/,\s*/),
      negative: neg.split(/,\s*/)
    }
  };
  document.getElementById("sem_output").textContent = JSON.stringify(snippet, null, 2);
}
