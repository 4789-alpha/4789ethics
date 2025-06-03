const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'i18n', 'ui-text.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const base = data.de;
const keys = Object.keys(base);

function isEmpty(val) {
  if (Array.isArray(val)) return val.length === 0 || val.every(v => !v);
  return val === undefined || val === null || val === '';
}

const results = {};
for (const [lang, obj] of Object.entries(data)) {
  if (lang === 'de' || lang.startsWith('de-')) continue;
  const missing = [];
  const same = [];
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(obj, k) || isEmpty(obj[k])) {
      missing.push(k);
    } else if (JSON.stringify(obj[k]) === JSON.stringify(base[k])) {
      same.push(k);
    }
  }
  if (missing.length || same.length) results[lang] = { missing, same };
}

for (const [lang, info] of Object.entries(results)) {
  const msgs = [];
  if (info.missing.length) msgs.push(`missing: ${info.missing.join(', ')}`);
  if (info.same.length) msgs.push(`likely untranslated: ${info.same.join(', ')}`);
  console.log(`${lang} ${msgs.join('; ')}`);
}

if (!Object.keys(results).length) {
  console.log('All languages have full translations.');
}
