const fs = require('fs');
const path = require('path');

function parseUserState(filePath) {
  const p = filePath || path.join(__dirname, '..', 'app', 'user_state.yaml');
  if (!fs.existsSync(p)) return null;
  const data = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  let op = null;
  data.forEach(line => {
    const m = line.match(/^\s*op_level:\s*(.*)$/);
    if (m) op = m[1].replace(/['"]/g, '');
  });
  return op;
}

function loadPermissions(filePath) {
  const p = filePath || path.join(__dirname, '..', 'permissions', 'op-permissions-expanded.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function showRights(level) {
  const perms = loadPermissions();
  if (!perms || !perms[level]) {
    console.log('No permissions found for', level);
    return;
  }
  console.log('Rights for', level + ':');
  Object.keys(perms[level]).filter(k => perms[level][k]).forEach(k => {
    console.log('-', k);
  });
}

if (require.main === module) {
  const argLevel = process.argv[2];
  const level = argLevel || parseUserState() || 'OP-0';
  showRights(level);
}

module.exports = { showRights };
