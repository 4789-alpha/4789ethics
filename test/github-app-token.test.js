const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const { parseAppConfig, createJwt } = require('../tools/github-app-token.js');

test('parses app config', () => {
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'appcfg-'));
  const pemPath = path.join(dir, 'key.pem');
  fs.writeFileSync(pemPath, 'KEY');
  const cfgPath = path.join(dir, 'cfg.yaml');
  fs.writeFileSync(cfgPath, `app_id: 1\ninstallation_id: 2\nprivate_key: ${pemPath}\n`);
  const cfg = parseAppConfig(cfgPath);
  assert.strictEqual(cfg.app_id, '1');
  assert.strictEqual(cfg.installation_id, '2');
  assert.strictEqual(cfg.private_key, 'KEY');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('creates jwt', () => {
  const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const pem = privateKey.export({ type: 'pkcs1', format: 'pem' });
  const jwt = createJwt('42', pem);
  assert.strictEqual(typeof jwt, 'string');
  assert.strictEqual(jwt.split('.').length, 3);
});
