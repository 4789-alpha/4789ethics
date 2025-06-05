const fs = require('fs');
const path = require('path');

function readLog(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function watchdogCheck(logPath, limit = 5, windowMs = 300000) {
  const entries = readLog(logPath);
  if (!Array.isArray(entries)) return true;
  const since = Date.now() - windowMs;
  const recent = entries.filter(e => e.ts && e.ts >= since);
  const failures = recent.filter(e => e.action === 'gate_check' && e.success === false);
  return failures.length < limit;
}

if (require.main === module) {
  const isFeed = process.argv[2] === 'feed';
  const argStart = isFeed ? 3 : 2;
  const logFile = process.argv[argStart] || path.join(__dirname, '..', 'app', 'gatekeeper_log.json');
  if (isFeed) {
    feedWatchdog(logFile);
    console.log('Watchdog fed.');
    process.exit(0);
  }
  const limit = parseInt(process.argv[argStart + 1] || '5', 10);
  const windowMs = parseInt(process.argv[argStart + 2] || '300000', 10);
  const ok = watchdogCheck(logFile, limit, windowMs);
  console.log(ok ? 'Watchdog: access stable.' : 'Watchdog: too many denied attempts.');
  if (!ok) process.exit(1);
}

function feedWatchdog(logPath) {
  const file = logPath || path.join(__dirname, '..', 'app', 'gatekeeper_log.json');
  const entries = readLog(file);
  entries.push({ ts: Date.now(), action: 'watchdog_feed' });
  fs.writeFileSync(file, JSON.stringify(entries, null, 2));
}

module.exports = { watchdogCheck, feedWatchdog };
