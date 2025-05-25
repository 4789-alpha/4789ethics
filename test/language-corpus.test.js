const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const corpusPath = path.join(__dirname, '..', 'i18n', 'language-corpus.json');
const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));

test('language corpus structure valid', () => {
  for (const [lang, words] of Object.entries(corpus)) {
    assert.strictEqual(typeof words, 'object', `${lang} not object`);
    for (const [w, c] of Object.entries(words)) {
      assert.strictEqual(typeof w, 'string');
      assert.strictEqual(typeof c, 'number');
      assert.ok(c >= 1);
    }
  }
});
