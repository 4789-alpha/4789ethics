// signature-verifier.js – 4789: Signaturprüfung vor OP-Stufenfreigabe

async function verifySignature(minOP = "OP-1") {
  const stored = localStorage.getItem("ethicom_signature");
  if (!stored) {
    return { valid: false, reason: "No local signature found." };
  }

  const sig = JSON.parse(stored);
  const required = {
    "OP-1": 4,
    "OP-2": 6,
    "OP-3": 8,
    "OP-4": 10,
    "OP-5": 12,
    "OP-6": 14,
    "OP-7": 16,
    "OP-7.9": 18
  };

  const minLength = required[minOP] || 6;

  if (!sig.hash || !sig.id || !sig.created) {
    return { valid: false, reason: "Signature data incomplete." };
  }

  const password = prompt(`Enter your password for ${sig.id}:`);
  if (!password || password.length < minLength) {
    return { valid: false, reason: "Password too short or cancelled." };
  }

  const raw = sig.id + "|" + sig.created + "|" + password;
  const hashed = await sha256(raw);

  if (hashed !== sig.hash) {
    return { valid: false, reason: "Hash mismatch – invalid password." };
  }

  return {
    valid: true,
    id: sig.id,
    level: sig.op_level,
    hash: sig.hash,
    created: sig.created
  };
}
