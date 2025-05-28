const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const files = {
  config: path.join(__dirname, '..', 'app', 'gatekeeper_config.yaml'),
  devices: path.join(__dirname, '..', 'app', 'gatekeeper_devices.json')
};

const expected = {
  config: '31ec110351ccb7173d6b37ad72e2ff51e0f492f95d41cf8541132285bf1e62ba',
  devices: 'ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356'
};

function sha256(file) {
  if (!fs.existsSync(file)) return null;
  const data = fs.readFileSync(file);
  return crypto.createHash('sha256').update(data).digest('hex');
}

let ok = true;
for (const [key, file] of Object.entries(files)) {
  const hash = sha256(file);
  if (!hash) {
    console.log(`${file} missing.`);
    ok = false;
    continue;
  }
  if (hash !== expected[key]) {
    console.log(`${path.basename(file)} mismatch: ${hash}`);
    ok = false;
  } else {
    console.log(`${path.basename(file)} OK`);
  }
}

if (!ok) {
  process.exit(1);
} else {
  console.log('Gatekeeper files verified.');
}
