const test = require('node:test');
const assert = require('node:assert');
const { enableOP0TestMode, disableOP0TestMode, isOP0TestMode } = require('../interface/op0-testmode.js');

test('OP-0 test mode disabled', () => {
  disableOP0TestMode();
  assert.strictEqual(isOP0TestMode(), false);
  enableOP0TestMode();
  assert.strictEqual(isOP0TestMode(), false);
});
