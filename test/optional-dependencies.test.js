const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');

function runNode(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
}

test('serve-interface warns if canvas is missing', {
  skip: (() => { try { require.resolve('canvas'); return true; } catch { return false; } })()
}, () => {
  const res = runNode(['-e', "require('./tools/serve-interface.js')"]);
  assert.strictEqual(res.status, 0);
  assert.match(res.stderr, /Optional dependency "canvas" missing/);
});

test('stereo-anaglyph exits when canvas missing', {
  skip: (() => { try { require.resolve('canvas'); return true; } catch { return false; } })()
}, () => {
  const script = path.join(root, 'tools', 'stereo-anaglyph.js');
  const res = runNode([script, 'left.png', 'right.png', 'out.png']);
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /canvas/);
});

test('text_to_speech exits when pyttsx3 missing', () => {
  const script = path.join(root, 'tools', 'text_to_speech.py');
  const res = spawnSync('python3', [script, 'hello'], { encoding: 'utf8' });
  assert.strictEqual(res.status, 1);
  const output = res.stdout + res.stderr;
  assert.match(output, /pyttsx3 not installed/);
});
