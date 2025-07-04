const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');
const { search, loadSources } = require('./source-search.js');
const { issueTempToken, parseConfig } = require('./gatekeeper.js');
const db = require('./db.js');
const { opLevelToNumber } = require('../utils/op-level.js');

const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
if (nodeMajor < 18) {
  console.warn('Node.js 18+ required. Current:', process.versions.node);
}
try {
  require.resolve('canvas');
} catch {
  console.warn('Optional dependency "canvas" missing. Some tools may fail.');
}

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf) {
  let bits = 0, value = 0, out = '';
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += base32Alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += base32Alphabet[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0, value = 0, idx = 0;
  const out = [];
  for (const ch of clean) {
    value = (value << 5) | base32Alphabet.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out[idx++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }
  return Buffer.from(out.slice(0, idx));
}

const totpKey = crypto
  .createHash('sha256')
  .update(process.env.TOTP_SECRET_KEY || 'default_totp_key')
  .digest();

function encryptTotpSecret(secret) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', totpKey, iv);
  const enc = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

function decryptTotpSecret(data) {
  const buf = Buffer.from(data, 'base64');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const enc = buf.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', totpKey, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}

function parseOAuthConfig(filePath) {
  const cfgPath = filePath || path.join(__dirname, '..', 'app', 'oauth_config.yaml');
  if (!fs.existsSync(cfgPath)) return null;
  const lines = fs.readFileSync(cfgPath, 'utf8').split(/\r?\n/);
  const cfg = { github: {}, google: {} };
  let section = null;
  lines.forEach(line => {
    const sec = line.trim().match(/^([a-zA-Z]+):\s*$/);
    if (sec) { section = sec[1].toLowerCase(); return; }
    const m = line.trim().match(/^(client_id|client_secret):\s*(.*)$/);
    if (section && m && cfg[section]) {
      cfg[section][m[1]] = m[2].replace(/['"]/g, '');
    }
  });
  return cfg;
}

function generateTotpSecret() {
  return base32Encode(crypto.randomBytes(10));
}

function totpCode(secret, step) {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(0, 0);
  buf.writeUInt32BE(step, 4);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[19] & 0xf;
  const num = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return String(num).padStart(6, '0');
}

function verifyTotp(secret, code) {
  const t = Math.floor(Date.now() / 30000);
  const c = String(code).padStart(6, '0');
  return [t - 1, t, t + 1].some(step => totpCode(secret, step) === c);
}

const classicNames = {
  CH: ['Raf', 'Lio', 'Mia'],
  DE: ['Max', 'Ben', 'Mia'],
  AT: ['Leo', 'Ina', 'Tob'],
  FR: ['Lou', 'Cam', 'Ari'],
  US: ['Sam', 'Alex', 'Pat'],
  DEFAULT: ['Alex', 'Raf', 'Sam']
};

function suggestNickname(country) {
  const list = classicNames[country] || classicNames.DEFAULT;
  return list[0];
}

const root = path.join(__dirname, '..', 'interface');
const repoRoot = path.join(__dirname, '..');

// Load optional project configuration
let cfg = {};
try {
  cfg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config.json'), 'utf8'));
} catch {}

const port = process.env.PORT || cfg.port || 8080;
const baseUrl = process.env.BASE_URL || cfg.baseUrl || `http://localhost:${port}`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node tools/serve-interface.js');
  console.log('Starts a local server for the Ethicom interface.');
  console.log(`Set PORT or cfg.port to change the port (default ${port}).`);
  console.log('BASE_URL overrides the public origin for OAuth.');
  process.exit(0);
}
if (process.argv.includes('--help-offline')) {
  const helpFile = path.join(repoRoot, 'docs', 'OFFLINE_HELP.md');
  try {
    const txt = fs.readFileSync(helpFile, 'utf8');
    console.log(txt);
  } catch {
    console.log('Offline help not found.');
  }
  process.exit(0);
}
const paths = cfg.paths || {};

const usersFile = path.join(repoRoot, paths.users || 'app/users.json');
const evalFile = path.join(repoRoot, paths.evaluations || 'app/evaluations.json');
const connFile = path.join(repoRoot, paths.connections || 'app/connections.json');
const messagesFile = path.join(repoRoot, paths.messages || 'app/messages.json');
const profileFile = path.join(repoRoot, paths.userprofile || 'app/userprofile.json');
const oauthCfg = parseOAuthConfig(paths.oauthConfig ? path.join(repoRoot, paths.oauthConfig) : undefined);
const oauthStates = new Set();
const gateCfgPath = path.join(repoRoot, paths.gatekeeperConfig || 'app/gatekeeper_config.yaml');
const gateStore = path.join(repoRoot, paths.gatekeeperDevices || 'app/gatekeeper_devices.json');
const gateLogPath = path.join(repoRoot, paths.gatekeeperLog || 'app/gatekeeper_log.json');
const demotionLog = path.join(repoRoot, paths.demotionLog || 'app/demotion_log.json');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  const headers = {
    'Content-Type': type + (type.startsWith('text/') ? '; charset=utf-8' : ''),
    'Cache-Control': 'public, max-age=31536000'
  };
  res.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(res);
}

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function readProfile() {
  const base = db.getProfile();
  const defaults = cfg.defaults || {};
  return { ...defaults, ...base };
}

function writeProfile(data) {
  db.setProfile(data);
}

function logDemotion(userId, filePath) {
  const logFile = filePath || demotionLog;
  const list = readJson(logFile);
  list.push({ id: userId, timestamp: new Date().toISOString() });
  writeJson(logFile, list);
}

function checkPendingDemotions(userPath, logPath) {
  if (userPath || logPath) {
    const users = readJson(userPath || usersFile);
    let changed = false;
    for (const u of users) {
      if (u.op_level === 'OP-4' && u.auth_verified === false && u.level_change_ts) {
        const diff = Date.now() - new Date(u.level_change_ts).getTime();
        if (diff > 96 * 3600 * 1000) {
          u.op_level = 'OP-3';
          u.level_change_ts = new Date().toISOString();
          logDemotion(u.id, logPath);
          changed = true;
        }
      }
    }
    if (changed) writeJson(userPath || usersFile, users);
    return;
  }
  const users = db.getUsers();
  for (const u of users) {
    if (u.op_level === 'OP-4' && u.auth_verified === false && u.level_change_ts) {
      const diff = Date.now() - new Date(u.level_change_ts).getTime();
      if (diff > 96 * 3600 * 1000) {
        u.op_level = 'OP-3';
        u.level_change_ts = new Date().toISOString();
        logDemotion(u.id, logPath);
        db.updateUser(u);
      }
    }
  }
}
function updateAlias(user) {
  if (user && user.nickname) {
    user.alias = `${user.nickname}@${user.op_level}`;
  }
  if (!user.alias) return;
  const name = user.alias.split('@')[0];
  user.alias = `${name}@${user.op_level}`;
}

function setOpLevel(id, level, authCode) {
  const users = db.getUsers();
  const user = users.find(u => u.id === id);
  if (!user) return false;
  if (user.totpSecretEnc &&
      !verifyTotp(decryptTotpSecret(user.totpSecretEnc), authCode)) return false;
  if (['OP-10', 'OP-11', 'OP-12'].includes(level) && !user.is_digital) return false;
  user.op_level = level;
  updateAlias(user);
  db.updateUser(user);
  return true;
}

function handleSignup(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const {
        email,
        password,
        address,
        phone,
        country,
        id_number,
        nickname
      } = JSON.parse(body);
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(email) || !password || password.length < 8) {
        res.writeHead(400); res.end('Invalid data'); return;
      }
      const id = 'SIG-' + crypto.randomBytes(6).toString('hex').toUpperCase();
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      const salt = crypto.randomBytes(8).toString('hex');
      const pwHash = crypto.createHash('sha256').update(password + salt).digest('hex');
      const addrHash = address ? crypto.createHash('sha256').update(address).digest('hex') : null;
      const phoneHash = phone ? crypto.createHash('sha256').update(phone).digest('hex') : null;
      const countryHash = country ? crypto.createHash('sha256').update(country).digest('hex') : null;
      const idHash = id_number ? crypto.createHash('sha256').update(id_number).digest('hex') : null;
      const secret = generateTotpSecret();
      const encSecret = encryptTotpSecret(secret);
      const users = db.getUsers();
      if (idHash && users.some(u => u.idHash === idHash)) {
        res.writeHead(409); res.end('ID already exists'); return;
      }
      const autoNick = suggestNickname(country);
      const user = {
        id,
        emailHash,
        pwHash,
        salt,
        op_level: 'OP-1',
        nickname: nickname || autoNick,
        totpSecretEnc: encSecret,
        addrHash,
        phoneHash,
        countryHash,
        idHash,
        auth_verified: 0,
        is_digital: 0,
        level_change_ts: new Date().toISOString()
      };
      updateAlias(user);
      db.createUser(user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id, secret, alias: user.alias, nickname: user.nickname }));
    } catch (err) {
      console.error('Signup error:', err);
      res.writeHead(400);
      res.end('Bad Request: ' + err.message);
    }
  });
}

