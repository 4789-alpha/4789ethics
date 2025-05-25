const test = require('node:test');
const assert = require('node:assert');
const { getSignatureStrength } = require('../interface/signature-strength.js');

test('signature strength defaults to 1 below OP-8', () => {
  assert.strictEqual(getSignatureStrength('OP-3'), 1);
  assert.strictEqual(getSignatureStrength('OP-7'), 1);
});

test('signature strength increases for high OP levels', () => {
  assert.strictEqual(getSignatureStrength('OP-8'), 2);
  assert.strictEqual(getSignatureStrength('OP-9'), 3);
  assert.strictEqual(getSignatureStrength('OP-10'), 4);
});
