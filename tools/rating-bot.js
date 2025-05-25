const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcMap = {
  'SRC-0': 0, 'SRC-1': 1, 'SRC-2': 2, 'SRC-3': 3,
  'SRC-4': 4, 'SRC-5': 5, 'SRC-6': 6, 'SRC-7': 7, 'SRC-8+': 8
};
const reverseMap = Object.fromEntries(Object.entries(srcMap).map(([k, v]) => [v, k]));

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function loadManifests(dir) {
  const idx = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  return idx.map(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
}

function compileRatings(list) {
  const perSource = {};
  list.filter(m => m.op_level && m.op_level !== 'OP-0').forEach(m => {
    const num = srcMap[m.src_lvl] || 0;
    if (!perSource[m.source_id]) perSource[m.source_id] = [];
    perSource[m.source_id].push(num);
  });
  const summary = {};
  for (const [src, nums] of Object.entries(perSource)) {
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    summary[src] = {
      score: +avg.toFixed(2),
      level: reverseMap[Math.round(avg)] || `SRC-${Math.round(avg)}`,
      evaluations: nums.length
    };
  }
  return summary;
}

function signSummary(summary) {
  const json = JSON.stringify(summary);
  return { summary, signature: sha256(json) };
}

function main() {
  const dir = path.join(__dirname, '..', 'manifests');
  const list = loadManifests(dir);
  const summary = compileRatings(list);
  const signed = signSummary(summary);
  const outDir = path.join(__dirname, '..', 'references');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'rating-summary-signed.json'), JSON.stringify(signed, null, 2));
  console.log('Summary written to references/rating-summary-signed.json');
}

if (require.main === module) {
  main();
}

module.exports = { loadManifests, compileRatings, signSummary };
