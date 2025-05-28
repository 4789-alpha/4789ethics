const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { evaluateReliability, qualifiesForDemotion, recordReliability } = require('../tools/reliability-monitor');

const tmpDir = path.join(__dirname, 'tmp-rel');

function cleanup() {
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}

cleanup();
fs.mkdirSync(tmpDir, { recursive: true });

const logFile = path.join(tmpDir, 'log.json');

test('evaluateReliability computes ratio', () => {
  const r = evaluateReliability(2, 10);
  assert.strictEqual(r, 0.8);
});

test('qualifiesForDemotion returns true when below 90% with enough entries', () => {
  assert.strictEqual(qualifiesForDemotion(3, 25), true);
});

test('qualifiesForDemotion returns true when ratio exceeds one third', () => {
  assert.strictEqual(qualifiesForDemotion(9, 20), true);
});

test('recordReliability writes entry', () => {
  const entry = recordReliability('OP-3', 'sig-temp', 1, 5, logFile);
  const data = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  assert.strictEqual(data.length, 1);
  assert.strictEqual(data[0].temp_signature, 'sig-temp');
  assert.strictEqual(entry.invalid_entries, 1);
  cleanup();
});
