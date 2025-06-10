const { spawn } = require('child_process');
const path = require('path');
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
  if (answer.trim() !== 'yes') {
    console.log('Abbruch.');
    process.exit(1);
  }

  const server = spawn('node', [path.join(__dirname, 'serve-interface.js')], { stdio: 'inherit' });

  const url = 'http://localhost:8080/index.html';
  let cmd, args;
  if (process.platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '', url];
  } else if (process.platform === 'darwin') {
    cmd = 'open';
    args = [url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }
  const opener = spawn(cmd, args, { stdio: 'ignore', detached: true });
  opener.unref();

  server.on('exit', code => process.exit(code));
});

