const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'i18n', 'ui-text.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const base = data.en;
const keys = Object.keys(base);

function isEmpty(val) {
  if (Array.isArray(val)) return val.length === 0 || val.every(v => !v);
  return val === undefined || val === null || val === '';
}

const results = {};
for (const [lang, obj] of Object.entries(data)) {
  const missing = [];
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(obj, k) || isEmpty(obj[k])) {
      missing.push(k);
    }
  }
  if (missing.length) results[lang] = missing;
}

for (const lang of Object.keys(results)) {
  console.log(`${lang} missing: ${results[lang].join(', ')}`);
}

if (!Object.keys(results).length) {
  console.log('All languages have full translations.');
}
