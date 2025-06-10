#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

function parseAppConfig(filePath) {
  const cfgPath = filePath || path.join(__dirname, '..', 'app', 'github_app_config.yaml');
  if (!fs.existsSync(cfgPath)) return null;
  const cfg = {};
  fs.readFileSync(cfgPath, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^(app_id|installation_id|private_key):\s*(.*)$/);
    if (m) cfg[m[1]] = m[2].replace(/['"]/g, '');
  });
  if (cfg.private_key && fs.existsSync(cfg.private_key)) {
    cfg.private_key = fs.readFileSync(cfg.private_key, 'utf8');
  }
  return cfg;
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
}

function createJwt(appId, key) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId }));
  const data = `${header}.${payload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  const sig = base64url(sign.sign(key));
  return `${data}.${sig}`;
}

function requestToken(jwt, installation) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: `/app/installations/${installation}/access_tokens`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': '4789ethics'
      }
    };
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body).token); } catch (e) { reject(e); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const cfg = parseAppConfig();
  if (!cfg || !cfg.app_id || !cfg.private_key || !cfg.installation_id) {
    console.error('GitHub app config missing in app/github_app_config.yaml');
    process.exit(1);
  }
  const jwt = createJwt(cfg.app_id, cfg.private_key);
  const token = await requestToken(jwt, cfg.installation_id);
  console.log('Installation token:', token);
}

if (require.main === module) {
  main().catch(err => console.error('GitHub app auth failed:', err.message));
}

module.exports = { parseAppConfig, createJwt };
