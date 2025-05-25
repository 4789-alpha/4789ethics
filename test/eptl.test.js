const test = require('node:test');
const assert = require('node:assert');
const { verifyHandshake, isELevelValid } = require('../tools/eptl.js');

test('EPTL handshake check', () => {
  assert.strictEqual(verifyHandshake('EPTL-1234'), true);
  assert.strictEqual(verifyHandshake('WRONG'), false);
});

test('E-Level validation', () => {
  assert.strictEqual(isELevelValid(7), true);
  assert.strictEqual(isELevelValid(6), false);
});
