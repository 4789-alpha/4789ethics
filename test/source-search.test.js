const test = require('node:test');
const assert = require('node:assert');
const { search } = require('../tools/source-search.js');

test('returns exact name first', () => {
  const res = search('Albert Einstein', { type: 'person', limit: 3 });
  assert.ok(res.length > 0, 'no results');
  assert.strictEqual(res[0].name, 'Albert Einstein');
});

test('filters by category', () => {
  const res = search('Ecosia', { type: 'org', field: 'category', value: 'search', limit: 1 });
  assert.ok(res.length > 0, 'no results');
  assert.ok(res[0].title.includes('Ecosia'));
});
