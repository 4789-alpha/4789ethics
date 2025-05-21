// op-7.9-interface.js – OP-7.9: Nominierung und Spendenprüfung

function initOP79Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <h3>High-Level Operator Actions (OP-7.9)</h3>
      <p class="info">You may nominate operators and verify donations. Every action is binding and will be logged structurally.</p>

      <h4>NOMINATION</h4>
      <label for="nominee">Operator Signature (to nominate):</label>
      <input type="text" id="nominee" placeholder="e.g. sig-4321" />

      <label for="target_rank">Target Rank:</label>
      <select id="target_rank">
        <option value="OP-2">OP-2</option>
        <option value="OP-3">OP-3</option>
        <option value="OP-4">OP-4</option>
        <option value="OP-5">OP-5</option>
        <option value="OP-6">OP-6</option>
        <option value="OP-7">OP-7</option>
      </select>

      <label for="reason_nom">Reason for nomination:</label>
      <textarea id="reason_nom" rows="3" placeholder="Explain why this operator qualifies for promotion."></textarea>

      <button onclick="generateNomination()">Nominate</button>

      <hr/>

      <h4>VERIFY DONATION</h4>
      <label for="donation_sum">Visible Amount (CHF):</label>
      <input type="number" id="donation_sum" placeholder="e.g. 50" />

      <label for="donation_type">Source Type:</label>
      <select id="donation_type">
        <option value="private_individual">Private Individual</option>
        <option value="nonprofit_organization">Nonprofit Organization</option>
        <option value="foundation">Foundation</option>
      </select>

      <button onclick="verifyDonation()">Log Verified Donation</button>
    </div>
  `;
}

function generateNomination() {
  const nominee = document.getElementById("nominee").value.trim();
  const target = document.getElementById("target_rank").value;
  const reason = document.getElementById("reason_nom").value.trim();
  const timestamp = new Date().toISOString();

  if (!nominee || !reason) {
    alert("Please complete the nomination fields.");
    return;
  }

  const nomination = {
    proposed_by: "4789",
    nominee,
    target_rank: target,
    reason,
    timestamp,
    verified: true,
    status: "open"
  };

  document.getElementById("output").textContent = JSON.stringify(nomination, null, 2);
}

function verifyDonation() {
  const amount = parseFloat(document.getElementById("donation_sum").value);
  const type = document.getElementById("donation_type").value;
  const timestamp = new Date().toISOString();

  if (!amount || amount <= 0) {
    alert("Please enter a valid donation amount.");
    return;
  }

  const donation = {
    donation_id: "generated-locally",
    verified_by: "4789",
    verified_on: timestamp,
    verified_as: type,
    visible_sum: amount,
    currency: "CHF",
    status: "verified"
  };

  document.getElementById("output").textContent = JSON.stringify(donation, null, 2);
}
