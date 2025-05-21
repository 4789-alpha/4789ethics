const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const uiTextPath = path.join(__dirname, '..', 'i18n', 'ui-text.json');
const uiTexts = JSON.parse(fs.readFileSync(uiTextPath, 'utf8'));

const expectedKeys = [
  'title',
  'label_source',
  'label_srclvl',
  'label_aspects',
  'label_comment',
  'btn_generate',
  'btn_download',
  'aspects'
];

test('all language entries contain required fields', () => {
  for (const [lang, obj] of Object.entries(uiTexts)) {
    for (const key of expectedKeys) {
      assert.ok(Object.prototype.hasOwnProperty.call(obj, key), `${lang} missing ${key}`);
    }
    assert.strictEqual(obj.aspects.length, 5, `${lang} aspects length`);
  }
});
