const fs = require('fs');
const path = require('path');

const baseDir = process.env.RATSELTESTER_PATH || path.join(__dirname, '..', 'references');
const file = path.join(baseDir, 'ratseltester.json');

function load() {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function save(data) {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function assign(level, signature) {
  const data = load();
  if (data[level] && !data[level].released) {
    return false;
  }
  data[level] = { signature, since: new Date().toISOString() };
  save(data);
  return true;
}

function release(level) {
  const data = load();
  if (!data[level] || data[level].released) return false;
  data[level].released = new Date().toISOString();
  save(data);
  return true;
}

function current(level) {
  const data = load();
  const entry = data[level];
  if (!entry || entry.released) return null;
  return entry;
}

module.exports = { assign, release, current };
