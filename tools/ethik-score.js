const fs = require('fs');
const path = require('path');

const srcMap = {
  'SRC-0': 0, 'SRC-1': 1, 'SRC-2': 2, 'SRC-3': 3,
  'SRC-4': 4, 'SRC-5': 5, 'SRC-6': 6, 'SRC-7': 7, 'SRC-8+': 8
};
const reverseMap = Object.fromEntries(Object.entries(srcMap).map(([k,v]) => [v, k]));

function loadRatings(manifestDir) {
  const indexPath = path.join(manifestDir, 'index.json');
  if (!fs.existsSync(indexPath)) throw new Error('index.json not found');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const perSource = {};
  for (const file of index) {
    const p = path.join(manifestDir, file);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const num = srcMap[data.src_lvl] || 0;
    if (!perSource[data.source_id]) perSource[data.source_id] = [];
    perSource[data.source_id].push(num);
  }
  return perSource;
}

function computeScores(perSource) {
  const result = {};
  for (const [src, nums] of Object.entries(perSource)) {
    const avg = nums.reduce((a,b)=>a+b,0) / nums.length;
    result[src] = {
      score: +avg.toFixed(2),
      level: reverseMap[Math.round(avg)] || `SRC-${Math.round(avg)}`,
      evaluations: nums.length
    };
  }
  return result;
}

function main() {
  const manifestDir = path.join(__dirname, '..', 'manifests');
  const perSource = loadRatings(manifestDir);
  const scores = computeScores(perSource);
  const outDir = path.join(__dirname, '..', 'references');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'ethik-scores.json');
  fs.writeFileSync(outPath, JSON.stringify(scores, null, 2));
  console.log('Ethik scores written to', outPath);
}

if (require.main === module) {
  main();
}

module.exports = { loadRatings, computeScores };
