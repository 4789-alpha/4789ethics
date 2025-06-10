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

  const major = parseInt(process.versions.node.split('.')[0], 10);
  if (major < 18) {
    console.error('Node.js 18+ wird ben\u00f6tigt.');
    process.exit(1);
  }

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const install = spawn(npmCmd, ['install'], { stdio: 'inherit' });

  install.on('exit', code => {
    if (code !== 0) {
      process.exit(code);
    }

    const server = spawn('node', [path.join(__dirname, 'start-server.js')], { stdio: 'inherit' });
    server.on('exit', code => process.exit(code));
  });
});
