const fs = require('fs');
const path = require('path');

const corpusPath = path.join(__dirname, '..', 'i18n', 'language-corpus.json');

function loadCorpus() {
  if (!fs.existsSync(corpusPath)) return {};
  return JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
}

function saveCorpus(data) {
  fs.writeFileSync(corpusPath, JSON.stringify(data, null, 2));
}

function addText(lang, text) {
  const corpus = loadCorpus();
  if (!corpus[lang]) corpus[lang] = {};
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  for (const w of words) {
    corpus[lang][w] = (corpus[lang][w] || 0) + 1;
  }
  saveCorpus(corpus);
  return corpus;
}

if (require.main === module) {
  const [lang, input] = process.argv.slice(2);
  if (!lang || !input) {
    console.error('Usage: node language-corpus.js <lang> <text|file>');
    process.exit(1);
  }

  let text = input;
  if (fs.existsSync(input)) {
    text = fs.readFileSync(input, 'utf8');
  }

  addText(lang, text);
  console.log(`Words for ${lang} recorded to language-corpus.json`);
}

module.exports = { addText, loadCorpus };
