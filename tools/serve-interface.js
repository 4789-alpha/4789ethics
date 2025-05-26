const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const https = require('https');

const root = path.join(__dirname, '..', 'interface');
const repoRoot = path.join(__dirname, '..');
const port = process.env.PORT || 8080;

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

function isAllowedHost(hostname) {
  return hostname.endsWith('wikipedia.org');
}

function proxyRequest(req, res) {
  const query = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const target = query.get('url');
  if (!target) {
    res.statusCode = 400;
    res.end('Missing url');
    return;
  }
  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    res.statusCode = 400;
    res.end('Invalid url');
    return;
  }
  if (!isAllowedHost(targetUrl.hostname)) {
    res.statusCode = 403;
    res.end('Host not allowed');
    return;
  }
  const handler = targetUrl.protocol === 'https:' ? https : http;
  const pReq = handler.get(targetUrl.href, r => {
    res.writeHead(r.statusCode || 200, {
      'Content-Type': r.headers['content-type'] || 'text/html',
      'Access-Control-Allow-Origin': '*'
    });
    r.pipe(res);
  });
  pReq.on('error', () => {
    res.statusCode = 500;
    res.end('Error fetching url');
  });
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/proxy?')) {
    proxyRequest(req, res);
    return;
  }
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
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
