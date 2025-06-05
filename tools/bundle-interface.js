const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'interface');
const outPath = path.join(dir, 'bundle.js');

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.js') && f !== 'bundle.js')
  .sort();

let bundle = '// Generated bundle. Do not edit directly.\n';
for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  bundle += `\n//----- ${file} -----\n`;
  bundle += content + '\n';
}

fs.writeFileSync(outPath, bundle);
console.log(`Bundled ${files.length} files into ${outPath}`);
