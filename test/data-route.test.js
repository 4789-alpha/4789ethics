const test = require('node:test');
const assert = require('node:assert');
const events = require('node:events');

const { handleData } = require('../tools/serve-interface.js');

test('GET /api/data responds', () => {
  const req = new events.EventEmitter();
  req.method = 'GET';
  const res = { status: 0, body: '', writeHead(c){this.status=c;}, end(d=''){this.body=d;} };
  handleData(req, res);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body, 'GET erlaubt');
});

test('POST /api/data responds', () => {
  const req = new events.EventEmitter();
  req.method = 'POST';
  const res = { status: 0, body: '', writeHead(c){this.status=c;}, end(d=''){this.body=d;} };
  handleData(req, res);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body, 'POST erlaubt');
});
