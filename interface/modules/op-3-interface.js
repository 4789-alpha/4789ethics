// op-3-interface.js – OP-3: Visuelle Bewertung mit SRC-Touchbar und Begründung

function initOP3Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Ethical Evaluation (OP-3)</h3>
      <p class="info">You are submitting a signed evaluation with structured reasoning and visual level selection.</p>

      <label>Select SRC level:</label>
      <div id="src_selector" class="src-selector"></div>

      <label for="comment">Ethical justification (required):</label>
      <textarea id="comment" rows="3" required placeholder="Explain why this source matches the selected SRC level..."></textarea>

      <button onclick="generateVisualManifest()">Submit Evaluation</button>
    </div>
  `;

  initSRCBar(); // Lade visuelle SRC-Leiste
}

function initSRCBar(selected = null) {
  const container = document.getElementById("src_selector");
  if (!container) return;

  const levels = [
    "SRC-0", "SRC-1", "SRC-2", "SRC-3",
    "SRC-4", "SRC-5", "SRC-6", "SRC-7", "SRC-8+"
  ];

  container.innerHTML = "";
  levels.forEach((lvl, i) => {
    const btn = document.createElement("button");
    btn.className = `src-btn src-${i}` + (lvl === selected ? " selected" : "");
    btn.textContent = lvl;
    btn.title = `Ethical depth: ${lvl}`;
    btn.onclick = () => {
      document.querySelectorAll(".src-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      container.setAttribute("data-src", lvl);
    };
    container.appendChild(btn);
  });
}

function generateVisualManifest() {
  const selector = document.getElementById("src_selector");
  const src_lvl = selector.getAttribute("data-src");
  const comment = document.getElementById("comment").value;
  const timestamp = new Date().toISOString();

  if (!src_lvl) {
    alert("Please select an SRC level.");
    return;
  }
  if (!comment.trim()) {
    alert("Please justify your ethical assessment.");
    return;
  }

  const evalData = {
    source_id: "undefined",
    operator: "sig-xxxx",
    op_level: "OP-3",
    src_lvl,
    comment,
    timestamp,
    verified: true,
    weight: 1.0
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);
}
