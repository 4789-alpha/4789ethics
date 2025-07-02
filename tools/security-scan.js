#!/usr/bin/env node
const { execSync } = require('child_process');
try {
  execSync('npm audit --json', { stdio: 'inherit' });
} catch (err) {
  process.exitCode = 1;
}
