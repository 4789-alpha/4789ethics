const http = require('http');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const disclaimers = [
  'Diese Struktur wird ohne Gewährleistung bereitgestellt.',
  'Die Nutzung erfolgt auf eigene Verantwortung.',
  '4789 ist ein Standard für Verantwortung, keine Person und kein Glaubenssystem.',
  'Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung.'
];

disclaimers.forEach(l => console.log(l));
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Fortfahren? (yes/no) ', answer => {
  rl.close();
  const ok = ['yes', 'y', 'ja', 'j', 'si', 'sí', 'sim', 'oui', 'da', 'hai', 'ok', 'okay'];
  if (!ok.includes(answer.trim().toLowerCase())) {
    console.log('Abbruch.');
    process.exit(1);
  }

  const port = process.env.TIME_GUI_PORT || 8765;
  const htmlPath = path.join(__dirname, '..', 'interface', 'time-tool.html');

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '/time-tool.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(htmlPath).pipe(res);
      return;
    }
    if (req.method === 'GET' && urlPath === '/time') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ time: new Date().toISOString() }));
      return;
    }
    res.statusCode = 404;
    res.end('Not found');
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}/time-tool.html`;
    console.log(`Time GUI at ${url}`);
  });
});
