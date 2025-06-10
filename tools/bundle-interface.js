const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkg = require('../package.json');
let commit = 'unknown';
try {
  commit = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  // ignore if git info is unavailable
}

const dir = path.join(__dirname, '..', 'interface');
const tmplPath = path.join(dir, 'version-template.js');
if (fs.existsSync(tmplPath)) {
  const tmpl = fs.readFileSync(tmplPath, 'utf8');
  const out = tmpl.replace('__VERSION__', pkg.version).replace('__COMMIT__', commit);
  fs.writeFileSync(path.join(dir, 'version.js'), out);
}

const outPath = path.join(dir, 'bundle.js');

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.js') && f !== 'bundle.js' && f !== 'version-template.js')
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
