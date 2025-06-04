const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const rootPath = path.join(__dirname, '..', 'permissions', 'op-permissions-expanded.json');
const interfacePath = path.join(__dirname, '..', 'interface', 'op-permissions-expanded.json');

const rootPerm = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const interfacePerm = JSON.parse(fs.readFileSync(interfacePath, 'utf8'));

function restore(file, original) {
  if (original !== null) {
    fs.writeFileSync(file, original);
  } else if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

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

test('denies OP-10 upgrade when user is not digital', () => {
  const usersPath = path.join(__dirname, '..', 'app', 'users.json');
  const backup = fs.existsSync(usersPath) ? fs.readFileSync(usersPath, 'utf8') : null;
  try {
    const user = { id: 'U2', op_level: 'OP-9', auth_verified: true, level_change_ts: null, is_digital: false };
    fs.writeFileSync(usersPath, JSON.stringify([user], null, 2));
    delete require.cache[require.resolve('../tools/serve-interface.js')];
    const { handleLevelUpgrade } = require('../tools/serve-interface.js');
    const req = new (require('node:events')).EventEmitter();
    const res = { status: 0, writeHead(c){this.status=c;}, end(){} };
    handleLevelUpgrade(req, res);
    req.emit('data', JSON.stringify({ id: 'U2', level: 'OP-10' }));
    req.emit('end');
    const stored = JSON.parse(fs.readFileSync(usersPath, 'utf8'))[0];
    assert.strictEqual(res.status, 403);
    assert.strictEqual(stored.op_level, 'OP-9');
  } finally {
    restore(usersPath, backup);
    delete require.cache[require.resolve('../tools/serve-interface.js')];
  }
});

test('allows OP-10 upgrade when digital flag is set', () => {
  const usersPath = path.join(__dirname, '..', 'app', 'users.json');
  const backup = fs.existsSync(usersPath) ? fs.readFileSync(usersPath, 'utf8') : null;
  try {
    const user = { id: 'U3', op_level: 'OP-9', auth_verified: true, level_change_ts: null, is_digital: true };
    fs.writeFileSync(usersPath, JSON.stringify([user], null, 2));
    delete require.cache[require.resolve('../tools/serve-interface.js')];
    const { handleLevelUpgrade } = require('../tools/serve-interface.js');
    const req = new (require('node:events')).EventEmitter();
    const res = { status: 0, writeHead(c){this.status=c;}, end(){} };
    handleLevelUpgrade(req, res);
    req.emit('data', JSON.stringify({ id: 'U3', level: 'OP-10' }));
    req.emit('end');
    const stored = JSON.parse(fs.readFileSync(usersPath, 'utf8'))[0];
    assert.strictEqual(res.status, 200);
    assert.strictEqual(stored.op_level, 'OP-10');
  } finally {
    restore(usersPath, backup);
    delete require.cache[require.resolve('../tools/serve-interface.js')];
  }
});
