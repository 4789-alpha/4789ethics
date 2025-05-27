const test = require('node:test');
const assert = require('node:assert');
const { handleSources } = require('../tools/serve-interface.js');

test('handleSources returns data', () => {
  let data = null;
  const req = { url: '/api/sources?type=person&limit=1', headers: {} };
  const res = {
    writeHead() {},
    end(chunk) { data = chunk; }
  };
  handleSources(req, res);
  const arr = JSON.parse(data);
  assert.ok(Array.isArray(arr));
  assert.ok(arr.length > 0);
});
