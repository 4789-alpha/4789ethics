const apiAccessAllowed = require('./api-access.js');

const OP_FUNCTIONS = {
  info: {
    minLevel: 'OP-1',
    fn: () => 'General information.'
  },
  analyze: {
    minLevel: 'OP-4',
    fn: () => 'Analysis complete.'
  },
  optimize: {
    minLevel: 'OP-7',
    fn: () => 'Optimization done.'
  }
};

function getOpFunction(name, userStatePath) {
  const entry = OP_FUNCTIONS[name];
  if (!entry) return null;
  if (apiAccessAllowed(entry.minLevel, userStatePath)) {
    return entry.fn;
  }
  return null;
}

if (require.main === module) {
  const name = process.argv[2] || 'info';
  const fn = getOpFunction(name);
  if (fn) {
    console.log(fn());
  } else {
    console.log('Access denied or function missing.');
  }
}

module.exports = { getOpFunction };
