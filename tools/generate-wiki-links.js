const fs = require('fs');
const path = require('path');

function loadCandidates() {
  const file = path.join(__dirname, '..', 'sources', 'human-op0-candidates.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function buildWikiLink(name) {
  const base = 'https://en.wikipedia.org/wiki/';
  return base + encodeURIComponent(name.replace(/\s+/g, '_'));
}

function generateLinks(candidates) {
  return candidates.map(c => ({
    human_id: c.human_id,
    name: c.name,
    wiki: buildWikiLink(c.name)
  }));
}

function main() {
  const candidates = loadCandidates();
  const links = generateLinks(candidates);
  const outPath = path.join(__dirname, '..', 'references', 'human-wiki-links.json');
  fs.writeFileSync(outPath, JSON.stringify(links, null, 2));
  console.log('Wrote wiki links to', outPath);
}

if (require.main === module) {
  main();
}

module.exports = { loadCandidates, buildWikiLink, generateLinks };
