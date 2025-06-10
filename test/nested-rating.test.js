const test = require('node:test');
const assert = require('node:assert');
const { buildNestedRatings } = require('../utils/nested-rating.js');

test('buildNestedRatings stores entries based on OP level', () => {
  const list = [
    { op_level: 'OP-0', rating: 'yes' },
    { op_level: 'OP-2', rating: 'no' }
  ];
  const nested = buildNestedRatings(list);
  assert.deepStrictEqual(nested[0][0], { op_level: 'OP-0', rating: 'yes' });
  assert.deepStrictEqual(nested[0][1][2][0], { op_level: 'OP-2', rating: 'no' });
});
