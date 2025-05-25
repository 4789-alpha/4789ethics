const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'i18n', 'ui-text.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const base = data.de;
for (const [lang, obj] of Object.entries(data)) {
  if (lang === 'de') continue;
  for (const [k, v] of Object.entries(base)) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) {
      obj[k] = v;
    } else if (obj[k] === '' || obj[k] == null || (Array.isArray(obj[k]) && obj[k].length === 0)) {
      obj[k] = v;
    }
  }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
