const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');
const { search, loadSources } = require('./source-search.js');
const { issueTempToken, parseConfig } = require('./gatekeeper.js');

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

const root = path.join(__dirname, '..', 'interface');
const repoRoot = path.join(__dirname, '..');

// Load optional project configuration
let cfg = {};
try {
  cfg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config.json'), 'utf8'));
} catch {}

const port = process.env.PORT || cfg.port || 8080;
const baseUrl = process.env.BASE_URL || cfg.baseUrl || `http://localhost:${port}`;
const paths = cfg.paths || {};

const usersFile = path.join(repoRoot, paths.users || 'app/users.json');
const evalFile = path.join(repoRoot, paths.evaluations || 'app/evaluations.json');
const connFile = path.join(repoRoot, paths.connections || 'app/connections.json');
const oauthCfg = parseOAuthConfig(paths.oauthConfig ? path.join(repoRoot, paths.oauthConfig) : undefined);
const oauthStates = new Set();
const gateCfgPath = path.join(repoRoot, paths.gatekeeperConfig || 'app/gatekeeper_config.yaml');
const gateStore = path.join(repoRoot, paths.gatekeeperDevices || 'app/gatekeeper_devices.json');
const gateLogPath = path.join(repoRoot, paths.gatekeeperLog || 'app/gatekeeper_log.json');

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
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
}

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function handleSignup(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { email, password, address, phone } = JSON.parse(body);
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(email) || !password || password.length < 8) {
        res.writeHead(400); res.end('Invalid data'); return;
      }
      const id = 'SIG-' + crypto.randomBytes(6).toString('hex').toUpperCase();
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      const salt = crypto.randomBytes(8).toString('hex');
      const pwHash = crypto.createHash('sha256').update(password + salt).digest('hex');
      const addrHash = address ? crypto.createHash('sha256').update(address).digest('hex') : null;
      const phoneHash = phone ? crypto.createHash('sha256').update(phone).digest('hex') : null;
      const secret = generateTotpSecret();
      const users = readJson(usersFile);
      users.push({ id, emailHash, pwHash, salt, op_level: 'OP-1', totpSecret: secret, addrHash, phoneHash });
      writeJson(usersFile, users);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id, secret }));
    } catch {
      res.writeHead(400); res.end('Bad Request');
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
      const users = readJson(usersFile);
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      const user = users.find(u => u.emailHash === emailHash);
      if (!user) { res.writeHead(403); res.end('Invalid credentials'); return; }
      const now = new Date();
      now.setHours(now.getHours() + 4);
      now.setMinutes(now.getMinutes() + 44);
      const suffix = String(now.getHours() % 24).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0');
      if (password.length < 4 || !password.endsWith(suffix)) {
        res.writeHead(403); res.end('Invalid credentials'); return;
      }
      const basePw = password.slice(0, -4);
      const pwHash = crypto.createHash('sha256').update(basePw + user.salt).digest('hex');
      if (pwHash !== user.pwHash) { res.writeHead(403); res.end('Invalid credentials'); return; }
      if (user.totpSecret && !verifyTotp(user.totpSecret, auth_code)) {
        res.writeHead(403); res.end('Invalid credentials'); return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: user.id, op_level: user.op_level }));
    } catch {
      res.writeHead(400); res.end('Bad Request');
    }
  });
}

function handleGithubStart(req, res) {
  if (!oauthCfg || !oauthCfg.github || !oauthCfg.github.client_id) {
    res.writeHead(500); res.end('OAuth not configured'); return;
  }
  const state = crypto.randomBytes(8).toString('hex');
  oauthStates.add(state);
  const url = `https://github.com/login/oauth/authorize?client_id=${oauthCfg.github.client_id}&state=${state}`;
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
              tokenHash
            };
            users.push(user);
          } else {
            user.tokenHash = tokenHash;
          }
          writeJson(usersFile, users);
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
              tokenHash
            };
            users.push(user);
          } else {
            user.tokenHash = tokenHash;
          }
          writeJson(usersFile, users);
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
      const evals = readJson(evalFile);
      const idx = evals.findIndex(e => e.signature === signature && e.source_id === source_id);
      if (idx >= 0) {
        if (levelNum >= 4) {
          evals[idx] = { ...evals[idx], rating, comment, revised: new Date().toISOString() };
        } else {
          res.writeHead(403); res.end('Revision not allowed'); return;
        }
      } else {
        evals.push({ signature, source_id, rating, comment, timestamp: new Date().toISOString() });
      }
      writeJson(evalFile, evals);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch {
      res.writeHead(400); res.end('Bad Request');
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
      const users = readJson(usersFile);
      const from = users.find(u => u.id === id);
      const to = users.find(u => u.id === target_id);
      if (!from || !to) { res.writeHead(400); res.end('Invalid'); return; }
      const cons = readJson(connFile);
      const exists = cons.find(c => c.requester === id && c.target === target_id);
      if (!exists) {
        cons.push({ requester: id, target: target_id, approved: false, timestamp: new Date().toISOString() });
        writeJson(connFile, cons);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch {
      res.writeHead(400); res.end('Bad Request');
    }
  });
}

function handleConnectApprove(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      const { id, requester_id } = JSON.parse(body);
      const cons = readJson(connFile);
      const conn = cons.find(c => c.requester === requester_id && c.target === id);
      if (conn) {
        conn.approved = true;
        conn.approved_at = new Date().toISOString();
        writeJson(connFile, cons);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else { res.writeHead(404); res.end('Not found'); }
    } catch {
      res.writeHead(400); res.end('Bad Request');
    }
  });
}

function handleConnectList(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const id = url.searchParams.get('id');
  const cons = readJson(connFile);
  const users = readJson(usersFile);
  const pending = cons.filter(c => c.target === id && !c.approved).map(c => ({ requester: c.requester }));
  const conns = cons.filter(c => (c.requester === id || c.target === id) && c.approved).map(c => {
    const otherId = c.requester === id ? c.target : c.requester;
    const u = users.find(us => us.id === otherId) || {};
    return { id: otherId, op_level: u.op_level };
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ pending: pending, connections: conns }));
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

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && urlPath === '/api/signup') {
    return handleSignup(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/login') {
    return handleLogin(req, res);
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
  if (req.method === 'GET' && urlPath === '/api/gatekeeper/token') {
    return handleTempToken(req, res);
  }
  if (req.method === 'GET' && urlPath === '/api/sources') {
    return handleSources(req, res);
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
    const git = spawn('git', ['-C', repoRoot, 'archive', '--format=zip', 'HEAD']);
    git.stdout.pipe(res);
    git.on('error', () => {
      res.statusCode = 500;
      res.end('Error creating zip');
    });
    return;
  }
  const filePath = path.join(root, urlPath);
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
  });
} else {
  module.exports = {
    handleSignup,
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
    handleTempToken
  };
}
