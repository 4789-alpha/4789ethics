const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const [,, gpxInput, stopsInput] = process.argv;
if (!gpxInput || !stopsInput) {
  console.error('Usage: node tools/verax-save.js <route.gpx> <stops.json>');
  process.exit(1);
}

const destGpx = path.join(__dirname, '..', 'verax', 'map', path.basename(gpxInput));
fs.copyFileSync(gpxInput, destGpx);

const stops = JSON.parse(fs.readFileSync(stopsInput, 'utf8'));
const codexPath = path.join(__dirname, '..', 'verax', 'codex', 'verax.yaml');
const doc = yaml.load(fs.readFileSync(codexPath, 'utf8')) || {};
doc.stops = doc.stops || [];
doc.stops.push(...stops);
fs.writeFileSync(codexPath, yaml.dump(doc, { lineWidth: 0 }));

console.log('Route saved to', destGpx);
