const test = require('node:test');
const assert = require('node:assert');
const { list } = require('../tools/source-manager.js');

test('lists persons sorted by name', () => {
  const res = list({ type: 'person', sort: 'name' });
  assert.ok(res.length > 1, 'not enough persons');
  assert.ok(res[0].name <= res[1].name, 'not sorted by name');
});

test('lists orgs sorted by category', () => {
  const res = list({ type: 'org', sort: 'category' });
  assert.ok(res.length > 1, 'not enough orgs');
  assert.ok(res[0].category <= res[1].category, 'not sorted by category');
});
