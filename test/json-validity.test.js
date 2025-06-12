const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

function getJsonFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      files.push(...getJsonFiles(p));
    } else if (entry.name.endsWith('.json')) {
      files.push(p);
    }
  }
  return files;
}

const jsonFiles = getJsonFiles(path.join(__dirname, '..'));

test('all JSON files parse correctly', () => {
  for (const file of jsonFiles) {
    const content = fs.readFileSync(file, 'utf8');
    try {
      JSON.parse(content);
    } catch (err) {
      assert.fail(`Invalid JSON in ${file}: ${err.message}`);
    }
  }
});
