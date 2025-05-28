const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const events = require('node:events');

const { issueTempToken, gateCheck } = require('../tools/gatekeeper.js');

function sha(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function restore(file, original) {
  if (original !== null) {
    fs.writeFileSync(file, original);
  } else if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

function stubHttps(token, login) {
  const https = require('node:https');
  const original = https.request;
  https.request = (opts, cb) => {
    const res = new events.EventEmitter();
    process.nextTick(() => {
      cb(res);
      const body = opts.hostname === 'github.com'
        ? JSON.stringify({ access_token: token })
        : JSON.stringify({ login });
      res.emit('data', body);
      res.emit('end');
    });
    return { on() {}, write() {}, end() {} };
  };
  return () => { https.request = original; };
}


test('registration hashes email and password as noted in DISCLAIMERS lines 9-10', () => {
  const usersPath = path.join(__dirname, '..', 'app', 'users.json');
  const backup = fs.existsSync(usersPath) ? fs.readFileSync(usersPath, 'utf8') : null;
  const oauthPath = path.join(__dirname, '..', 'app', 'oauth_config.yaml');
  const oauthBackup = fs.existsSync(oauthPath) ? fs.readFileSync(oauthPath, 'utf8') : null;
  try {
    fs.writeFileSync(usersPath, '[]');
    const { handleSignup } = require('../tools/serve-interface.js');
    const body = JSON.stringify({ email: 'user@example.com', password: 'safePass123' });
    const req = new events.EventEmitter();
    const res = { status: 0, endData: '', writeHead(code) { this.status = code; }, end(d) { this.endData = d; } };
    handleSignup(req, res);
    req.emit('data', body);
    req.emit('end');
    assert.strictEqual(res.status, 200);
    const stored = JSON.parse(fs.readFileSync(usersPath, 'utf8'))[0];
    assert.strictEqual(stored.emailHash, sha('user@example.com'));
    assert.ok(!('email' in stored));
    const expectedPwHash = sha('safePass123' + stored.salt);
    assert.strictEqual(stored.pwHash, expectedPwHash);
  } finally {
    restore(usersPath, backup);
    restore(oauthPath, oauthBackup);
    delete require.cache[require.resolve('../tools/serve-interface.js')];
  }
});


test('OAuth login stores hashed identifiers and tokens as noted in DISCLAIMERS lines 12-13', async () => {
  const usersPath = path.join(__dirname, '..', 'app', 'users.json');
  const oauthPath = path.join(__dirname, '..', 'app', 'oauth_config.yaml');
  const backupUsers = fs.existsSync(usersPath) ? fs.readFileSync(usersPath, 'utf8') : null;
  const backupOauth = fs.existsSync(oauthPath) ? fs.readFileSync(oauthPath, 'utf8') : null;
  try {
    fs.writeFileSync(usersPath, '[]');
    fs.writeFileSync(oauthPath, 'github:\n  client_id: "id"\n  client_secret: "sec"');
    delete require.cache[require.resolve('../tools/serve-interface.js')];
    const { handleGithubStart, handleGithubCallback } = require('../tools/serve-interface.js');

    const startReq = { headers: {} };
    const startRes = { headers: {}, writeHead(code, h) { this.headers = h; }, end() {} };
    handleGithubStart(startReq, startRes);
    const redirect = startRes.headers.Location;
    const state = new URL(redirect).searchParams.get('state');

    const restoreHttps = stubHttps('tok123', 'tester');
    const cbReq = { url: `/auth/github/callback?code=abc&state=${state}` };
    const cbRes = { status: 0, writeHead(code) { this.status = code; }, end() {} };
    handleGithubCallback(cbReq, cbRes);
    await new Promise(r => setImmediate(r));
    restoreHttps();

    assert.strictEqual(cbRes.status, 200);
    const stored = JSON.parse(fs.readFileSync(usersPath, 'utf8'))[0];
    assert.strictEqual(stored.githubHash, sha('tester'));
    assert.strictEqual(stored.tokenHash, sha('tok123'));
    assert.ok(!('github' in stored));
  } finally {
    restore(usersPath, backupUsers);
    restore(oauthPath, backupOauth);
    delete require.cache[require.resolve('../tools/serve-interface.js')];
  }
});


test('gatekeeper stores device hashes and no biometric file exists as stated in DISCLAIMERS lines 10-14', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  const cfgFile = path.join(dir, 'cfg.yaml');
  const storeFile = path.join(dir, 'devices.json');
  fs.writeFileSync(cfgFile, 'gatekeeper:\n  controller: "gatekeeper.local"\n  allow_control: true\n  local_only: true\n  private_identity: "id42"');
  const token = issueTempToken('gatekeeper.local', storeFile, null, 60);
  assert.ok(fs.existsSync(storeFile));
  assert.ok(gateCheck(cfgFile, storeFile, token));
  const data = JSON.parse(fs.readFileSync(storeFile, 'utf8'))['gatekeeper.local'];
  const devHash = data.devices[0];
  const tokHash = Object.keys(data.tokens)[0];
  assert.strictEqual(devHash.length, 64);
  assert.strictEqual(tokHash.length, 64);
  const files = fs.readdirSync(dir).filter(f => f.includes('biometric'));
  assert.strictEqual(files.length, 0);
  fs.rmSync(dir, { recursive: true, force: true });
});

