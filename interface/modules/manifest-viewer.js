// manifest-viewer.js – View evaluation manifests

function initManifestViewer() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Manifest Viewer</h3>
      <label for="manifest_id">Manifest filename:</label>
      <input type="text" id="manifest_id" placeholder="e.g. op-eval-4789-src-0001.json" />
      <button onclick="loadManifestFile()">Load Manifest</button>
      <pre id="manifest_view" style="white-space:pre-wrap;"></pre>
    </div>
  `;
}

async function loadManifestFile() {
  const id = document.getElementById("manifest_id").value.trim();
  const output = document.getElementById("manifest_view");
  if (!id) {
    alert("Please specify a manifest filename.");
    return;
  }
  output.textContent = "Loading manifest...";
  try {
    const manifest = await fetch(`../manifests/${id}`).then(r => r.json());
    output.textContent = JSON.stringify(manifest, null, 2);
  } catch (e) {
    output.textContent = "Manifest not found.";
  }
}
