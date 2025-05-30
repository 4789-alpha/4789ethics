// op-9-interface.js – OP-9: Nominierung und Spendenprüfung

let op9FailCount = 0;

function checkOP9Fail() {
  if (op9FailCount >= 3) {
    alert("OP-9 failure threshold reached. Consequences apply.");
    const c = document.getElementById("op_interface");
    if (c) c.innerHTML = "<p>OP-9 locked due to repeated failures.</p>";
  }
}

function getOP9Card() {
  return `
    <div class="card">
      <h3>High-Level Operator Actions (OP-9)</h3>
      <p class="info" data-info="op-9"></p>

      <h4>NOMINATION</h4>
      <label for="nominee">Operator Signature (to nominate):</label>
      ${help('Signature ID of the operator you wish to promote.')}
      <input type="text" id="nominee" placeholder="e.g. sig-4321" />

      <label for="target_rank">Target Rank:</label>
      ${help('OP-level the nominee should achieve.')}
      <select id="target_rank">
        <option value="OP-2">OP-2</option>
        <option value="OP-3">OP-3</option>
        <option value="OP-4">OP-4</option>
        <option value="OP-5">OP-5</option>
        <option value="OP-6">OP-6</option>
        <option value="OP-7">OP-7</option>
      </select>

      <label for="reason_nom">Reason for nomination:</label>
      ${help('Provide structural justification for this promotion.')}
      <textarea id="reason_nom" rows="3" placeholder="Explain why this operator qualifies for promotion."></textarea>

      <button onclick="generateNomination()">Nominate</button>

      <hr/>

      <h4>VERIFY DONATION</h4>
      <label for="donation_sum">Visible Amount (CHF):</label>
      ${help('Only the visible part of the donation, not private data.')}
      <input type="number" id="donation_sum" placeholder="e.g. 50" />

      <label for="donation_type">Source Type:</label>
      ${help('Where the donation originates from.')}
      <select id="donation_type">
        <option value="private_individual">Private Individual</option>
        <option value="nonprofit_organization">Nonprofit Organization</option>
        <option value="foundation">Foundation</option>
      </select>

      <button onclick="verifyDonation()">Log Verified Donation</button>
    </div>`;
}

function initOP9Interface() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = getOP9Card();
  applyInfoTexts(container);
}

function generateNomination() {
  const nominee = document.getElementById("nominee").value.trim();
  const target = document.getElementById("target_rank").value;
  const reason = document.getElementById("reason_nom").value.trim();
  const timestamp = new Date().toISOString();

  if (!nominee || !reason) {
    op9FailCount++;
    alert("Please complete the nomination fields.");
    checkOP9Fail();
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
    op9FailCount++;
    alert("Please enter a valid donation amount.");
    checkOP9Fail();
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
