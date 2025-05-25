const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const apiAccessAllowed = require('../tools/api-access.js');

function createState(op, confirmed) {
  return `user:\n  op_level: ${op}\n  progress:\n    ethics_test_passed: ${confirmed}\n  memory:\n    ethics_confirmed: ${confirmed}`;
}

test('denies access for low OP level', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-'));
  const file = path.join(dir, 'user_state.yaml');
  fs.writeFileSync(file, createState('OP-1', true));
  assert.strictEqual(apiAccessAllowed('OP-3', file), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('allows access when level and confirmation meet', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-'));
  const file = path.join(dir, 'user_state.yaml');
  fs.writeFileSync(file, createState('OP-4', true));
  assert.strictEqual(apiAccessAllowed('OP-3', file), true);
  fs.rmSync(dir, { recursive: true, force: true });
});
