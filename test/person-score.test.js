const test = require('node:test');
const assert = require('node:assert');
const { computePersonScores } = require('../tools/person-score');

test('computePersonScores aggregates ratings', () => {
  const ratings = [
    { human_id: 'h1', rating: 'yes', op_level: 'OP-0' },
    { human_id: 'h1', rating: 'no', op_level: 'OP-2' },
    { human_id: 'h2', rating: 'unclear', op_level: 'OP-1' }
  ];
  const result = computePersonScores(ratings);
  assert.deepStrictEqual(result['h1'], {
    average_rating: 0.5,
    average_op_level: 1,
    evaluations: 2,
    score: 5
  });
  assert.deepStrictEqual(result['h2'], {
    average_rating: 0.5,
    average_op_level: 1,
    evaluations: 1,
    score: 5
  });
});
