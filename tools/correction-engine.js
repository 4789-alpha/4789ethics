// correction-engine.js
const fs = require('fs');
const path = require('path');
const { evaluateDemotion } = require('./trust-demotion-engine.js');

function loadJSON(p) {
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function opNum(level) {
  return parseFloat(String(level).replace('OP-', '')) || 0;
}

function markContradictions(local, global) {
  const gBySource = {};
  global.forEach(e => {
    const id = e.source_id;
    if (!gBySource[id]) gBySource[id] = [];
    gBySource[id].push(e);
  });

  return local.map(e => {
    const list = gBySource[e.source_id] || [];
    const higher = list.find(g => g.rating !== e.rating && opNum(g.op_level) > opNum(e.op_level || 'OP-0'));
    if (higher) return { ...e, overridden_by_op5plus: true, recommended: higher.rating };
    return e;
  });
}

function analyze(evals) {
  const bySig = {};
  evals.forEach(e => {
    const sig = e.signature || 'unknown';
    if (!bySig[sig]) bySig[sig] = [];
    bySig[sig].push(e);
  });

  const demotions = {};
  Object.entries(bySig).forEach(([sig, list]) => {
    demotions[sig] = evaluateDemotion({}, list);
  });

  const revisions = evals.filter(e => e.overridden_by_op5plus).map(e => ({
    signature: e.signature,
    source_id: e.source_id,
    recommended_rating: e.recommended
  }));

  return { demotions, revisions };
}

function main() {
  const repoRoot = path.join(__dirname, '..');
  const localPath = path.join(repoRoot, 'app', 'evaluations.json');
  const globalPath = path.join(repoRoot, 'references', 'global-evaluations.json');

  const local = loadJSON(localPath);
  const global = loadJSON(globalPath);

  const marked = markContradictions(local, global);
  const result = analyze(marked);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { markContradictions, analyze };
