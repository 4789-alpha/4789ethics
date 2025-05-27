const fs = require('fs');
const path = require('path');

function loadSources(type) {
  const dir = path.join(
    __dirname,
    '..',
    'sources',
    type === 'person' ? 'persons' : type === 'fish' ? 'fish' : 'institutions'
  );
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const items = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (Array.isArray(data)) items.push(...data); else items.push(data);
  }
  return items;
}

function levenshtein(a, b) {
  const m = a.length; const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  if (!a || !b) return 0;
  const dist = levenshtein(a.toLowerCase(), b.toLowerCase());
  return 1 - dist / Math.max(a.length, b.length);
}

function search(query, opts = {}) {
  const type = opts.type || 'person';
  const field = opts.field;
  const value = opts.value ? String(opts.value).toLowerCase() : null;
  const limit = opts.limit || 5;

  let items = loadSources(type);
  if (field && value) {
    items = items.filter(it => String(it[field] || '').toLowerCase().includes(value));
  }

  const results = items
    .map(it => {
      const name = it.name || it.title || '';
      return { item: it, score: similarity(query, name) };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.item);

  return results;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('Usage: node tools/source-search.js <query> [--type=person|org] [--field=domain|category] [--value=value] [--limit=n]');
    process.exit(0);
  }
  const query = args.shift();
  const opts = {};
  args.forEach(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    if (k === 'type') opts.type = v;
    else if (k === 'field') opts.field = v;
    else if (k === 'value') opts.value = v;
    else if (k === 'limit') opts.limit = parseInt(v, 10);
  });
  const results = search(query, opts);
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${(r.name || r.title)} (${r.human_id || r.source_id || ''})`);
  });
}

module.exports = { search, loadSources };
