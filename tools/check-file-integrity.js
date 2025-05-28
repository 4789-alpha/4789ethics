const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getExpectedHashes() {
  const readme = path.join(__dirname, '..', 'README.md');
  const content = fs.readFileSync(readme, 'utf8');
  const regex = /\*\*(.+?)\*\*\nSHA-256:\s*([a-f0-9]{64})/gi;
  const result = {};
  let match;
  while ((match = regex.exec(content))) {
    result[match[1].trim()] = match[2];
  }
  return result;
}

function computeHash(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function resolveFile(name) {
  const root = path.join(__dirname, '..');
  const direct = path.join(root, name);
  if (fs.existsSync(direct)) return direct;
  const inInterface = path.join(root, 'interface', name);
  if (fs.existsSync(inInterface)) return inInterface;
  return null;
}

function checkFiles() {
  const expected = getExpectedHashes();
  let ok = true;
  for (const [name, expectedHash] of Object.entries(expected)) {
    const file = resolveFile(name);
    if (!file) {
      console.error(`File not found: ${name}`);
      ok = false;
      continue;
    }
    const hash = computeHash(file);
    if (hash === expectedHash) {
      console.log(`${name} OK`);
    } else {
      console.error(`${name} mismatch: expected ${expectedHash}, got ${hash}`);
      ok = false;
    }
  }
  return ok;
}

if (require.main === module) {
  if (!checkFiles()) process.exit(1);
}

module.exports = { checkFiles };
