const fs = require('fs');
const path = require('path');
const { opLevelToNumber } = require('../utils/op-level.js');

function loadInputs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = fs.readFileSync(path.join(dir, f), 'utf8');
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function summarize(list) {
  const summary = {};
  list.forEach(entry => {
    const q = entry.question_id;
    if (!summary[q]) {
      summary[q] = {
        count: 0,
        answers: {},
        highest_op: 'OP-0',
        detailed_response: ''
      };
    }
    const info = summary[q];
    info.count += 1;
    info.answers[entry.answer] = (info.answers[entry.answer] || 0) + 1;
    if (entry.details && entry.details.length > info.detailed_response.length) {
      info.detailed_response = entry.details;
    }
    const lvl = opLevelToNumber(entry.op_level);
    const cur = opLevelToNumber(info.highest_op);
    if (lvl > cur) info.highest_op = entry.op_level;
  });

  for (const q of Object.keys(summary)) {
    const info = summary[q];
    const pct = {};
    for (const [ans, num] of Object.entries(info.answers)) {
      pct[ans] = +(num / info.count * 100).toFixed(2);
    }
    info.average = pct;
  }
  return summary;
}

function writeSummary(dir, outFile) {
  const list = loadInputs(dir);
  const summary = summarize(list);
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
  return summary;
}

if (require.main === module) {
  const dir = path.join(__dirname, '..', 'anon_inputs');
  const out = path.join(__dirname, '..', 'references', 'anon-input-summary.json');
  const summary = writeSummary(dir, out);
  console.log('Summary written for', Object.keys(summary).length, 'questions');
}

module.exports = { loadInputs, summarize, writeSummary };
