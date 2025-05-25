const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const lexPath = path.join(__dirname, '..', 'i18n', 'semantic-words.json');
const lexicon = JSON.parse(fs.readFileSync(lexPath, 'utf8'));

test('semantic word lists contain required fields', () => {
  for (const [lang, obj] of Object.entries(lexicon)) {
    assert.ok(Array.isArray(obj.positive), `${lang} positive missing`);
    assert.ok(Array.isArray(obj.negative), `${lang} negative missing`);
    assert.ok(obj.positive.length >= 3, `${lang} positive length`);
    assert.ok(obj.negative.length >= 3, `${lang} negative length`);
  }
});
