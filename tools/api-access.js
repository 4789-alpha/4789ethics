const { parseUserState } = require('./user-state.js');

function opLevelToNumber(level) {
  if (!level) return 0;
  const n = parseFloat(String(level).replace('OP-', ''));
  return isNaN(n) ? 0 : n;
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
