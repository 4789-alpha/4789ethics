const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const basePath = path.join(root, 'interface', 'op-permissions.json');
const outputPaths = [
  path.join(root, 'interface', 'op-permissions-expanded.json'),
  path.join(root, 'permissions', 'op-permissions-expanded.json'),
];

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const levelKeys = Object.keys(base).sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)));
let prev = {};
const expanded = {};
for (const key of levelKeys) {
  prev = Object.assign({}, prev, base[key]);
  expanded[key] = prev;
}
const content = JSON.stringify(expanded, null, 2) + '\n';
for (const out of outputPaths) {
  fs.writeFileSync(out, content);
  console.log('generated', out);
}
