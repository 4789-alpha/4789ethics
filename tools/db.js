const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const repoRoot = path.join(__dirname, '..');
const dbPath = path.join(repoRoot, 'app', 'data.db');
const usersFile = path.join(repoRoot, 'app', 'users.json');
const connFile = path.join(repoRoot, 'app', 'connections.json');
const evalFile = path.join(repoRoot, 'app', 'evaluations.json');
const profileFile = path.join(repoRoot, 'app', 'userprofile.json');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  emailHash TEXT,
  pwHash TEXT,
  salt TEXT,
  op_level TEXT,
  nickname TEXT,
  alias TEXT,
  totpSecretEnc TEXT,
  addrHash TEXT,
  phoneHash TEXT,
  countryHash TEXT,
  idHash TEXT,
  auth_verified INTEGER,
  level_change_ts TEXT,
  is_digital INTEGER,
  githubHash TEXT,
  googleHash TEXT,
  tokenHash TEXT
);
CREATE TABLE IF NOT EXISTS connections (
  requester TEXT,
  target TEXT,
  approved INTEGER,
  timestamp TEXT,
  approved_at TEXT
);
CREATE TABLE IF NOT EXISTS evaluations (
  signature TEXT,
  source_id TEXT,
  rating REAL,
  comment TEXT,
  timestamp TEXT,
  revised TEXT
);
CREATE TABLE IF NOT EXISTS profiles (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

function syncFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadJson(file, def) {
  if (!fs.existsSync(file)) return def;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; }
}

function replaceUsers(list) {
  const stmt = db.prepare(`INSERT INTO users (
    id,emailHash,pwHash,salt,op_level,nickname,alias,totpSecretEnc,addrHash,
    phoneHash,countryHash,idHash,auth_verified,level_change_ts,is_digital,
    githubHash,googleHash,tokenHash
  ) VALUES (@id,@emailHash,@pwHash,@salt,@op_level,@nickname,@alias,@totpSecretEnc,@addrHash,
    @phoneHash,@countryHash,@idHash,@auth_verified,@level_change_ts,@is_digital,
    @githubHash,@googleHash,@tokenHash)`);
  const trans = db.transaction(arr => {
    db.prepare('DELETE FROM users').run();
    for (const u of arr) stmt.run(u);
  });
  trans(list);
  syncFile(usersFile, list);
}

function replaceConnections(list) {
  const stmt = db.prepare(`INSERT INTO connections (requester,target,approved,timestamp,approved_at)
    VALUES (@requester,@target,@approved,@timestamp,@approved_at)`);
  const trans = db.transaction(arr => {
    db.prepare('DELETE FROM connections').run();
    for (const c of arr) stmt.run(c);
  });
  trans(list);
  syncFile(connFile, list);
}

function replaceEvaluations(list) {
  const stmt = db.prepare(`INSERT INTO evaluations (signature,source_id,rating,comment,timestamp,revised)
    VALUES (@signature,@source_id,@rating,@comment,@timestamp,@revised)`);
  const trans = db.transaction(arr => {
    db.prepare('DELETE FROM evaluations').run();
    for (const e of arr) stmt.run(e);
  });
  trans(list);
  syncFile(evalFile, list);
}

function replaceProfile(obj) {
  const stmt = db.prepare('INSERT OR REPLACE INTO profiles (key,value) VALUES (@key,@value)');
  const trans = db.transaction(p => {
    db.prepare('DELETE FROM profiles').run();
    for (const [k,v] of Object.entries(p)) stmt.run({ key: k, value: JSON.stringify(v) });
  });
  trans(obj);
  syncFile(profileFile, obj);
}

function getUsers() { return db.prepare('SELECT * FROM users').all(); }
function getUser(id) { return db.prepare('SELECT * FROM users WHERE id=?').get(id); }
function createUser(user) { db.prepare(`INSERT INTO users (
  id,emailHash,pwHash,salt,op_level,nickname,alias,totpSecretEnc,addrHash,
  phoneHash,countryHash,idHash,auth_verified,level_change_ts,is_digital,
  githubHash,googleHash,tokenHash)
  VALUES (@id,@emailHash,@pwHash,@salt,@op_level,@nickname,@alias,@totpSecretEnc,@addrHash,
    @phoneHash,@countryHash,@idHash,@auth_verified,@level_change_ts,@is_digital,
    @githubHash,@googleHash,@tokenHash)`).run(user); syncFile(usersFile, getUsers()); }
function updateUser(user) {
  const fields = Object.keys(user).filter(f => f !== 'id');
  if (fields.length === 0) return;
  const sets = fields.map(f => `${f}=@${f}`).join(',');
  db.prepare(`UPDATE users SET ${sets} WHERE id=@id`).run(user);
  syncFile(usersFile, getUsers());
}
function deleteUser(id) { db.prepare('DELETE FROM users WHERE id=?').run(id); syncFile(usersFile, getUsers()); }

function getConnections() { return db.prepare('SELECT * FROM connections').all(); }
function createConnection(c) { db.prepare(`INSERT INTO connections(requester,target,approved,timestamp,approved_at)
  VALUES (@requester,@target,@approved,@timestamp,@approved_at)`).run(c); syncFile(connFile, getConnections()); }
function updateConnection(c) { db.prepare(`UPDATE connections SET approved=@approved, approved_at=@approved_at
  WHERE requester=@requester AND target=@target`).run(c); syncFile(connFile, getConnections()); }

function getEvaluations() { return db.prepare('SELECT * FROM evaluations').all(); }
function createOrUpdateEvaluation(e) {
  const row = db.prepare('SELECT rowid FROM evaluations WHERE signature=? AND source_id=?').get(e.signature, e.source_id);
  if (row) {
    db.prepare('UPDATE evaluations SET rating=@rating, comment=@comment, revised=@revised WHERE signature=@signature AND source_id=@source_id').run(e);
  } else {
    db.prepare('INSERT INTO evaluations(signature,source_id,rating,comment,timestamp,revised) VALUES(@signature,@source_id,@rating,@comment,@timestamp,@revised)').run(e);
  }
  syncFile(evalFile, getEvaluations());
}

function getProfile() {
  const rows = db.prepare('SELECT * FROM profiles').all();
  const obj = {};
  rows.forEach(r => { obj[r.key] = JSON.parse(r.value); });
  return obj;
}
function setProfile(data) {
  const stmt = db.prepare('INSERT OR REPLACE INTO profiles(key,value) VALUES(@key,@value)');
  const trans = db.transaction(obj => {
    for (const [k,v] of Object.entries(obj)) {
      stmt.run({ key: k, value: JSON.stringify(v) });
    }
  });
  trans(data);
  syncFile(profileFile, getProfile());
}

function loadFromJson() {
  if (fs.existsSync(usersFile)) replaceUsers(loadJson(usersFile, []));
  if (fs.existsSync(connFile)) replaceConnections(loadJson(connFile, []));
  if (fs.existsSync(evalFile)) replaceEvaluations(loadJson(evalFile, []));
  if (fs.existsSync(profileFile)) replaceProfile(loadJson(profileFile, {}));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getConnections,
  createConnection,
  updateConnection,
  getEvaluations,
  createOrUpdateEvaluation,
  getProfile,
  setProfile,
  replaceUsers,
  replaceConnections,
  replaceEvaluations,
  replaceProfile,
  loadFromJson
};
