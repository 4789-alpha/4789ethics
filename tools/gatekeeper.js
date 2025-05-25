const fs = require('fs');
const path = require('path');

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

function gateCheck(configPath) {
  const cfg = parseConfig(configPath);
  if (!cfg) {
    console.log('Gatekeeper: configuration missing.');
    return false;
  }
  const allowed = cfg.allow_control === 'true';
  const controllerOK = cfg.controller === 'RL@RLpi';
  const local = cfg.local_only === 'true';
  return allowed && controllerOK && local;
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
