const fs = require('fs');
const path = require('path');
const { opLevelToNumber } = require('../utils/op-level.js');

function parseUserState(filePath) {
  const p = filePath || path.join(__dirname, '..', 'app', 'user_state.yaml');
  if (!fs.existsSync(p)) return null;
  const data = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  let opLevel = null;
  let ethicsConfirmed = null;
  let ethicsTest = null;
  data.forEach(line => {
    const op = line.match(/^\s*op_level:\s*(.*)$/);
    if (op) opLevel = op[1].replace(/['"]/g, '');
    const ec = line.match(/^\s*ethics_confirmed:\s*(.*)$/);
    if (ec) ethicsConfirmed = ec[1].replace(/['"]/g, '') === 'true';
    const et = line.match(/^\s*ethics_test_passed:\s*(.*)$/);
    if (et) ethicsTest = et[1].replace(/['"]/g, '') === 'true';
  });
  return { op_level: opLevel, ethics_confirmed: ethicsConfirmed, ethics_test_passed: ethicsTest };
}

function apiAccessAllowed(minLevel = 'OP-3', userStatePath) {
  const state = parseUserState(userStatePath);
  if (!state) return false;
  const userLevel = opLevelToNumber(state.op_level);
  const required = opLevelToNumber(minLevel);
  const ethicsOk = state.ethics_confirmed === true || state.ethics_test_passed === true;
  return userLevel >= required && ethicsOk;
}

if (require.main === module) {
  const min = process.argv[2] || 'OP-3';
  const allowed = apiAccessAllowed(min);
  if (allowed) {
    console.log('API access granted for', min);
  } else {
    console.log('API access denied for', min);
  }
}

module.exports = apiAccessAllowed;
