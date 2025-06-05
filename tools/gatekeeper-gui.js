const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const {
  gateCheck,
  issueTempToken,
  pruneExpiredTokens,
  parseConfig
} = require('./gatekeeper.js');

const port = process.env.GATEKEEPER_GUI_PORT || 8675;
const cfgPath = path.join(__dirname, '..', 'app', 'gatekeeper_config.yaml');
const storePath = path.join(__dirname, '..', 'app', 'gatekeeper_devices.json');
const logPath = path.join(__dirname, '..', 'app', 'gatekeeper_log.json');
const htmlPath = path.join(__dirname, '..', 'interface', 'gatekeeper.html');

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

function serveFile(p, res) {
  const ext = path.extname(p).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  const s = fs.createReadStream(p);
  s.on('error', () => {
    res.statusCode = 404;
    res.end('Not found');
  });
  s.on('open', () => {
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=31536000'
    });
  });
  s.pipe(res);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && urlPath === '/token') {
    const cfg = parseConfig(cfgPath) || {};
    const dur = parseInt(cfg.temp_token_duration || '86400', 10);
    const idHash = cfg.private_identity
      ? crypto.createHash('sha256').update(String(cfg.private_identity)).digest('hex')
      : null;
    const tok = issueTempToken(
      cfg.controller || 'gatekeeper.local',
      storePath,
      idHash,
      dur,
      logPath
    );
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token: tok, expires_in: dur }));
    return;
  }
  if (req.method === 'POST' && urlPath === '/prune') {
    pruneExpiredTokens(storePath);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pruned');
    return;
  }
  if (req.method === 'GET' && urlPath === '/check') {
    const ok = gateCheck(cfgPath, storePath, undefined, logPath);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ allowed: ok }));
    return;
  }
  if (urlPath === '/' || urlPath === '/gatekeeper.html') {
    serveFile(htmlPath, res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Gatekeeper GUI at http://localhost:${port}/gatekeeper.html`);
  });
} else {
  module.exports = server;
}
