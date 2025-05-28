const fs = require('fs');
const path = require('path');

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

module.exports = { parseUserState };
