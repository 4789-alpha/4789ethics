const fs = require('fs');
const path = require('path');

const pages = [
  { source: 'README.md', dest: 'Home.md' },
  { source: 'GET_STARTED.md', dest: 'Get-Started.md' },
  { source: 'CONTRIBUTING.md', dest: 'Contributing.md' },
  { source: 'PROJECT_CHECKLIST.md', dest: 'Project-Checklist.md' },
  { source: 'LICENSE.txt', dest: 'License.md' },
  { source: 'DISCLAIMERS.md', dest: 'Disclaimers.md' }
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

function convert(sourcePath) {
  let data = fs.readFileSync(sourcePath, 'utf8');
  if (sourcePath.endsWith('.txt')) {
    data = '```\n' + data + '\n```\n';
  }
  return data;
}

function main() {
  const wikiDir = path.join(__dirname, '..', 'wiki');
  ensureDir(wikiDir);
  for (const p of pages) {
    const src = path.join(__dirname, '..', p.source);
    const dest = path.join(wikiDir, p.dest);
    const content = convert(src);
    fs.writeFileSync(dest, content);
    console.log('Wrote', dest);
  }
}

if (require.main === module) {
  main();
}
