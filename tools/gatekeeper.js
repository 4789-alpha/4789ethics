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
  const cfg = { authorized_temp: [] };
  let inList = false;
  lines.forEach(line => {
    const trimmed = line.trim();
    if (inList) {
      const m = trimmed.match(/^-(.*)$/);
      if (m) {
        cfg.authorized_temp.push(m[1].trim().replace(/['"]/g, ''));
        return;
      }
      inList = false;
    }
    const m = trimmed.match(/^(controller|allow_control|local_only|private_identity|address|phone|temp_token_duration):\s*(.*)$/);
    if (m) {
      cfg[m[1]] = m[2].replace(/['"]/g, '');
      return;
    }
    if (trimmed.startsWith('authorized_temp:')) {
      const val = trimmed.split(':')[1].trim();
      if (val) cfg.authorized_temp.push(val.replace(/['"]/g, ''));
      inList = true;
    }
  });
  return cfg;
}

function deviceHash() {
  const data = `${os.hostname()}|${os.platform()}|${os.arch()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

function identityHash(id) {
  if (!id) return null;
  return crypto.createHash('sha256').update(String(id)).digest('hex');
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

function deviceRecognized(controller, storePath, idHash, addrHash, phoneHash) {
  const devices = readDevices(storePath);
  const entry = devices[controller];
  if (!entry) return false;
  if (idHash && entry.identity && entry.identity !== idHash) return false;
  if (addrHash && entry.address && entry.address !== addrHash) return false;
  if (phoneHash && entry.phone && entry.phone !== phoneHash) return false;
  const hash = deviceHash();
  return Array.isArray(entry.devices) && entry.devices.includes(hash);
}

function rememberDevice(controller, storePath, idHash, addrHash, phoneHash) {
  const hash = deviceHash();
  const devices = readDevices(storePath);
  if (!devices[controller]) {
    devices[controller] = { identity: idHash || null, address: addrHash || null, phone: phoneHash || null, devices: [], tokens: {} };
  }
  if (idHash) devices[controller].identity = idHash;
  if (addrHash) devices[controller].address = addrHash;
  if (phoneHash) devices[controller].phone = phoneHash;
  const list = devices[controller].devices;
  if (!Array.isArray(list)) devices[controller].devices = [];
  if (!devices[controller].devices.includes(hash)) {
    devices[controller].devices.push(hash);
    writeDevices(devices, storePath);
  }
}

function issueTempToken(controller, storePath, idHash, durationSec) {
  const token = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const exp = Date.now() + (durationSec || 86400) * 1000;
  const devices = readDevices(storePath);
  if (!devices[controller]) {
    devices[controller] = { identity: idHash || null, devices: [], tokens: {} };
  }
  if (!devices[controller].tokens) devices[controller].tokens = {};
  devices[controller].tokens[hash] = exp;
  writeDevices(devices, storePath);
  return token;
}

function verifyTempToken(controller, storePath, token) {
  const hash = crypto.createHash('sha256').update(String(token)).digest('hex');
  const devices = readDevices(storePath);
  const entry = devices[controller];
  if (!entry || !entry.tokens) return false;
  const now = Date.now();
  for (const [h, exp] of Object.entries(entry.tokens)) {
    if (exp < now) delete entry.tokens[h];
  }
  writeDevices(devices, storePath);
  const exp = entry.tokens[hash];
  return !!(exp && exp > now);
}

function gateCheck(configPath, devicesPath, tempToken) {
  const cfg = parseConfig(configPath);
  if (!cfg) {
    console.log('Gatekeeper: configuration missing.');
    return false;
  }
  const deviceFile = devicesPath || path.join(__dirname, '..', 'app', 'gatekeeper_devices.json');
  const controllerOK = cfg.controller === 'gstekeeper.local';
  const idHash = identityHash(cfg.private_identity);
  const addrHash = identityHash(cfg.address);
  const phoneHash = identityHash(cfg.phone);
  const local = cfg.local_only === 'true';
  const existing = readDevices(deviceFile)[cfg.controller];
  if (existing) {
    if (idHash && existing.identity && existing.identity !== idHash) return false;
    if (addrHash && existing.address && existing.address !== addrHash) return false;
    if (phoneHash && existing.phone && existing.phone !== phoneHash) return false;
  }

  if (controllerOK && local && deviceRecognized(cfg.controller, deviceFile, idHash, addrHash, phoneHash)) {
    return true;
  }

  if (tempToken && verifyTempToken(cfg.controller, deviceFile, tempToken)) {
    rememberDevice(cfg.controller, deviceFile, idHash, addrHash, phoneHash);
    return true;
  }

  const allowed = cfg.allow_control === 'true';
  const result = allowed && controllerOK && local;

  if (result) {
    rememberDevice(cfg.controller, deviceFile, idHash, addrHash, phoneHash);
  }

  return result;
}

if (require.main === module) {
  const cmd = process.argv[2];
  const cfgPath = path.join(__dirname, '..', 'app', 'gatekeeper_config.yaml');
  const storePath = path.join(__dirname, '..', 'app', 'gatekeeper_devices.json');
  const cfg = parseConfig(cfgPath) || {};
  const idHash = identityHash(cfg.private_identity);
  if (cmd === 'token') {
    const dur = parseInt(cfg.temp_token_duration || '86400', 10);
    const tok = issueTempToken(cfg.controller || 'gstekeeper.local', storePath, idHash, dur);
    console.log(tok);
  } else {
    if (gateCheck(cfgPath, storePath, cmd)) {
      console.log('Gatekeeper: gstekeeper.local control allowed (local only).');
      process.exit(0);
    } else {
      console.log('Gatekeeper: control denied.');
      process.exit(1);
    }
  }
}

module.exports = { gateCheck, issueTempToken, verifyTempToken, parseConfig };
