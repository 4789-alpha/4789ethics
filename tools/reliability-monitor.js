const fs = require('fs');
const path = require('path');

function evaluateReliability(invalidCount, totalCount) {
  if (!totalCount) return 1;
  return 1 - invalidCount / totalCount;
}

function qualifiesForDemotion(invalidCount, totalCount) {
  if (!totalCount) return false;
  const ratio = invalidCount / totalCount;
  if (totalCount > 20 && (1 - ratio) < 0.9) return true;
  if (ratio > 1 / 3) return true;
  return false;
}

function recordReliability(opLevel, tempSignature, invalidCount, totalCount, logFile) {
  const file = logFile || path.join(__dirname, '..', 'app', 'op_reliability.json');
  const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const entry = {
    timestamp: new Date().toISOString(),
    op_level: opLevel,
    temp_signature: tempSignature,
    invalid_entries: invalidCount,
    total_entries: totalCount
  };
  list.push(entry);
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
  return entry;
}

if (require.main === module) {
  const [opLevel, tempSig, bad, total] = process.argv.slice(2);
  if (!opLevel || !tempSig || !bad || !total) {
    console.error('Usage: node reliability-monitor.js <op-level> <temp-sig> <bad-count> <total-count> [logFile]');
    process.exit(1);
  }
  const logFile = process.argv[6];
  const badNum = parseInt(bad, 10);
  const totalNum = parseInt(total, 10);
  const entry = recordReliability(opLevel, tempSig, badNum, totalNum, logFile);
  const rel = evaluateReliability(badNum, totalNum);
  const demote = qualifiesForDemotion(badNum, totalNum);
  console.log(JSON.stringify({ entry, reliability: rel, demote }));
}

module.exports = { evaluateReliability, qualifiesForDemotion, recordReliability };
