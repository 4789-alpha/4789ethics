const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const zipPath = process.argv[2] || path.join(__dirname, '..', 'downloads', 'personal-gatekeeper.zip');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gatekeeper-'));

const genScript = path.join(__dirname, 'generate-gatekeeper-image.js');
const res = spawnSync('node', [genScript, tempDir], { stdio: 'inherit' });
if (res.status !== 0) {
  fs.rmSync(tempDir, { recursive: true, force: true });
  process.exit(res.status);
}

const zipRes = spawnSync('zip', ['-r', zipPath, path.basename(tempDir)], {
  cwd: path.dirname(tempDir),
  stdio: 'inherit'
});
fs.rmSync(tempDir, { recursive: true, force: true });
if (zipRes.status !== 0) process.exit(zipRes.status);

console.log(`Personal gatekeeper archive created at ${zipPath}`);
