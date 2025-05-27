const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');
const { search, loadSources } = require('./source-search.js');

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
const port = process.env.PORT || 8080;
const usersFile = path.join(__dirname, '..', 'app', 'users.json');
const evalFile = path.join(__dirname, '..', 'app', 'evaluations.json');

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
      const { email, password } = JSON.parse(body);
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(email) || !password || password.length < 8) {
        res.writeHead(400); res.end('Invalid data'); return;
      }
      const id = 'SIG-' + crypto.randomBytes(6).toString('hex').toUpperCase();
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      const salt = crypto.randomBytes(8).toString('hex');
      const pwHash = crypto.createHash('sha256').update(password + salt).digest('hex');
      const secret = generateTotpSecret();
      const users = readJson(usersFile);
      users.push({ id, emailHash, pwHash, salt, op_level: 'OP-1', totpSecret: secret });
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
      const pwHash = crypto.createHash('sha256').update(password + user.salt).digest('hex');
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

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && urlPath === '/api/signup') {
    return handleSignup(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/login') {
    return handleLogin(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/evaluate') {
    return handleEvaluation(req, res);
  }
  if (req.method === 'GET' && urlPath === '/api/sources') {
    return handleSources(req, res);
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
    console.log(`Ethicom interface available at http://localhost:${port}/ethicom.html`);
  });
} else {
  module.exports = { handleSignup, handleEvaluation, handleLogin, handleSources };
}
