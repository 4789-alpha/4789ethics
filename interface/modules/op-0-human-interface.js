function initOP0HumanInterface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  fetch("../sources/persons/human-op0-candidates.json")
    .then(r => r.json())
    .then(list => {
      const options = list.map(p => `<option value="${p.human_id}">${p.name}</option>`).join('');
      container.innerHTML = `
        <div class="card">
          <h3>Person Ethics Check (OP-0)</h3>
          <p class="info" data-info="op-0"></p>

          <label for="human_sel">Select a person:</label>
          <select id="human_sel">${options}</select>

          <label for="ethical_choice">Is this person ethical?</label>
          <select id="ethical_choice">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label for="comment">Optional comment:</label>
          <textarea id="comment" rows="3" placeholder="(optional)"></textarea>

          <button onclick="submitOP0HumanEval()">Evaluate</button>
          <button class="secondary-button" type="button" onclick="initOP0HumanInterface()">Reset</button>
        </div>
      `;
      applyInfoTexts(container);
    });
}

function submitOP0HumanEval() {
  const sel = document.getElementById("human_sel");
  const human_id = sel.value;
  const human_name = sel.options[sel.selectedIndex].textContent;
  const ethical = document.getElementById("ethical_choice").value === "yes";
  const comment = document.getElementById("comment").value;
  const timestamp = new Date().toISOString();

  const evalData = {
    human_id,
    person: human_name,
    ethical,
    operator: "anonymous",
    op_level: "OP-0",
    comment,
    timestamp,
    verified: false,
    weight: 0.05
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);

  if (typeof isOP0TestMode === 'function' && isOP0TestMode()) {
    output.textContent += "\n(Test mode active: data not saved)";
  } else if (typeof recordEvidence === "function") {
    recordEvidence(JSON.stringify(evalData), "user");
  }
}
