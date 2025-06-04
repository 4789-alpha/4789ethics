// source-search.js – Suche und Überprüfung von Quellen

function initSourceSearch() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Search Sources</h3>
      <input type="text" id="search_query" placeholder="Enter ID or keyword" />
      <button onclick="performSourceSearch()">Search</button>
      <ul id="search_results"></ul>
      <pre id="manifest_output" style="white-space:pre-wrap;"></pre>
    </div>
  `;
}

async function performSourceSearch() {
  const query = document.getElementById("search_query").value.trim().toLowerCase();
  const results = document.getElementById("search_results");
  const output = document.getElementById("manifest_output");
  results.innerHTML = "";
  output.textContent = "";

  const list = [];
  try {
    const candidates = await fetch("../sources/institutions/src-candidates.json").then(r => r.json());
    list.push(...candidates);
  } catch (e) {}

  try {
    const src1 = await fetch("../sources/institutions/src-0001.json").then(r => r.json());
    list.push(src1);
  } catch (e) {}

  const filtered = list.filter(item => {
    return item.source_id.toLowerCase().includes(query) ||
           (item.title && item.title.toLowerCase().includes(query));
  });

  if (!filtered.length) {
    results.innerHTML = `<li>No sources found.</li>`;
    return;
  }

  filtered.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.source_id}: ${item.title}`;
    li.style.cursor = "pointer";
    li.onclick = () => loadManifest(item.source_id);
    results.appendChild(li);
  });
}

async function loadManifest(id) {
  const output = document.getElementById("manifest_output");
  output.textContent = "Loading manifest...";
  try {
    const manifest = await fetch(`../manifests/op-eval-4789-${id}.json`).then(r => r.json());
    output.textContent = JSON.stringify(manifest, null, 2);
  } catch (e) {
    output.textContent = "No manifest found for " + id;
  }
}