function handleLogin(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { email, password, auth_code } = JSON.parse(body);
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(email) || !password) {
        res.writeHead(400); res.end('Invalid data'); return;
      }
      const users = db.getUsers();
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      const user = users.find(u => u.emailHash === emailHash);
      if (!user) { res.writeHead(403); res.end('Invalid credentials'); return; }
      if (password.length < 8) {
        res.writeHead(403); res.end('Invalid credentials'); return;
      }
      const pwHash = crypto.createHash('sha256').update(password + user.salt).digest('hex');
      if (pwHash !== user.pwHash) { res.writeHead(403); res.end('Invalid credentials'); return; }
      if (user.totpSecretEnc &&
          !verifyTotp(decryptTotpSecret(user.totpSecretEnc), auth_code)) {
        res.writeHead(403); res.end('Invalid credentials'); return;
      }
      if (user.op_level === 'OP-4' && user.auth_verified === false && user.level_change_ts) {
        const diff = Date.now() - new Date(user.level_change_ts).getTime();
        if (diff > 96 * 3600 * 1000) {
          user.op_level = 'OP-3';
          user.level_change_ts = new Date().toISOString();
          logDemotion(user.id);
          db.updateUser(user);
        }
      }
      updateAlias(user);
      db.updateUser(user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: user.id, op_level: user.op_level, alias: user.alias, nickname: user.nickname }));
    } catch (err) {
      console.error('Login error:', err);
      res.writeHead(400);
      res.end('Bad Request: ' + err.message);
    }
  });
}

