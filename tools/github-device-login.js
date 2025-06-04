#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

function parseOAuthConfig(filePath) {
  const cfgPath = filePath || path.join(__dirname, '..', 'app', 'oauth_config.yaml');
  if (!fs.existsSync(cfgPath)) return null;
  const lines = fs.readFileSync(cfgPath, 'utf8').split(/\r?\n/);
  const cfg = { github: {}, google: {} };
  let section = null;
  lines.forEach(line => {
    const sec = line.trim().match(/^([a-zA-Z]+):\s*$/);
    if (sec) { section = sec[1].toLowerCase(); return; }
    const m = line.trim().match(/^(client_id|client_secret):\s*(.*)$/);
    if (section && m && cfg[section]) {
      cfg[section][m[1]] = m[2].replace(/['"]/g, '');
    }
  });
  return cfg;
}

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function requestDeviceCode(clientId) {
  return new Promise((resolve, reject) => {
    const postData = `client_id=${clientId}&scope=read:user`;
    const opts = {
      hostname: 'github.com',
      path: '/login/device/code',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        accept: 'application/json',
        'User-Agent': '4789ethics'
      }
    };
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function pollForToken(clientId, deviceCode, secret, interval) {
  return new Promise((resolve, reject) => {
    function attempt() {
      const data = `client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code&client_secret=${secret}`;
      const opts = {
        hostname: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
          accept: 'application/json',
          'User-Agent': '4789ethics'
        }
      };
      const rq = https.request(opts, r => {
        let body = '';
        r.on('data', c => { body += c; });
        r.on('end', () => {
          try {
            const res = JSON.parse(body);
            if (res.error === 'authorization_pending') {
              setTimeout(attempt, (interval || 5) * 1000);
            } else if (res.access_token) {
              resolve(res.access_token);
            } else {
              reject(new Error(res.error || 'Auth failed'));
            }
          } catch (e) { reject(e); }
        });
      });
      rq.on('error', reject);
      rq.write(data);
      rq.end();
    }
    attempt();
  });
}

function fetchGithubLogin(token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'User-Agent': '4789ethics',
        Authorization: `token ${token}`,
        accept: 'application/json'
      }
    };
    const rq = https.request(opts, r => {
      let data = '';
      r.on('data', c => { data += c; });
      r.on('end', () => {
        try { const u = JSON.parse(data); resolve(u.login); } catch (e) { reject(e); }
      });
    });
    rq.on('error', reject);
    rq.end();
  });
}

function saveUser(login, token) {
  const file = path.join(__dirname, '..', 'app', 'users.json');
  const users = readJson(file);
  const ghHash = crypto.createHash('sha256').update(login).digest('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  let user = users.find(u => u.githubHash === ghHash);
  if (!user) {
    user = {
      id: 'SIG-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
      op_level: 'OP-1',
      githubHash: ghHash,
      tokenHash,
      auth_verified: false,
      level_change_ts: new Date().toISOString()
    };
    users.push(user);
  } else {
    user.tokenHash = tokenHash;
  }
  writeJson(file, users);
  return user;
}

async function main() {
  const cfg = parseOAuthConfig();
  if (!cfg || !cfg.github || !cfg.github.client_id || !cfg.github.client_secret) {
    console.error('GitHub OAuth credentials missing in app/oauth_config.yaml');
    process.exit(1);
  }
  const { client_id, client_secret } = cfg.github;
  const data = await requestDeviceCode(client_id);
  if (!data.device_code) throw new Error('Invalid response');
  console.log('Open', data.verification_uri, 'and enter code:', data.user_code);
  console.log('Waiting for authorization...');
  const token = await pollForToken(client_id, data.device_code, client_secret, data.interval);
  const login = await fetchGithubLogin(token);
  const user = saveUser(login, token);
  console.log(`Logged in as ${login}. ID stored: ${user.id}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('GitHub device login failed:', err.message);
  });
}

module.exports = { main };
