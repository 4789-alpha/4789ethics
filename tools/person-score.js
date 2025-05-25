const fs = require('fs');
const path = require('path');

function loadRatings(filePath) {
  const p = filePath || path.join(__dirname, '..', 'evidence', 'person-ratings.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ratingToValue(r) {
  if (r === 'yes') return 1;
  if (r === 'unclear') return 0.5;
  return 0;
}

function opLevelToNumber(level) {
  const n = parseFloat(String(level).replace('OP-', ''));
  return isNaN(n) ? 0 : n;
}

function computePersonScores(list) {
  const result = {};
  list.forEach(r => {
    const id = r.human_id;
    if (!result[id]) result[id] = { total: 0, ops: 0, count: 0 };
    result[id].total += ratingToValue(r.rating);
    result[id].ops += opLevelToNumber(r.op_level);
    result[id].count += 1;
  });
  const scores = {};
  for (const [id, info] of Object.entries(result)) {
    const avg = info.total / info.count;
    const opAvg = info.ops / info.count;
    scores[id] = {
      average_rating: +avg.toFixed(2),
      average_op_level: +opAvg.toFixed(2),
      evaluations: info.count,
      score: +(avg * 10).toFixed(2)
    };
  }
  return scores;
}

function main() {
  const data = loadRatings();
  const scores = computePersonScores(data);
  const outDir = path.join(__dirname, '..', 'references');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'person-scores.json');
  fs.writeFileSync(outPath, JSON.stringify(scores, null, 2));
  console.log('Person scores written to', outPath);
}

if (require.main === module) {
  main();
}

module.exports = { loadRatings, computePersonScores };