function handleGithubStart(req, res) {
  if (!oauthCfg || !oauthCfg.github || !oauthCfg.github.client_id) {
    res.writeHead(500); res.end('OAuth not configured'); return;
  }
  const state = crypto.randomBytes(8).toString('hex');
  oauthStates.add(state);
  const redirect = encodeURIComponent(`${baseUrl}/auth/github/callback`);
  const url = `https://github.com/login/oauth/authorize?client_id=${oauthCfg.github.client_id}&state=${state}&redirect_uri=${redirect}`;
  res.writeHead(302, { Location: url });
  res.end();
}

function fetchGithubUser(token, cb) {
  const opts = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      'User-Agent': '4789ethics',
      Authorization: `token ${token}`,
      accept: 'application/json'
    }
  };
  const rq = https.request(opts, r => {
    let data = '';
    r.on('data', c => { data += c; });
    r.on('end', () => {
      try { const u = JSON.parse(data); cb(null, u.login); } catch (e) { cb(e); }
    });
  });
  rq.on('error', cb);
  rq.end();
}

function handleGithubCallback(req, res) {
  if (!oauthCfg || !oauthCfg.github || !oauthCfg.github.client_id || !oauthCfg.github.client_secret) {
    res.writeHead(500); res.end('OAuth not configured'); return;
  }
  const u = new URL(req.url, 'http://localhost');
  const code = u.searchParams.get('code');
  const state = u.searchParams.get('state');
  if (!code || !state || !oauthStates.has(state)) {
    res.writeHead(400); res.end('Invalid state'); return;
  }
  oauthStates.delete(state);
  const postData = `client_id=${oauthCfg.github.client_id}&client_secret=${oauthCfg.github.client_secret}&code=${code}`;
  const opts = {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  const ghReq = https.request(opts, ghRes => {
    let body = '';
    ghRes.on('data', c => { body += c; });
    ghRes.on('end', () => {
      try {
        const token = JSON.parse(body).access_token;
        if (!token) { res.writeHead(400); res.end('Auth failed'); return; }
        fetchGithubUser(token, (err, login) => {
          if (err || !login) { res.writeHead(400); res.end('Auth failed'); return; }
          const users = readJson(usersFile);
          const ghHash = crypto.createHash('sha256').update(login).digest('hex');
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
          let user = users.find(u => u.githubHash === ghHash);
          if (!user) {
            user = {
              id: 'SIG-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
              op_level: 'OP-1',
              githubHash: ghHash,
              tokenHash,
              auth_verified: false,
              level_change_ts: new Date().toISOString()
            };
            db.createUser(user);
          } else {
            user.tokenHash = tokenHash;
            db.updateUser(user);
          }
          // ensure sync to JSON
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<script>
            const sig = { id: '${user.id}', op_level: '${user.op_level}', private: { github: '${login}' } };
            localStorage.setItem('ethicom_signature', JSON.stringify(sig));
            window.location.href = '/interface/ethicom.html';
          </script>`);
        });
      } catch {
        res.writeHead(500); res.end('Auth failed');
      }
    });
  });
  ghReq.on('error', () => { res.writeHead(500); res.end('Auth failed'); });
  ghReq.write(postData);
  ghReq.end();
}

function handleGoogleStart(req, res) {
  if (!oauthCfg || !oauthCfg.google || !oauthCfg.google.client_id) {
    res.writeHead(500); res.end('OAuth not configured'); return;
  }
  const state = crypto.randomBytes(8).toString('hex');
  oauthStates.add(state);
  const redirect = encodeURIComponent(`${baseUrl}/auth/google/callback`);
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${oauthCfg.google.client_id}&redirect_uri=${redirect}&response_type=code&scope=openid%20email&state=${state}`;
  res.writeHead(302, { Location: url });
  res.end();
}

function fetchGoogleEmail(token, cb) {
  const opts = {
    hostname: 'www.googleapis.com',
    path: '/oauth2/v2/userinfo',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  };
  const rq = https.request(opts, r => {
    let data = '';
    r.on('data', c => { data += c; });
    r.on('end', () => {
      try { const u = JSON.parse(data); cb(null, u.email); } catch (e) { cb(e); }
    });
  });
  rq.on('error', cb);
  rq.end();
}

function handleGoogleCallback(req, res) {
  if (!oauthCfg || !oauthCfg.google || !oauthCfg.google.client_id || !oauthCfg.google.client_secret) {
    res.writeHead(500); res.end('OAuth not configured'); return;
  }
  const u = new URL(req.url, 'http://localhost');
  const code = u.searchParams.get('code');
  const state = u.searchParams.get('state');
  if (!code || !state || !oauthStates.has(state)) {
    res.writeHead(400); res.end('Invalid state'); return;
  }
  oauthStates.delete(state);
  const redirect = `${baseUrl}/auth/google/callback`;
  const postData = `code=${code}&client_id=${oauthCfg.google.client_id}&client_secret=${oauthCfg.google.client_secret}&redirect_uri=${encodeURIComponent(redirect)}&grant_type=authorization_code`;
  const opts = {
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  const gReq = https.request(opts, gRes => {
    let body = '';
    gRes.on('data', c => { body += c; });
    gRes.on('end', () => {
      try {
        const token = JSON.parse(body).access_token;
        if (!token) { res.writeHead(400); res.end('Auth failed'); return; }
        fetchGoogleEmail(token, (err, email) => {
          if (err || !email) { res.writeHead(400); res.end('Auth failed'); return; }
          const users = readJson(usersFile);
          const gHash = crypto.createHash('sha256').update(email).digest('hex');
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
          let user = users.find(u => u.googleHash === gHash);
          if (!user) {
            user = {
              id: 'SIG-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
              op_level: 'OP-1',
              googleHash: gHash,
              tokenHash,
              auth_verified: false,
              level_change_ts: new Date().toISOString()
            };
            db.createUser(user);
          } else {
            user.tokenHash = tokenHash;
            db.updateUser(user);
          }
          // ensure sync to JSON
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<script>
            const sig = { id: '${user.id}', op_level: '${user.op_level}', private: { google: '${email}' } };
            localStorage.setItem('ethicom_signature', JSON.stringify(sig));
            window.location.href = '/interface/ethicom.html';
          </script>`);
        });
      } catch {
        res.writeHead(500); res.end('Auth failed');
      }
    });
  });
  gReq.on('error', () => { res.writeHead(500); res.end('Auth failed'); });
  gReq.write(postData);
  gReq.end();
}

function handleEvaluation(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const { signature, source_id, rating, comment, op_level } = data;
      const levelNum = parseFloat(String(op_level).replace('OP-', '')) || 0;
      const existing = db.getEvaluations().find(e => e.signature === signature && e.source_id === source_id);
      if (existing) {
        if (levelNum >= 4) {
          db.createOrUpdateEvaluation({ signature, source_id, rating, comment, revised: new Date().toISOString(), timestamp: existing.timestamp });
        } else {
          res.writeHead(403); res.end('Revision not allowed'); return;
        }
      } else {
        db.createOrUpdateEvaluation({ signature, source_id, rating, comment, timestamp: new Date().toISOString(), revised: null });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error('Evaluation error:', err);
      res.writeHead(400);
      res.end('Bad Request: ' + err.message);
    }
  });
}

function handleSources(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const type = url.searchParams.get('type') || 'person';
  const query = url.searchParams.get('q');
  const limit = parseInt(url.searchParams.get('limit') || '0', 10);
  let items = [];
  if (query) {
    items = search(query, { type, limit: limit || 5 });
  } else {
    items = loadSources(type);
    if (limit > 0) items = items.slice(0, limit);
  }
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(items));
}

function handleConnectRequest(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { id, target_id } = JSON.parse(body);
      const users = db.getUsers();
      const from = users.find(u => u.id === id);
      const to = users.find(u => u.id === target_id);
      if (!from || !to) { res.writeHead(400); res.end('Invalid'); return; }
      const cons = db.getConnections();
      const exists = cons.find(c => c.requester === id && c.target === target_id);
      if (!exists) {
        db.createConnection({ requester: id, target: target_id, approved: 0, timestamp: new Date().toISOString(), approved_at: null });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error('Connect request error:', err);
      res.writeHead(400);
      res.end('Bad Request: ' + err.message);
    }
  });
}

function handleConnectApprove(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { id, requester_id } = JSON.parse(body);
      const cons = db.getConnections();
      const conn = cons.find(c => c.requester === requester_id && c.target === id);
      if (conn) {
        conn.approved = 1;
        conn.approved_at = new Date().toISOString();
        db.updateConnection(conn);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else { res.writeHead(404); res.end('Not found'); }
    } catch (err) {
      console.error('Connect approve error:', err);
      res.writeHead(400);
      res.end('Bad Request: ' + err.message);
    }
  });
}

function handleConnectList(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const id = url.searchParams.get('id');
  const cons = db.getConnections();
  const users = db.getUsers();
  const pending = cons.filter(c => c.target === id && !c.approved).map(c => ({ requester: c.requester }));
  const conns = cons.filter(c => (c.requester === id || c.target === id) && c.approved).map(c => {
    const otherId = c.requester === id ? c.target : c.requester;
    const u = users.find(us => us.id === otherId) || {};
    return { id: otherId, op_level: u.op_level };
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ pending: pending, connections: conns }));
}

function handleChatSend(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { from, to, text } = JSON.parse(body);
      if (!from || !to || !text) { res.writeHead(400); res.end('Invalid'); return; }
      const cons = readJson(connFile);
      const ok = cons.some(c => c.approved && ((c.requester === from && c.target === to) || (c.requester === to && c.target === from)));
      if (!ok) { res.writeHead(403); res.end('Not connected'); return; }
      const msgs = readJson(messagesFile);
      msgs.push({ from, to, text, timestamp: new Date().toISOString() });
      writeJson(messagesFile, msgs);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(400);
      res.end('Bad Request');
    }
  });
}

function handleChatList(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const user = url.searchParams.get('user');
  const target = url.searchParams.get('target');
  if (!user || !target) { res.writeHead(400); res.end('Invalid'); return; }
  const cons = readJson(connFile);
  const ok = cons.some(c => c.approved && ((c.requester === user && c.target === target) || (c.requester === target && c.target === user)));
  if (!ok) { res.writeHead(403); res.end('Not connected'); return; }
  const msgs = readJson(messagesFile);
  const list = msgs.filter(m => (m.from === user && m.to === target) || (m.from === target && m.to === user));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ messages: list }));
}

function handleProfile(req, res) {
  if (req.method === 'GET') {
    const data = readProfile();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const cur = readProfile();
        const merged = { ...cur, ...incoming };
        writeProfile(merged);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  } else {
    res.writeHead(405);
    res.end('Not Allowed');
  }
}

function handleLevelUpgrade(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { id, level } = JSON.parse(body);
      const users = db.getUsers();
      const user = users.find(u => u.id === id);
      if (!user || !level) { res.writeHead(400); res.end('Invalid'); return; }
      if (['OP-10', 'OP-11', 'OP-12'].includes(level) && !user.is_digital) {
        res.writeHead(403); res.end('digital required'); return;
      }
      user.op_level = level;
      let warning = null;
      if (level === 'OP-4') {
        if (!user.auth_verified) {
          if (!user.level_change_ts) user.level_change_ts = new Date().toISOString();
          warning = 'auth not verified';
        } else {
          user.level_change_ts = new Date().toISOString();
        }
      } else {
        user.level_change_ts = new Date().toISOString();
      }
      db.updateUser(user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: user.id, op_level: user.op_level, warning }));
    } catch (err) {
      console.error('Level upgrade error:', err);
      res.writeHead(400);
      res.end('Bad Request: ' + err.message);
    }
  });
}

function handleTempToken(req, res) {
  const cfg = parseConfig(gateCfgPath) || {};
  const dur = parseInt(cfg.temp_token_duration || '86400', 10);
  const idHash = cfg.private_identity ? crypto.createHash('sha256').update(String(cfg.private_identity)).digest('hex') : null;
  const token = issueTempToken(
    cfg.controller || 'gatekeeper.local',
    gateStore,
    idHash,
    dur,
    gateLogPath
  );
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ token: token, expires_in: dur }));
}

// Simple example route to allow GET and POST for testing
function handleData(req, res) {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('GET erlaubt');
  } else if (req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('POST erlaubt');
  } else {
    res.writeHead(405);
    res.end('Not Allowed');
  }
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && urlPath === '/api/signup') {
    return handleSignup(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/login') {
    return handleLogin(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/upgrade') {
    return handleLevelUpgrade(req, res);
  }
  if (req.method === 'GET' && urlPath === '/auth/github') {
    return handleGithubStart(req, res);
  }
  if (req.method === 'GET' && urlPath === '/auth/github/callback') {
    return handleGithubCallback(req, res);
  }
  if (req.method === 'GET' && urlPath === '/auth/google') {
    return handleGoogleStart(req, res);
  }
  if (req.method === 'GET' && urlPath === '/auth/google/callback') {
    return handleGoogleCallback(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/evaluate') {
    return handleEvaluation(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/connect/request') {
    return handleConnectRequest(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/connect/approve') {
    return handleConnectApprove(req, res);
  }
  if (req.method === 'GET' && urlPath === '/api/connect/list') {
    return handleConnectList(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/chat/send') {
    return handleChatSend(req, res);
  }
  if (req.method === 'GET' && urlPath === '/api/chat/list') {
    return handleChatList(req, res);
  }
  if (req.method === 'GET' && urlPath === '/api/gatekeeper/token') {
    return handleTempToken(req, res);
  }
  if (urlPath === '/api/profile') {
    return handleProfile(req, res);
  }
  if ((req.method === 'GET' || req.method === 'POST') && urlPath === '/api/data') {
    return handleData(req, res);
  }
  if (req.method === 'GET' && urlPath === '/api/sources') {
    return handleSources(req, res);
  }
  if (req.method === 'GET' && urlPath.startsWith('/api/explorer')) {
    const u = new URL(req.url, baseUrl);
    const rel = u.searchParams.get('path') || '';
    const safe = path.normalize(rel).replace(/^(\.\.\/?)+/, '');
    const target = path.join(root, safe);
    return fs.promises.readdir(target, { withFileTypes: true })
      .then(entries => {
        const data = entries.map(e => ({ name: e.name, dir: e.isDirectory() }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(() => {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
      });
  }
  if (req.method === 'GET' && urlPath === '/config.json') {
    return serveFile(path.join(repoRoot, 'config.json'), res);
  }
  if (urlPath === '/' || urlPath === '') urlPath = '/ethicom.html';
  if (urlPath === '/download.zip') {
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="ethics-structure.zip"'
    });
    const git = spawn('git', [
      '-C', repoRoot,
      'archive',
      '--format=zip',
      'HEAD',
      ':!*.png',
      ':!*.jpg',
      ':!*.jpeg',
      ':!*.gif',
      ':!*.svg',
      ':!*.webp'
    ]);
    git.stdout.pipe(res);
    git.on('error', () => {
      res.statusCode = 500;
      res.end('Error creating zip');
    });
    return;
  }
  const safePath = urlPath.replace(/^\/+/, '');
  const filePath = path.join(root, safePath);
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(filePath, res);
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
});

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Ethicom interface available at ${baseUrl}/ethicom.html`);
    console.log('Run "node tools/serve-interface.js --help-offline" for offline help.');
  });
} else {
  module.exports = {
    handleSignup,
    updateAlias,
    handleEvaluation,
    handleLogin,
    handleSources,
    handleGithubStart,
    handleGithubCallback,
    handleGoogleStart,
    handleGoogleCallback,
    handleConnectRequest,
    handleConnectApprove,
    handleConnectList,
    handleChatSend,
    handleChatList,
    handleTempToken,
    handleProfile,
    handleData,
    handleLevelUpgrade,
    checkPendingDemotions,
    setOpLevel,
    suggestNickname
  };
}
