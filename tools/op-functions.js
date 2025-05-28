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
  },
  recommendation_for_interface: {
    minLevel: 'OP-5',
    fn: () => 'Consider simplifying navigation and clarifying button labels.'
  },
  log: {
    minLevel: 'OP-2',
    fn: () => {
      try {
        const { execSync } = require('child_process');
        return execSync('git log --oneline -n 5', { encoding: 'utf8' });
      } catch (err) {
        return 'Log could not be retrieved.';
      }
    }
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
  const [arg1, arg2] = process.argv.slice(2);
  if (arg1 === '--help' || arg1 === '-h') {
    console.log('Usage: node tools/op-functions.js <function> [statePath]');
    process.exit(0);
  }
  const name = arg1 || 'info';
  const fn = getOpFunction(name, arg2);
  if (fn) {
    console.log(fn());
  } else {
    console.log('Access denied or function missing.');
  }
}

module.exports = { getOpFunction };
