const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { writeSummary } = require('../tools/anon-input-sync');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'anon-'));
}

test('aggregates anonymous inputs', () => {
  const dir = tmpDir();
  const out = path.join(dir, 'summary.json');
  const inputs = [
    { question_id: 'q1', answer: 'yes', details: 'a', op_level: 'OP-1', alias: 'a@OP-1' },
    { question_id: 'q1', answer: 'no', details: 'long text', op_level: 'OP-3', alias: 'b@OP-3' },
    { question_id: 'q2', answer: 'yes', details: 'c', op_level: 'OP-2', alias: 'c@OP-2' }
  ];
  inputs.forEach((obj, i) => {
    fs.writeFileSync(path.join(dir, `in${i}.json`), JSON.stringify(obj));
  });
  const summary = writeSummary(dir, out);
  assert.strictEqual(summary.q1.count, 2);
  assert.strictEqual(summary.q1.highest_op, 'OP-3');
  assert.strictEqual(summary.q1.detailed_response, 'long text');
  assert.strictEqual(summary.q2.count, 1);
  fs.rmSync(dir, { recursive: true, force: true });
});
