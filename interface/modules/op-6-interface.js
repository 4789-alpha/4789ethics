// op-6-interface.js – OP-6: Konsensfunktion für anonyme Bewertungen

function initOP6Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>Anonymous Consensus Evaluation (OP-6)</h3>
      <p class="info">You are allowed to calculate a consensus rating from anonymous evaluations.</p>

      <label for="anon_input">Paste anonymous evaluations (JSON array):</label>
      ${help('Use raw JSON from OP-0 evaluations to compute consensus.')}
      <textarea id="anon_input" rows="6" placeholder='[{"src_lvl":"SRC-3"}, {"src_lvl":"SRC-4"}, ...]'></textarea>

      <button onclick="runConsensusCalculation()">Calculate Consensus</button>
    </div>
  `;
}

function runConsensusCalculation() {
  const input = document.getElementById("anon_input").value;
  const output = document.getElementById("output");

  try {
    const votes = JSON.parse(input);
    if (!Array.isArray(votes)) throw new Error("Input is not a JSON array");

    const result = computeAnonymousConsensus(votes); // from ethicom-consensus.js
    result.timestamp = new Date().toISOString();
    result.verifier = "sig-xxxx";
    result.op_level = "OP-6";
    result.status = "consensus_verified";

    output.textContent = JSON.stringify(result, null, 2);
  } catch (e) {
    output.textContent = "Invalid input: " + e.message;
  }
}
