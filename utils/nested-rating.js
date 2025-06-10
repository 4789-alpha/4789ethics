const { opLevelToNumber } = require('./op-level.js');

function storeRating(storage, rating) {
  const level = opLevelToNumber(rating.op_level);
  let arr = storage;
  for (let i = 0; i < level; i++) {
    if (!Array.isArray(arr[i])) arr[i] = [];
    arr = arr[i];
  }
  if (!Array.isArray(arr[level])) arr[level] = [];
  arr[level].push(rating);
}

function buildNestedRatings(list) {
  const root = [];
  list.forEach(r => storeRating(root, r));
  return root;
}

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const p = path.join(__dirname, '..', 'evidence', 'person-ratings.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const nested = buildNestedRatings(data);
  console.log(JSON.stringify(nested, null, 2));
}

module.exports = { storeRating, buildNestedRatings };
