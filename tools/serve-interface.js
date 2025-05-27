const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

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
      const users = readJson(usersFile);
      users.push({ id, emailHash, pwHash, salt, op_level: 'OP-1' });
      writeJson(usersFile, users);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id }));
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

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && urlPath === '/api/signup') {
    return handleSignup(req, res);
  }
  if (req.method === 'POST' && urlPath === '/api/evaluate') {
    return handleEvaluation(req, res);
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

server.listen(port, () => {
  console.log(`Ethicom interface available at http://localhost:${port}/ethicom.html`);
});
