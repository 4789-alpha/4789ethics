const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { getOpFunction } = require('../tools/op-functions.js');

function createState(op, confirmed) {
  return `user:\n  op_level: ${op}\n  progress:\n    ethics_test_passed: ${confirmed}\n  memory:\n    ethics_confirmed: ${confirmed}`;
}

test('denies function for insufficient level', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'opfunc-'));
  const file = path.join(dir, 'user_state.yaml');
  fs.writeFileSync(file, createState('OP-1', true));
  const fn = getOpFunction('analyze', file);
  assert.strictEqual(fn, null);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('grants function when level meets requirement', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'opfunc-'));
  const file = path.join(dir, 'user_state.yaml');
  fs.writeFileSync(file, createState('OP-7', true));
  const fn = getOpFunction('optimize', file);
  assert.strictEqual(typeof fn, 'function');
  assert.strictEqual(fn(), 'Optimization done.');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('log function returns recent commits', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'opfunc-'));
  const file = path.join(dir, 'user_state.yaml');
  fs.writeFileSync(file, createState('OP-2', true));
  const fn = getOpFunction('log', file);
  assert.strictEqual(typeof fn, 'function');
  const out = fn();
  assert.ok(out.includes('\n'));
  fs.rmSync(dir, { recursive: true, force: true });
});
