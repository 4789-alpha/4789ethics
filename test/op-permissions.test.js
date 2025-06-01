const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const rootPath = path.join(__dirname, '..', 'permissions', 'op-permissions-expanded.json');
const interfacePath = path.join(__dirname, '..', 'interface', 'op-permissions-expanded.json');

const rootPerm = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const interfacePerm = JSON.parse(fs.readFileSync(interfacePath, 'utf8'));

test('op-permissions files match', () => {
  assert.deepStrictEqual(rootPerm, interfacePerm);
});

test('automatic demotion after 96h without verification', () => {
  const tmp = fs.mkdtempSync(path.join(__dirname, 'demote-'));
  const usersFile = path.join(tmp, 'users.json');
  const logFile = path.join(tmp, 'log.json');
  const past = new Date(Date.now() - 97 * 3600 * 1000).toISOString();
  fs.writeFileSync(usersFile, JSON.stringify([{ id: 'U1', op_level: 'OP-4', auth_verified: false, level_change_ts: past }], null, 2));
  fs.writeFileSync(logFile, '[]');
  delete require.cache[require.resolve('../tools/serve-interface.js')];
  const { checkPendingDemotions } = require('../tools/serve-interface.js');
  checkPendingDemotions(usersFile, logFile);
  const after = JSON.parse(fs.readFileSync(usersFile, 'utf8'))[0];
  assert.strictEqual(after.op_level, 'OP-3');
  const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  assert.strictEqual(log.length, 1);
  fs.rmSync(tmp, { recursive: true, force: true });
});
