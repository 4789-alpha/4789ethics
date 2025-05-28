async function sha256(message) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(message);
    const buffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  if (typeof require !== 'undefined') {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(message).digest('hex');
  }
  throw new Error('SHA-256 hashing not supported in this environment');
}

if (typeof window !== 'undefined') {
  window.sha256 = sha256;
}

if (typeof module !== 'undefined') {
  module.exports = { sha256 };
}
