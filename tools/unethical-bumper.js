const fs = require('fs');
const path = require('path');

const WORD_FILE = path.join(__dirname, '..', 'i18n', 'unethical-words.json');
const LOG_FILE = path.join(__dirname, '..', 'app', 'unethical_log.json');

function loadWords(lang = 'en') {
  const data = JSON.parse(fs.readFileSync(WORD_FILE, 'utf8'));
  return data[lang] || [];
}

function containsUnethical(text, lang = 'en') {
  if (!text) return false;
  const words = loadWords(lang);
  const lower = text.toLowerCase();
  return words.some(w => lower.includes(w.toLowerCase()));
}

function requiredConfirmationDiff(opLevel) {
  const num = parseFloat(String(opLevel).replace('OP-', '')) || 0;
  if (num >= 8) return 0;
  if (num >= 5) return 1;
  return 2;
}

function readLog(file = LOG_FILE) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function writeLog(entries, file = LOG_FILE) {
  fs.writeFileSync(file, JSON.stringify(entries, null, 2));
}

function logUnethical(signature, text, lang = 'en', file = LOG_FILE) {
  const list = readLog(file);
  const entry = {
    ts: new Date().toISOString(),
    signature,
    lang,
    excerpt: text.slice(0, 80)
  };
  list.push(entry);
  writeLog(list, file);
  return entry;
}

function historyFor(signature, file = LOG_FILE) {
  return readLog(file).filter(e => e.signature === signature);
}

function shouldDemote(signature, threshold = 3, file = LOG_FILE) {
  return historyFor(signature, file).length >= threshold;
}

if (require.main === module) {
  const [opLevel, lang, signature, ...parts] = process.argv.slice(2);
  if (!opLevel || !lang || !signature || parts.length === 0) {
    console.error('Usage: node unethical-bumper.js <op-level> <lang> <signature> <text>');
    process.exit(1);
  }
  const text = parts.join(' ');
  const unethical = containsUnethical(text, lang);
  if (unethical) logUnethical(signature, text, lang);
  const confirm_diff = requiredConfirmationDiff(opLevel);
  const demote = unethical && shouldDemote(signature);
  console.log(JSON.stringify({ unethical, confirm_diff, demote }));
}

module.exports = {
  loadWords,
  containsUnethical,
  requiredConfirmationDiff,
  logUnethical,
  historyFor,
  shouldDemote
};
