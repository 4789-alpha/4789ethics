const test = require('node:test');
const assert = require('node:assert');
const app = require('../backend/server.js');

let server;

test.before(async () => {
  server = app.listen(0);
  await new Promise(r => server.once('listening', r));
});

test.after(() => {
  server.close();
});

test('status route returns ok', async () => {
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/status`);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
});
