const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

function parseConfig(filePath) {
  const configPath = filePath || path.join(__dirname, '..', 'app', 'gatekeeper_config.yaml');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const lines = fs.readFileSync(configPath, 'utf8').split(/\r?\n/);
  const cfg = {};
  lines.forEach(line => {
    const m = line.trim().match(/^(controller|allow_control|local_only):\s*(.*)$/);
    if (m) {
      cfg[m[1]] = m[2].replace(/['"]/g, '');
    }
  });
  return cfg;
}

function deviceHash() {
  const data = `${os.hostname()}|${os.platform()}|${os.arch()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

function readDevices(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeDevices(devices, filePath) {
  if (!filePath) return;
  fs.writeFileSync(filePath, JSON.stringify(devices, null, 2));
}

function deviceRecognized(controller, storePath) {
  const devices = readDevices(storePath);
  const hash = deviceHash();
  return Array.isArray(devices[controller]) && devices[controller].includes(hash);
}

function rememberDevice(controller, storePath) {
  const hash = deviceHash();
  const devices = readDevices(storePath);
  if (!Array.isArray(devices[controller])) {
    devices[controller] = [];
  }
  if (!devices[controller].includes(hash)) {
    devices[controller].push(hash);
    writeDevices(devices, storePath);
  }
}

function gateCheck(configPath, devicesPath) {
  const cfg = parseConfig(configPath);
  if (!cfg) {
    console.log('Gatekeeper: configuration missing.');
    return false;
  }
  const deviceFile = devicesPath || path.join(__dirname, '..', 'app', 'gatekeeper_devices.json');
  const controllerOK = cfg.controller === 'RL@RLpi';
  const local = cfg.local_only === 'true';

  if (controllerOK && local && deviceRecognized(cfg.controller, deviceFile)) {
    return true;
  }

  const allowed = cfg.allow_control === 'true';
  const result = allowed && controllerOK && local;

  if (result) {
    rememberDevice(cfg.controller, deviceFile);
  }

  return result;
}

if (require.main === module) {
  if (gateCheck()) {
    console.log('Gatekeeper: RL@RLpi control allowed (local only).');
    process.exit(0);
  } else {
    console.log('Gatekeeper: control denied.');
    process.exit(1);
  }
}

module.exports = { gateCheck };
