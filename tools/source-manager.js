const fs = require('fs');
const path = require('path');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadPersons() {
  const dir = path.join(__dirname, '..', 'sources', 'persons');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .flatMap(f => readJSON(path.join(dir, f)));
}

function loadInstitutions() {
  const dir = path.join(__dirname, '..', 'sources', 'institutions');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .flatMap(f => readJSON(path.join(dir, f)));
}

function list(opts = {}) {
  const type = opts.type || 'all';
  let items = [];
  if (type === 'person' || type === 'all') items.push(...loadPersons());
  if (type === 'org' || type === 'all') items.push(...loadInstitutions());
  const sort = opts.sort;
  if (sort === 'name') {
    items.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
  } else if (sort === 'category') {
    items.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  } else {
    items.sort((a, b) => String(a.human_id || a.source_id || '').localeCompare(String(b.human_id || b.source_id || '')));
  }
  return items;
}

function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help' || args[0] === '-h') {
    console.log('Usage: node tools/source-manager.js list [--type=person|org|all] [--sort=name|category]');
    process.exit(0);
  }
  const cmd = args.shift();
  if (cmd !== 'list') {
    console.error('Unknown command:', cmd);
    process.exit(1);
  }
  const opts = {};
  args.forEach(arg => {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k === 'type') opts.type = v;
    else if (k === 'sort') opts.sort = v;
  });
  const items = list(opts);
  items.forEach((it, i) => {
    const id = it.human_id || it.source_id || '';
    const name = it.name || it.title;
    console.log(`${String(i + 1).padStart(3, ' ')} ${id} ${name}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { loadPersons, loadInstitutions, list };
