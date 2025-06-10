const fs = require('fs');
const path = require('path');

function readConfig(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeConfig(cfg, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2));
}

function oldestGatekeeper(gatekeepers) {
  if (!gatekeepers) return null;
  return Object.entries(gatekeepers)
    .filter(([, g]) => g.active)
    .sort((a, b) => new Date(a[1].active_since) - new Date(b[1].active_since))[0];
}

function distributeMemory(filePath) {
  const cfg = readConfig(filePath);
  if (!cfg) return false;
  const gk = oldestGatekeeper(cfg.gatekeepers);
  if (!gk) return false;
  const activeUsers = Object.entries(cfg.users || {}).filter(([, u]) => u.active);
  if (activeUsers.length === 0) return false;
  const per = Math.floor(cfg.total_units / activeUsers.length);
  for (const [id, u] of Object.entries(cfg.users)) {
    cfg.users[id].units = u.active ? per : 0;
  }
  writeConfig(cfg, filePath);
  return true;
}

if (require.main === module) {
  const cfgPath = process.argv[2] || path.join(__dirname, '..', 'app', 'memory_config.json');
  if (distributeMemory(cfgPath)) {
    console.log('Memory distributed.');
  } else {
    console.log('Distribution skipped.');
  }
}

module.exports = { distributeMemory };
