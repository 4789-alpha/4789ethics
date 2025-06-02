// revision-overview.js – Show withdrawn or revised manifests

function initRevisionOverview() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Revision & Withdrawal Overview</h3>
      <button onclick="loadWithdrawnList()">Load Withdrawn Manifests</button>
      <ul id="withdraw_list"></ul>
      <pre id="revision_output" style="white-space:pre-wrap;"></pre>
    </div>
  `;
}

async function loadWithdrawnList() {
  const listEl = document.getElementById("withdraw_list");
  const output = document.getElementById("revision_output");
  listEl.innerHTML = "";
  output.textContent = "";
  try {
    const files = await fetch("../manifests/withdrawn/index.json").then(r => r.json());
    files.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      li.style.cursor = "pointer";
      li.onclick = () => loadWithdrawnManifest(f);
      listEl.appendChild(li);
    });
  } catch (e) {
    listEl.innerHTML = `<li>No index found.</li>`;
  }
}

async function loadWithdrawnManifest(file) {
  const output = document.getElementById("revision_output");
  output.textContent = "Loading...";
  try {
    const manifest = await fetch(`../manifests/withdrawn/${file}`).then(r => r.json());
    output.textContent = JSON.stringify(manifest, null, 2);
  } catch (e) {
    output.textContent = "Failed to load " + file;
  }
}
