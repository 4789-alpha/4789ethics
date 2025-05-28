const fs = require('fs');
const path = require('path');
const { parseUserState } = require('./user-state.js');

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
  const state = parseUserState();
  const level = argLevel || (state ? state.op_level : null) || 'OP-0';
  showRights(level);
}

module.exports = { showRights };
