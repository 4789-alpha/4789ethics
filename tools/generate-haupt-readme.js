const fs = require('fs');
const path = require('path');

const lang = process.argv[2] || 'de';
const repoRoot = path.join(__dirname, '..');
const src = path.join(repoRoot, 'i18n', `README.${lang}.md`);

if (!fs.existsSync(src)) {
  console.error(`No README translation found for '${lang}'.`);
  process.exit(1);
}

const dest = path.join(repoRoot, 'interface', 'haupt-readme.md');
fs.copyFileSync(src, dest);
console.log(`Generated ${dest} from ${src}`);

