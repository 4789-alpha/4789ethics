const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchRates(base = 'USD') {
  return new Promise((resolve, reject) => {
    const url = `https://api.exchangerate.host/latest?base=${base}`;
    https
      .get(url, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

async function saveRates(base = 'USD') {
  const rates = await fetchRates(base);
  const outDir = path.join(__dirname, '..', 'references');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'exchange-rates.json');
  fs.writeFileSync(outPath, JSON.stringify(rates, null, 2));
  return outPath;
}

if (require.main === module) {
  const base = process.argv[2] || 'USD';
  saveRates(base)
    .then(p => console.log('Saved exchange rates to', p))
    .catch(err => {
      console.error('Failed to fetch exchange rates:', err.message);
    });
}

module.exports = { fetchRates };
