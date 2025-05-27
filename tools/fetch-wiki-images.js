const fs = require('fs');
const path = require('path');

// Fetch thumbnails from Wikipedia for each candidate.
// Ensure usage complies with LICENSE.txt and DISCLAIMERS.md.

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const file = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    res.body.pipe(file);
    res.body.on('error', reject);
    file.on('finish', resolve);
  });
}

async function main() {
  const file = path.join(__dirname, '..', 'sources', 'persons', 'human-op0-candidates.json');
  const list = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;

  for (const c of list) {
    const title = encodeURIComponent(c.name.replace(/\s+/g, '_'));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
    try {
      const info = await fetchJson(url);
      const img = info.originalimage?.source || info.thumbnail?.source;
      if (!img) continue;
      const ext = path.extname(new URL(img).pathname).split('?')[0] || '.jpg';
      const out = path.join(__dirname, '..', 'person-images', `${c.human_id}${ext}`);
      await download(img, out);
      c.image = `person-images/${path.basename(out)}`;
      changed = true;
      console.log('Saved', c.name);
    } catch (err) {
      console.error('Skip', c.name, err.message);
    }
  }

  if (changed) {
    fs.writeFileSync(file, JSON.stringify(list, null, 2) + '\n');
    console.log('Updated candidate file');
  }
}

if (require.main === module) {
  main();
}
