const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { spawn } = require('child_process');
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

let serverProcess = null;

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
  const stream = fs.createReadStream(p);
  stream.on('error', () => {
    res.statusCode = 404;
    res.end('Not found');
  });
  res.writeHead(200, { 'Cache-Control': 'public, max-age=31536000' });
  stream.pipe(res);
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
  if (req.method === 'POST' && urlPath === '/install') {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npm, ['install'], { stdio: 'inherit' });
    child.on('exit', code => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(code === 0 ? 'done' : 'error');
    });
    return;
  }
  if (req.method === 'POST' && urlPath === '/tests') {
    const run = spawn('node', ['--test'], { stdio: 'inherit' });
    run.on('exit', code => {
      if (code === 0) {
        const chk = spawn('node', ['tools/check-translations.js'], { stdio: 'inherit' });
        chk.on('exit', code2 => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(code2 === 0 ? 'ok' : 'fail');
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('fail');
      }
    });
    return;
  }
  if (req.method === 'POST' && urlPath === '/start-server') {
    if (serverProcess) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('already running');
      return;
    }
    serverProcess = spawn('node', [path.join(__dirname, 'serve-interface.js')], { stdio: 'inherit' });
    serverProcess.on('exit', () => { serverProcess = null; });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('started');
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
