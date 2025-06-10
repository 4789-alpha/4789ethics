const fs = require('fs');
const path = require('path');
const { gateCheck } = require('./gatekeeper.js');
const { opLevelToNumber } = require('../utils/op-level.js');

function parseUserState(filePath) {
  const p = filePath || path.join(__dirname, '..', 'app', 'user_state.yaml');
  if (!fs.existsSync(p)) return null;
  const data = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  let op = null;
  data.forEach(line => {
    const m = line.match(/^\s*op_level:\s*(.*)$/);
    if (m) op = m[1].replace(/['\"]/g, '');
  });
  return op;
}

function mechaAllowed(minLevel = 'OP-6', token) {
  const level = parseUserState();
  if (!level) return false;
  const user = opLevelToNumber(level);
  const req = opLevelToNumber(minLevel);
  const cfg = path.join(__dirname, '..', 'app', 'gatekeeper_config.yaml');
  const store = path.join(__dirname, '..', 'app', 'gatekeeper_devices.json');
  const log = path.join(__dirname, '..', 'app', 'gatekeeper_log.json');
  const gate = gateCheck(cfg, store, token, log);
  return user >= req && gate;
}

if (require.main === module) {
  const disclaimers = [
    'Diese Struktur wird ohne Gew\u00e4hrleistung bereitgestellt.',
    'Die Nutzung erfolgt auf eigene Verantwortung.',
    '4789 ist ein Standard f\u00fcr Verantwortung, keine Person und kein Glaubenssystem.',
    'Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung.'
  ];
  disclaimers.forEach(l => console.log(l));
  const min = process.argv[2] || 'OP-6';
  const token = process.argv[3];
  if (mechaAllowed(min, token)) {
    console.log('Mechatronic control allowed for', min);
  } else {
    console.log('Mechatronic control denied for', min);
    process.exit(1);
  }
}

module.exports = mechaAllowed;
