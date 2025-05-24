const { getOpFunction } = require('./op-functions.js');

const statePath = process.argv[2];
const functions = ['info', 'analyze', 'optimize', 'log'];

functions.forEach(name => {
  const fn = getOpFunction(name, statePath);
  if (fn) {
    console.log(`${name}: available`);
  } else {
    console.log(`${name}: denied`);
  }
});
