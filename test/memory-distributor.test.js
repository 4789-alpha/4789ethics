const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { distributeMemory } = require('../tools/memory-distributor');

test('allocates units among active users', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mem-'));
  const file = path.join(dir, 'mem.json');
  const cfg = {
    total_units: 90,
    users: { A: { active: true, units: 0 }, B: { active: true, units: 0 } },
    gatekeepers: { G: { active: true, active_since: '2024-01-01T00:00:00Z' } }
  };
  fs.writeFileSync(file, JSON.stringify(cfg));
  assert.ok(distributeMemory(file));
  const out = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.strictEqual(out.users.A.units, 45);
  assert.strictEqual(out.users.B.units, 45);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('skips when no active users', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mem-'));
  const file = path.join(dir, 'mem.json');
  const cfg = {
    total_units: 50,
    users: { A: { active: false, units: 0 } },
    gatekeepers: { G: { active: true, active_since: '2024-01-01T00:00:00Z' } }
  };
  fs.writeFileSync(file, JSON.stringify(cfg));
  assert.strictEqual(distributeMemory(file), false);
  fs.rmSync(dir, { recursive: true, force: true });
});
