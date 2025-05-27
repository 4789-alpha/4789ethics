const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

function getYamlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getYamlFiles(p));
    } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
      files.push(p);
    }
  }
  return files;
}

function parseScalar(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (!isNaN(value)) return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseSimpleYAML(content) {
  const lines = content.replace(/\t/g, '  ').split(/\r?\n/);
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const rawLine of lines) {
    const commentTrimmed = rawLine.replace(/#.*$/, '');
    if (!commentTrimmed.trim()) continue;
    const indent = rawLine.match(/^ */)[0].length;
    while (stack.length && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;
    const trimmed = commentTrimmed.trim();
    if (trimmed.startsWith('- ')) {
      if (!Array.isArray(parent._list)) {
        parent._list = [];
      }
      const item = trimmed.slice(2).trim();
      if (item.endsWith(':')) {
        const key = item.slice(0, -1).trim();
        const obj = {};
        parent._list.push({ [key]: obj });
        stack.push({ indent, obj });
      } else {
        parent._list.push(parseScalar(item));
      }
    } else {
      const parts = trimmed.split(/:(.+)/);
      const key = parts[0].trim();
      const val = (parts[1] || '').trim();
      if (!val) {
        parent[key] = {};
        stack.push({ indent, obj: parent[key] });
      } else {
        parent[key] = parseScalar(val);
      }
    }
  }
  function finalize(obj) {
    if (obj && typeof obj === 'object' && obj._list) {
      const arr = obj._list.map(item => {
        if (typeof item === 'object' && !Array.isArray(item)) {
          const key = Object.keys(item)[0];
          return { [key]: finalize(item[key]) };
        }
        return item;
      });
      delete obj._list;
      return arr;
    }
    if (obj && typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        if (obj[k] && typeof obj[k] === 'object') obj[k] = finalize(obj[k]);
      }
    }
    return obj;
  }
  return finalize(root);
}

const yamlFiles = getYamlFiles(path.join(__dirname, '..'));

test('all YAML files parse correctly', () => {
  for (const file of yamlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    try {
      parseSimpleYAML(content);
    } catch (err) {
      assert.fail(`Invalid YAML in ${file}: ${err.message}`);
    }
  }
});
