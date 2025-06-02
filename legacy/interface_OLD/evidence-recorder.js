// evidence-recorder.js - store hashed evidence in localStorage
async function recordEvidence(data, actor = 'user') {
  const timestamp = new Date().toISOString();
  const hash = await sha256(data);
  const entry = { actor, timestamp, hash, data };
  const existing = JSON.parse(localStorage.getItem('ethicom_evidence') || '[]');
  existing.push(entry);
  localStorage.setItem('ethicom_evidence', JSON.stringify(existing));
}

function listEvidence() {
  return JSON.parse(localStorage.getItem('ethicom_evidence') || '[]');
}
