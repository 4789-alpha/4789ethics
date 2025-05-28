const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { gateCheck } = require('../tools/gatekeeper.js');

function createConfig(allow, id = 'singularity') {
  return `gatekeeper:\n  controller: "gstekeeper.local"\n  allow_control: ${allow}\n  local_only: true\n  private_identity: "${id}"`;
}

test('denies control when allow_control is false', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  fs.writeFileSync(file, createConfig('false'));
  assert.strictEqual(gateCheck(file, store), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('allows control when config permits', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  fs.writeFileSync(file, createConfig('true'));
  assert.strictEqual(gateCheck(file, store), true);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('remembers device after first allow', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  fs.writeFileSync(file, createConfig('true'));
  assert.strictEqual(gateCheck(file, store), true);
  fs.writeFileSync(file, createConfig('false'));
  assert.strictEqual(gateCheck(file, store), true);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('requires confirmation for other controller', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  fs.writeFileSync(file, createConfig('true'));
  assert.strictEqual(gateCheck(file, store), true);
  fs.writeFileSync(
    file,
    `gatekeeper:\n  controller: "OTHER"\n  allow_control: false\n  local_only: true\n  private_identity: "singularity"`
  );
  assert.strictEqual(gateCheck(file, store), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('denies control with mismatched identity', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  fs.writeFileSync(file, createConfig('true', 'idA'));
  assert.strictEqual(gateCheck(file, store), true);
  fs.writeFileSync(file, createConfig('true', 'idB'));
  assert.strictEqual(gateCheck(file, store), false);
  fs.rmSync(dir, { recursive: true, force: true });
});
