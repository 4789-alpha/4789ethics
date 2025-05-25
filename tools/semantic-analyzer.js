const fs = require('fs');
const path = require('path');

function loadLexicon() {
  const p = path.join(__dirname, '..', 'i18n', 'semantic-words.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function analyzeSentiment(lang, text) {
  const lexicon = loadLexicon();
  const data = lexicon[lang] || { positive: [], negative: [] };
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  let counts = { positive: 0, negative: 0 };
  for (const w of words) {
    if (data.positive.includes(w)) {
      counts.positive++;
      score++;
    }
    if (data.negative.includes(w)) {
      counts.negative++;
      score--;
    }
  }
  return { score, counts };
}

if (require.main === module) {
  const [lang, ...words] = process.argv.slice(2);
  if (!lang || words.length === 0) {
    console.error('Usage: node semantic-analyzer.js <lang> <text>');
    process.exit(1);
  }
  const result = analyzeSentiment(lang, words.join(' '));
  console.log(JSON.stringify(result, null, 2));
}

module.exports = analyzeSentiment;
