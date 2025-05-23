function initOP1HumanInterface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  fetch("../sources/persons/human-op0-candidates.json")
    .then(r => r.json())
    .then(list => {
      const options = list.map(p => `<option value="${p.human_id}">${p.name}</option>`).join('');
      container.innerHTML = `
        <div class="card">
          <h3>Person Ethics Check (OP-1)</h3>
          <p class="info" data-info="op-1"></p>

          <label for="human_sel">Select a person:</label>
          <select id="human_sel">${options}</select>

          <label for="ethical_choice">Is this person ethical?</label>
          <select id="ethical_choice">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label for="comment">Ethical justification (required):</label>
          <textarea id="comment" rows="3" required></textarea>

          <button onclick="submitOP1HumanEval()">Submit Evaluation</button>
          <button class="secondary-button" type="button" onclick="initOP1HumanInterface()">Reset</button>
        </div>
      `;
      applyInfoTexts(container);
    });
}

function submitOP1HumanEval() {
  const sel = document.getElementById("human_sel");
  const human_id = sel.value;
  const human_name = sel.options[sel.selectedIndex].textContent;
  const ethical = document.getElementById("ethical_choice").value === "yes";
  const comment = document.getElementById("comment").value.trim();
  if (!comment) {
    alert("Please provide a justification.");
    return;
  }
  const timestamp = new Date().toISOString();

  const evalData = {
    human_id,
    person: human_name,
    ethical,
    operator: "sig-xxxx",
    op_level: "OP-1",
    comment,
    timestamp,
    verified: true,
    weight: 1.0
  };

  const output = document.getElementById("output");
  output.textContent = JSON.stringify(evalData, null, 2);
  triggerSelfReflection("Review your evaluation via structure_9874.");
}
