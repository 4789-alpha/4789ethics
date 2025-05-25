const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { gateCheck } = require('../tools/gatekeeper.js');

function createConfig(allow) {
  return `gatekeeper:\n  controller: "RL@RLpi"\n  allow_control: ${allow}\n  local_only: true`;
}

test('denies control when allow_control is false', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  fs.writeFileSync(file, createConfig('false'));
  assert.strictEqual(gateCheck(file), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('allows control when config permits', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  fs.writeFileSync(file, createConfig('true'));
  assert.strictEqual(gateCheck(file), true);
  fs.rmSync(dir, { recursive: true, force: true });
});
