const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, '..', 'tools', 'generate-gatekeeper-image.js');

function runScript(dir) {
  return spawnSync('node', [script, dir, '60'], { encoding: 'utf8' });
}

test('creates gatekeeper image with token', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gimg-'));
  const res = runScript(dir);
  assert.strictEqual(res.status, 0);
  const tokenFile = path.join(dir, 'temp_token.txt');
  const gkFile = path.join(dir, 'gatekeeper.js');
  const cfgFile = path.join(dir, 'gatekeeper_config.yaml');
  assert.ok(fs.existsSync(tokenFile));
  assert.ok(fs.existsSync(gkFile));
  assert.ok(fs.existsSync(cfgFile));
  const token = fs.readFileSync(tokenFile, 'utf8').trim();
  assert.ok(/^[a-f0-9]{32}$/.test(token));
  fs.rmSync(dir, { recursive: true, force: true });
});

