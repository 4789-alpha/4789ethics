// signature-generator.js – OP-abhängige Signaturerstellung mit Passwortprüfung

function setupSignatureCreator(containerId = "op_interface", defaultOP = "OP-1") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const showPass = typeof opLevelToNumber === 'function' && opLevelToNumber(defaultOP) >= 6;
  const passField = showPass
    ? `\n      <label for="sig_passport">Passport/ID (stored hashed):</label>\n      <input type="text" id="sig_passport" placeholder="optional" />`
    : "";

  container.innerHTML = `
    <div class="card">
      <h3>Create your ethical signature</h3>
      <p>This signature is required for OP-1 and higher. Your OP level determines password strength.</p>

      <label for="sig_id">Signature ID (e.g. SIG-ABCD-1234-XY9Z):</label>
      <input type="text" id="sig_id" placeholder="sig-XXXX-XXXX-XXXX" />

      <label for="sig_nick">Nickname (optional):</label>
      <input type="text" id="sig_nick" placeholder="your nickname" />

      <label for="sig_pass">Password (kept local):</label>
      <input type="password" id="sig_pass" placeholder="Your password" />${passField}

      <button onclick="generateEthicomSignature('${defaultOP}')">Generate Signature</button>
      <pre id="sig_output" style="white-space:pre-wrap;margin-top:1em;"></pre>
    </div>
  `;
}

function generateEthicomSignature(op_level) {
  const sig = document.getElementById("sig_id").value.trim().toUpperCase();
  const nick = document.getElementById("sig_nick").value.trim();
  const pw = document.getElementById("sig_pass").value;
  const passEl = document.getElementById("sig_passport");
  const passRaw = passEl ? passEl.value.trim() : "";

  const policy = {
    "OP-2": 6,
    "OP-3": 8,
    "OP-4": 10,
    "OP-5": 12,
    "OP-6": 14,
    "OP-7": 16,
    "OP-9": 18,
    "OP-10": 0,
    "OP-11": 0,
    "OP-12": 0
  };

  const required = policy[op_level] || 6;
  if (pw.length < required) {
    alert("Password must be at least " + required + " characters for " + op_level);
    return;
  }

  if (!/^SIG-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(sig)) {
    alert("Signature must match format: SIG-XXXX-XXXX-XXXX");
    return;
  }

  if (sig === "SIG-4789") {
    alert("Signature 'SIG-4789' is reserved and cannot be generated.");
    return;
  }

  const timestamp = new Date().toISOString();
  const raw = sig + "|" + timestamp + "|" + pw;

  const passHashPromise = passRaw ? sha256(passRaw) : Promise.resolve(null);

  Promise.all([sha256(raw), passHashPromise]).then(([hash, passHash]) => {
    const sigObject = {
      id: sig,
      created: timestamp,
      hash,
      protected: true,
      required_length: required,
      op_level: op_level,
      local_only: true
    };
    if (passHash) {
      sigObject.pass_hash = passHash;
    }
    if (nick) {
      sigObject.nickname = nick;
    }

    localStorage.setItem("ethicom_signature", JSON.stringify(sigObject));
    document.getElementById("sig_output").textContent = JSON.stringify(sigObject, null, 2);
    localStorage.removeItem('chat_welcomed');
    alert("Signature created and stored locally.");
  });
}

// sha256 from ethicom-utils.js is required
