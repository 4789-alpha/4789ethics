const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function withTempRegistry(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rats-'));
  process.env.RATSELTESTER_PATH = dir;
  const manager = require('../tools/ratseltester-manager.js');
  try {
    fn(manager, dir);
  } finally {
    delete process.env.RATSELTESTER_PATH;
    delete require.cache[require.resolve('../tools/ratseltester-manager.js')];
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('assign and release Ratsältester', () => {
  withTempRegistry(manager => {
    assert.ok(manager.assign('OP-1', 'SIG-1'));
    const current = manager.current('OP-1');
    assert.strictEqual(current.signature, 'SIG-1');
    assert.ok(current.since);

    assert.ok(manager.release('OP-1'));
    assert.strictEqual(manager.current('OP-1'), null);

    assert.ok(manager.assign('OP-1', 'SIG-2'));
    const c2 = manager.current('OP-1');
    assert.strictEqual(c2.signature, 'SIG-2');
  });
});
