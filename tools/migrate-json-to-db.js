const path = require('path');
const fs = require('fs');
const db = require('./db.js');

function load(file, def) {
  if (!fs.existsSync(file)) return def;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const repoRoot = path.join(__dirname, '..');
const users = load(path.join(repoRoot, 'app', 'users.json'), []);
const conns = load(path.join(repoRoot, 'app', 'connections.json'), []);
const evals = load(path.join(repoRoot, 'app', 'evaluations.json'), []);
const profile = load(path.join(repoRoot, 'app', 'userprofile.json'), {});

// replace tables with loaded data
if (users.length) db.replaceUsers(users);
if (conns.length) db.replaceConnections(conns);
if (evals.length) db.replaceEvaluations(evals);
db.replaceProfile(profile);

console.log('Migration complete.');
