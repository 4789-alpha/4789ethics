// op-7-interface.js – OP-7: Bewertungsüberschreibung mit Begründung

function initOP7Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Override Evaluation (OP-7)</h3>
      <p class="info" data-info="op-7"></p>

      <label for="original_id">Manifest to override:</label>
      ${help('Filename of the evaluation you want to replace.')}
      <input type="text" id="original_id" placeholder="e.g. op-eval-4321-src-0011.json" />

      <label for="new_src">New SRC level:</label>
      ${help('Higher ethical level you assign in place of the previous one.')}
      <select id="new_src">
        <option value="SRC-1">SRC-1</option>
        <option value="SRC-2">SRC-2</option>
        <option value="SRC-3">SRC-3</option>
        <option value="SRC-4">SRC-4</option>
        <option value="SRC-5">SRC-5</option>
      </select>

      <label for="justification">Reason (required):</label>
      ${help('Explain why your higher OP-level justifies this override.')}
      <textarea id="justification" rows="3" required placeholder="Why do you override this evaluation?"></textarea>

      <label for="image_upload">Attach Image:</label>
      <input type="file" id="image_upload" accept="image/*" />

      <button onclick="generateOverride()">Create Override</button>
      </div>
  `;
  applyInfoTexts(container);
}

async function generateOverride() {
  const original_id = document.getElementById("original_id").value.trim();
  const new_src = document.getElementById("new_src").value;
  const justification = document.getElementById("justification").value.trim();
  const imageFile = document.getElementById("image_upload").files[0];
  const timestamp = new Date().toISOString();

  if (!original_id || !justification) {
    alert("All fields are required.");
    return;
  }

  const override = {
    operator: "sig-xxxx",
    op_level: "OP-7",
    timestamp,
    overrides: original_id,
    new_src_lvl: new_src,
    reason: justification,
    image: null,
    verified: true,
    weight: 1.25
  };

  if (imageFile) {
    override.image = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = () => res(null);
      reader.readAsDataURL(imageFile);
    });
  }

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(override, null, 2);

  if (typeof recordEvidence === "function") {
    recordEvidence(JSON.stringify(override), "operator");
  }
}
