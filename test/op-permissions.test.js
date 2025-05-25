const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const rootPath = path.join(__dirname, '..', 'permissions', 'op-permissions-expanded.json');
const interfacePath = path.join(__dirname, '..', 'interface', 'op-permissions-expanded.json');

const rootPerm = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const interfacePerm = JSON.parse(fs.readFileSync(interfacePath, 'utf8'));

test('op-permissions files match', () => {
  assert.deepStrictEqual(rootPerm, interfacePerm);
});
