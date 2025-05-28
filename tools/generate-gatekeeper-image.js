const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { issueTempToken, parseConfig } = require('./gatekeeper.js');

const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'gatekeeper_image');
const duration = parseInt(process.argv[3] || '3600', 10);

const cfgPath = path.join(__dirname, '..', 'app', 'gatekeeper_config.yaml');
const storePath = path.join(__dirname, '..', 'app', 'gatekeeper_devices.json');
const logPath = path.join(__dirname, '..', 'app', 'gatekeeper_log.json');

const cfg = parseConfig(cfgPath) || {};
const idHash = cfg.private_identity
  ? crypto.createHash('sha256').update(String(cfg.private_identity)).digest('hex')
  : null;

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const token = issueTempToken(
  cfg.controller || 'gatekeeper.local',
  storePath,
  idHash,
  duration,
  logPath
);

fs.copyFileSync(path.join(__dirname, 'gatekeeper.js'), path.join(outDir, 'gatekeeper.js'));
fs.copyFileSync(cfgPath, path.join(outDir, 'gatekeeper_config.yaml'));
fs.writeFileSync(path.join(outDir, 'temp_token.txt'), token);

console.log(`Gatekeeper image written to ${outDir}`);
console.log(`Token: ${token}`);

