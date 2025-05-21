const crypto = require('node:crypto');

const localStorage = {};

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function generateEthicomSignature(id, pw, opLevel = 'OP-1') {
  const policy = {
    'OP-1': 4,
    'OP-2': 6,
    'OP-3': 8,
    'OP-4': 10,
    'OP-5': 12,
    'OP-6': 14,
    'OP-7': 16,
    'OP-9': 18,
    'OP-10': 0,
    'OP-11': 0,
    'OP-12': 0
  };

  const required = policy[opLevel] || 6;
  if (pw.length < required) {
    throw new Error(`Password must be at least ${required} characters`);
  }
  if (!/^SIG-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(id)) {
    throw new Error('Signature must match format: SIG-XXXX-XXXX-XXXX');
  }
  if (id === 'SIG-4789') {
    throw new Error("Signature 'SIG-4789' is reserved and cannot be generated.");
  }
  const created = new Date().toISOString();
  const hash = sha256(`${id}|${created}|${pw}`);
  const obj = { id, created, hash, protected: true, required_length: required, op_level: opLevel, local_only: true };
  localStorage['ethicom_signature'] = JSON.stringify(obj);
  return obj;
}

function verifySignature(pw, minOP = 'OP-1') {
  const storedRaw = localStorage['ethicom_signature'];
  if (!storedRaw) return { valid: false, reason: 'No local signature found.' };
  const stored = JSON.parse(storedRaw);

  const required = {
    'OP-1': 4,
    'OP-2': 6,
    'OP-3': 8,
    'OP-4': 10,
    'OP-5': 12,
    'OP-6': 14,
    'OP-7': 16,
    'OP-11': 18
  };
  const minLength = required[minOP] || 6;
  if (!pw || pw.length < minLength) {
    return { valid: false, reason: 'Password too short or cancelled.' };
  }
  const hashed = sha256(`${stored.id}|${stored.created}|${pw}`);
  if (hashed !== stored.hash) {
    return { valid: false, reason: 'Hash mismatch – invalid password.' };
  }
  return { valid: true, id: stored.id, level: stored.op_level, hash: stored.hash, created: stored.created };
}

function generateAnonymousManifest(src_lvl, comment = '') {
  const timestamp = new Date().toISOString();
  return {
    source_id: 'undefined',
    operator: 'anonymous',
    op_level: 'OP-0',
    src_lvl,
    comment,
    timestamp,
    verified: false,
    weight: 0.05
  };
}

function generateSignedManifest(src_lvl, comment, op_level = 'OP-1') {
  if (!comment.trim()) throw new Error('Comment required for signed evaluation');
  const timestamp = new Date().toISOString();
  return {
    source_id: 'undefined',
    operator: 'sig-xxxx',
    op_level,
    src_lvl,
    comment,
    timestamp,
    verified: true,
    weight: 1.0
  };
}

function main() {
  console.log('=== Generating Signature ===');
  const sig = generateEthicomSignature('SIG-TEST-1234-ABCD', 'pwtest', 'OP-1');
  console.log(sig);

  console.log('\n=== Verifying Signature ===');
  const verify = verifySignature('pwtest', 'OP-1');
  console.log(verify);

  console.log('\n=== Anonymous Evaluation ===');
  const anon = generateAnonymousManifest('SRC-2', 'trial run');
  console.log(anon);

  console.log('\n=== Signed Evaluation ===');
  const signed = generateSignedManifest('SRC-3', 'initial structured evaluation', 'OP-1');
  console.log(signed);
}

if (require.main === module) {
  main();
}
