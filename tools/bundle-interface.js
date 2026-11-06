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

// Page-specific modules must not run on unrelated public pages. Each source
// gets its own lexical scope so repeated private names cannot break the bundle.
const pages = {
  'connect.js': ['connect.html'], 'login.js': ['login.html'],
  'signup.js': ['signup.html'], 'offline-login.js': ['offline-login.html'],
  'offline-signup.js': ['offline-signup.html'], 'set-password.js': ['set-password.html'],
  'set-pin.js': ['set-pin.html'], 'navigator.js': ['navigator.html'],
  'session.js': ['ethicom.html','login.html'], 'start.js': ['start.html'],
  'op-story.js': ['op-story.html'], 'ratings.js': ['ratings.html'],
  'ethicom-interface.js': ['ethicom.html']
};
let bundle = '// Generated bundle. Do not edit directly.\n';
for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  bundle += `\n//----- ${file} -----\n`;
  const names = [...content.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(m => m[1]);
  const exports = names.length ? `\nObject.assign(window, { ${names.join(', ')} });\n` : '';
  const guard = pages[file] ? `${JSON.stringify(pages[file])}.includes(location.pathname.split('/').pop())` : 'true';
  const explicit = `Array.from(document.scripts).some(s => s.src && new URL(s.src).pathname.endsWith('/${file}'))`;
  bundle += `\nif (${guard} && !(${explicit})) { (function() {\n${content}\n${exports}\n})(); }\n`;
}

fs.writeFileSync(outPath, bundle);
// Legacy pages refer to /bundle.js; keep that entry point available too.
fs.writeFileSync(path.join(dir, '..', 'bundle.js'), bundle);
console.log(`Bundled ${files.length} files into ${outPath}`);
