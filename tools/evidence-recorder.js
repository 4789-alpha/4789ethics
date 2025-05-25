const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function saveEvidence(data, actor = 'user') {
  const evidenceDir = path.join(__dirname, '..', 'evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  const entry = { actor, timestamp, hash, data };
  const nameSafeTime = timestamp.replace(/[:.]/g, '-');
  const filename = `${actor}-${nameSafeTime}.json`;
  fs.writeFileSync(path.join(evidenceDir, filename), JSON.stringify(entry, null, 2));
  return filename;
}

if (require.main === module) {
  const [actor, file] = process.argv.slice(2);
  if (!file) {
    console.error('Usage: node evidence-recorder.js <actor> <file>');
    process.exit(1);
  }
  const content = fs.readFileSync(file, 'utf8');
  const out = saveEvidence(content, actor || 'user');
  console.log('Saved evidence:', out);
}

module.exports = saveEvidence;
