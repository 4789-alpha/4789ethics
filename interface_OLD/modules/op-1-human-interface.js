function initOP1HumanInterface() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  if (window.opHumanKeyHandler) {
    document.removeEventListener('keydown', window.opHumanKeyHandler);
    window.opHumanKeyHandler = null;
  }
  if (window.touchSettings && window.touchSettings.registerSwipeHandler)
    window.touchSettings.registerSwipeHandler(null);

  fetch("../sources/persons/human-op0-candidates.json")
    .then(r => r.json())
    .then(list => {
      const options = list.map(p => `<option value="${p.human_id}">${p.name}</option>`).join('');
      container.innerHTML = `
        <div class="card swipe-card">
          <h3>Person Ethics Check (OP-1)</h3>
          <p class="info" data-info="op-1"></p>

          <label for="human_sel">Select a person:</label>
          <select id="human_sel">${options}</select>

          <label for="ethical_choice">Is this person ethical?</label>
          <select id="ethical_choice">
            <option value="yes">Yes</option>
            <option value="unclear">Unclear</option>
            <option value="no">No</option>
          </select>

          <label for="comment">Ethical justification (required):</label>
          <textarea id="comment" rows="3" required></textarea>

          <button onclick="submitOP1HumanEval()">Submit Evaluation</button>
          <button class="secondary-button" type="button" onclick="initOP1HumanInterface()">Reset</button>
        </div>
      `;
      applyInfoTexts(container);

      const card = container.querySelector('.swipe-card');
      function handle(dir) {
        if (!card) return;
        card.classList.remove('swipe-left', 'swipe-right', 'swipe-up', 'swipe-down');
        const choiceEl = document.getElementById('ethical_choice');
        if (dir === 'left') choiceEl.value = 'unclear';
        if (dir === 'up') choiceEl.value = 'yes';
        if (dir === 'down') choiceEl.value = 'no';
        if (dir === 'right') {
          const sel = document.getElementById('human_sel');
          const name = sel.options[sel.selectedIndex].textContent;
          alert('Info about ' + name);
        }
        card.classList.add('swipe-' + dir);
        setTimeout(() => card.classList.remove('swipe-left', 'swipe-right', 'swipe-up', 'swipe-down'), 300);
      }

      if (window.touchSettings && window.touchSettings.registerSwipeHandler)
        window.touchSettings.registerSwipeHandler(handle);
      window.opHumanKeyHandler = e => {
        if (e.code === 'ArrowLeft') handle('left');
        if (e.code === 'ArrowUp') handle('up');
        if (e.code === 'ArrowDown') handle('down');
        if (e.code === 'ArrowRight') handle('right');
      };
      document.addEventListener('keydown', window.opHumanKeyHandler);
    });
}

function submitOP1HumanEval() {
  const sel = document.getElementById("human_sel");
  const human_id = sel.value;
  const human_name = sel.options[sel.selectedIndex].textContent;
  const ethical = document.getElementById("ethical_choice").value;
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
