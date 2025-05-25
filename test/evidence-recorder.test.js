const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const saveEvidence = require('../tools/evidence-recorder');

const evidenceDir = path.join(__dirname, '..', 'evidence');

function cleanup(file) {
  try {
    fs.unlinkSync(path.join(evidenceDir, file));
  } catch (err) {
    // ignore
  }
}

test('saveEvidence creates evidence file', () => {
  const data = 'test-evidence';
  const file = saveEvidence(data, 'dev');
  const p = path.join(evidenceDir, file);
  assert.ok(fs.existsSync(p));
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(obj.data, data);
  assert.strictEqual(obj.actor, 'dev');
  assert.ok(obj.hash && obj.hash.length === 64);
  cleanup(file);
});
