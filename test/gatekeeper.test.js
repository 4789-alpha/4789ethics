const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { gateCheck, issueTempToken, verifyTempToken } = require('../tools/gatekeeper.js');
const crypto = require('node:crypto');

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

test('creates and validates temp token', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const store = path.join(dir, 'devices.json');
  const token = issueTempToken('gstekeeper.local', store, null, 60);
  assert.ok(verifyTempToken('gstekeeper.local', store, token));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('temp token expires', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const store = path.join(dir, 'devices.json');
  const token = issueTempToken('gstekeeper.local', store, null, 60);
  const data = JSON.parse(fs.readFileSync(store, 'utf8'));
  const tokHash = Object.keys(data['gstekeeper.local'].tokens)[0];
  data['gstekeeper.local'].tokens[tokHash] = Date.now() - 1000;
  fs.writeFileSync(store, JSON.stringify(data));
  assert.strictEqual(verifyTempToken('gstekeeper.local', store, token), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('stores hashed address and phone', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  const cfg = `gatekeeper:\n  controller: "gstekeeper.local"\n  allow_control: true\n  local_only: true\n  private_identity: "id"\n  address: "Street 1"\n  phone: "+123"`;
  fs.writeFileSync(file, cfg);
  assert.strictEqual(gateCheck(file, store), true);
  const data = JSON.parse(fs.readFileSync(store, 'utf8'));
  const entry = data['gstekeeper.local'];
  const addrHash = crypto.createHash('sha256').update('Street 1').digest('hex');
  const phoneHash = crypto.createHash('sha256').update('+123').digest('hex');
  assert.strictEqual(entry.address, addrHash);
  assert.strictEqual(entry.phone, phoneHash);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('denies control with mismatched address', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const file = path.join(dir, 'config.yaml');
  const store = path.join(dir, 'devices.json');
  const cfgA = `gatekeeper:\n  controller: "gstekeeper.local"\n  allow_control: true\n  local_only: true\n  private_identity: "id"\n  address: "A"`;
  fs.writeFileSync(file, cfgA);
  assert.strictEqual(gateCheck(file, store), true);
  const cfgB = `gatekeeper:\n  controller: "gstekeeper.local"\n  allow_control: true\n  local_only: true\n  private_identity: "id"\n  address: "B"`;
  fs.writeFileSync(file, cfgB);
  assert.strictEqual(gateCheck(file, store), false);
  fs.rmSync(dir, { recursive: true, force: true });
});
