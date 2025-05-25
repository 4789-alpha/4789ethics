const test = require('node:test');
const assert = require('node:assert');
const { computeScores } = require('../tools/ethik-score');

test('computeScores averages correctly', () => {
  const perSource = {
    'src-001': [4, 4, 5],
    'src-002': [2]
  };
  const result = computeScores(perSource);
  assert.deepStrictEqual(result['src-001'], {
    score: 4.33,
    level: 'SRC-4',
    evaluations: 3,
    percent: 54
  });
  assert.deepStrictEqual(result['src-002'], {
    score: 2,
    level: 'SRC-2',
    evaluations: 1,
    percent: 25
  });
});
