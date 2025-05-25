const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'interface');
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

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/ethicom.html';
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
