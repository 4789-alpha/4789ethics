const test = require('node:test');
const assert = require('node:assert');
const { computeAnonymousConsensus } = require('../interface/ethicom-consensus.js');

test('average consensus calculation', () => {
  const votes = [
    { src_lvl: 'SRC-3' },
    { src_lvl: 'SRC-4' },
    { src_lvl: 'SRC-4' }
  ];
  const result = computeAnonymousConsensus(votes);
  assert.deepStrictEqual(result, {
    derived_src_level: 'SRC-4',
    numeric_average: 3.67,
    consensus_weight: 1.83,
    total_votes: 3
  });
});

test('no votes returns zeros', () => {
  const result = computeAnonymousConsensus([]);
  assert.deepStrictEqual(result, {
    derived_src_level: 'SRC-0',
    numeric_average: 0,
    consensus_weight: 0,
    total_votes: 0
  });
});
