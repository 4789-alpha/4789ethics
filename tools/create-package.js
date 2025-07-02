#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const outDir = path.join(__dirname, '..', 'releases');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const archive = path.join(outDir, `interface-${process.platform}.zip`);
execSync(`zip -r ${archive} interface`, { stdio: 'inherit' });
console.log(`Created ${archive}`);
