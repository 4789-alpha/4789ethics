const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { watchdogCheck, feedWatchdog } = require('../tools/watchdog');

function makeLog(entries) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wd-'));
  const file = path.join(dir, 'log.json');
  fs.writeFileSync(file, JSON.stringify(entries, null, 2));
  return { dir, file };
}

test('watchdog allows when failures below limit', () => {
  const now = Date.now();
  const entries = [
    { ts: now - 1000, action: 'gate_check', success: false },
    { ts: now - 2000, action: 'gate_check', success: false },
    { ts: now - 3000, action: 'gate_check', success: true }
  ];
  const { dir, file } = makeLog(entries);
  assert.strictEqual(watchdogCheck(file, 3, 60000), true);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('watchdog blocks when failures exceed limit', () => {
  const now = Date.now();
  const entries = [
    { ts: now - 1000, action: 'gate_check', success: false },
    { ts: now - 2000, action: 'gate_check', success: false },
    { ts: now - 3000, action: 'gate_check', success: false },
    { ts: now - 4000, action: 'gate_check', success: false }
  ];
  const { dir, file } = makeLog(entries);
  assert.strictEqual(watchdogCheck(file, 3, 60000), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('feedWatchdog appends calming entry', () => {
  const { dir, file } = makeLog([]);
  feedWatchdog(file);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.strictEqual(data.length, 1);
  assert.strictEqual(data[0].action, 'watchdog_feed');
  fs.rmSync(dir, { recursive: true, force: true });
});

