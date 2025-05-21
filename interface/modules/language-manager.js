// language-manager.js – Add or modify UI translations

function initLanguageManager() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Language Management</h3>
      <p class="info">Generate JSON snippets for new UI translations.</p>
      <label for="lang_code">Language Code (ISO 639-1):</label>
      <input type="text" id="lang_code" maxlength="2" />
      <label for="lang_title">Title Text:</label>
      <input type="text" id="lang_title" />
      <label for="lang_source">Label for Source:</label>
      <input type="text" id="lang_source" />
      <label for="lang_level">Label for Ethical Level:</label>
      <input type="text" id="lang_level" />
      <label for="lang_comment">Label for Comment:</label>
      <input type="text" id="lang_comment" />
      <button onclick="generateLangSnippet()">Generate Snippet</button>
      <pre id="lang_output" style="white-space:pre-wrap;"></pre>
    </div>
  `;
}

function generateLangSnippet() {
  const code = document.getElementById("lang_code").value.trim();
  const title = document.getElementById("lang_title").value.trim();
  const src = document.getElementById("lang_source").value.trim();
  const lvl = document.getElementById("lang_level").value.trim();
  const comment = document.getElementById("lang_comment").value.trim();
  if (!code || !title || !src || !lvl || !comment) {
    alert("Please fill in all fields.");
    return;
  }
  const snippet = {
    [code]: {
      title,
      label_source: src,
      label_srclvl: lvl,
      label_aspects: "Optional Aspects",
      label_comment: comment,
      btn_generate: "Show My Evaluation",
      btn_download: "Download as File",
      aspects: []
    }
  };
  document.getElementById("lang_output").textContent = JSON.stringify(snippet, null, 2);
}
