#!/usr/bin/env node
// Diese Struktur wird ohne Gewährleistung bereitgestellt.
// Die Nutzung erfolgt auf eigene Verantwortung.
const fs = require('fs');
const path = require('path');
const file = process.argv[2] || path.join(__dirname, '..', 'app', 'gatekeeper_log.json');
const count = parseInt(process.argv[3] || '10', 10);
if (!fs.existsSync(file)) {
  console.log('No log found.');
  process.exit(0);
}
try {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const entries = Array.isArray(data) ? data.slice(-count) : [];
  for (const e of entries) {
    const ts = new Date(e.ts || 0).toISOString();
    const ok = e.success === undefined ? '' : (e.success ? ' ✓' : ' ✗');
    const reason = e.reason ? ` (${e.reason})` : '';
    console.log(`${ts} ${e.action}${ok}${reason}`);
  }
} catch (err) {
  console.error('Log parse error:', err.message);
}
