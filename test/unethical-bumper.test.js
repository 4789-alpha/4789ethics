const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {
  containsUnethical,
  requiredConfirmationDiff,
  logUnethical,
  historyFor,
  shouldDemote
} = require('../tools/unethical-bumper');

test('containsUnethical detects words', () => {
  assert.strictEqual(containsUnethical('This is pure fraud', 'en'), true);
  assert.strictEqual(containsUnethical('Clean text', 'en'), false);
});

test('requiredConfirmationDiff by level', () => {
  assert.strictEqual(requiredConfirmationDiff('OP-1'), 2);
  assert.strictEqual(requiredConfirmationDiff('OP-6'), 1);
  assert.strictEqual(requiredConfirmationDiff('OP-9'), 0);
});

test('logUnethical records entries and demotion check', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bumper-'));
  const file = path.join(dir, 'log.json');
  logUnethical('sig', 'fraud', 'en', file);
  logUnethical('sig', 'fraud again', 'en', file);
  logUnethical('sig', 'third fraud', 'en', file);
  const hist = historyFor('sig', file);
  assert.strictEqual(hist.length, 3);
  assert.strictEqual(shouldDemote('sig', 3, file), true);
  fs.rmSync(dir, { recursive: true, force: true });
});
