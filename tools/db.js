const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const usersFile = path.join(repoRoot, 'app', 'users.json');
const connFile = path.join(repoRoot, 'app', 'connections.json');
const evalFile = path.join(repoRoot, 'app', 'evaluations.json');
const profileFile = path.join(repoRoot, 'app', 'userprofile.json');

let users = [];
let connections = [];
let evaluations = [];
let profile = {};

function syncFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadJson(file, def) {
  if (!fs.existsSync(file)) return def;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; }
}

function replaceUsers(list) {
  users = list.map(u => ({ ...u }));
  syncFile(usersFile, users);
}

function replaceConnections(list) {
  connections = list.map(c => ({ ...c }));
  syncFile(connFile, connections);
}

function replaceEvaluations(list) {
  evaluations = list.map(e => ({ ...e }));
  syncFile(evalFile, evaluations);
}

function replaceProfile(obj) {
  profile = { ...obj };
  syncFile(profileFile, profile);
}

function getUsers() { return users.map(u => ({ ...u })); }
function getUser(id) { const u = users.find(u => u.id === id); return u ? { ...u } : undefined; }
function createUser(user) { users.push({ ...user }); syncFile(usersFile, users); }
function updateUser(user) {
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) users[idx] = { ...users[idx], ...user };
  syncFile(usersFile, users);
}
function deleteUser(id) { users = users.filter(u => u.id !== id); syncFile(usersFile, users); }

function getConnections() { return connections.map(c => ({ ...c })); }
function createConnection(c) { connections.push({ ...c }); syncFile(connFile, connections); }
function updateConnection(c) {
  const idx = connections.findIndex(x => x.requester === c.requester && x.target === c.target);
  if (idx !== -1) connections[idx] = { ...connections[idx], ...c };
  syncFile(connFile, connections);
}

function getEvaluations() { return evaluations.map(e => ({ ...e })); }
function createOrUpdateEvaluation(e) {
  const idx = evaluations.findIndex(x => x.signature === e.signature && x.source_id === e.source_id);
  if (idx !== -1) evaluations[idx] = { ...evaluations[idx], ...e };
  else evaluations.push({ ...e });
  syncFile(evalFile, evaluations);
}

function getProfile() { return { ...profile }; }
function setProfile(data) { profile = { ...profile, ...data }; syncFile(profileFile, profile); }

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
