function initSourceIntegrator() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Source Integration</h3>
      <label for="src_query">Source Name:</label>
      <input type="text" id="src_query" placeholder="Enter source name" />
      <button onclick="searchDDG()">Search DuckDuckGo</button>
      <div id="ddg_result" style="margin-top:1em;"></div>
      <label for="src_rating" style="display:block;margin-top:1em;">Ethical?</label>
      <select id="src_rating">
        <option value="yes">Yes</option>
        <option value="partial">Partly</option>
        <option value="no">No</option>
      </select>
      <button style="margin-left:1em;" onclick="submitSourceRating()">Save Rating</button>
    </div>
  `;
}

async function searchDDG() {
  const q = document.getElementById("src_query").value.trim();
  const out = document.getElementById("ddg_result");
  if (!q) { out.textContent = ""; return; }
  out.textContent = "Searching...";
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&no_html=1`;
  try {
    const data = await fetch(url).then(r => r.json());
    if (data.AbstractURL) {
      out.innerHTML = `<p><a href="${data.AbstractURL}" target="_blank">${data.Heading}</a></p><p>${data.AbstractText || ''}</p>`;
    } else if (data.RelatedTopics && data.RelatedTopics.length) {
      const t = data.RelatedTopics[0];
      out.innerHTML = `<p><a href="${t.FirstURL}" target="_blank">${t.Text}</a></p>`;
    } else {
      out.textContent = "No results.";
    }
  } catch (e) {
    out.textContent = "Search failed.";
  }
}

function submitSourceRating() {
  const q = document.getElementById("src_query").value.trim();
  const rating = document.getElementById("src_rating").value;
  const timestamp = new Date().toISOString();
  const evalData = { source: q, rating, timestamp };
  const out = document.getElementById("ddg_result");
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(evalData, null, 2);
  out.appendChild(pre);
  if (typeof recordEvidence === "function") {
    recordEvidence(JSON.stringify(evalData), "user");
  }
}
