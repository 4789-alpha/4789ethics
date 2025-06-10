#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { parseAppConfig, createJwt } = require('./github-app-token.js');

const githubAppCfg = parseAppConfig();

function base32Decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0, value = 0, idx = 0;
  const out = [];
  for (const ch of clean) {
    value = (value << 5) | alphabet.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out[idx++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }
  return Buffer.from(out.slice(0, idx));
}

function totpCode(secret, step) {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(0, 0);
  buf.writeUInt32BE(step, 4);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[19] & 0xf;
  const num = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return String(num).padStart(6, '0');
}

function verifyTotp(secret, code) {
  const t = Math.floor(Date.now() / 30000);
  const c = String(code).padStart(6, '0');
  return [t - 1, t, t + 1].some(step => totpCode(secret, step) === c);
}

function decryptTotpSecret(data) {
  const key = crypto
    .createHash('sha256')
    .update(process.env.TOTP_SECRET_KEY || 'default_totp_key')
    .digest();
  const buf = Buffer.from(data, 'base64');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const enc = buf.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}

function loadUsers() {
  const file = path.join(__dirname, '..', 'app', 'users.json');
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function findUser(email) {
  const emailHash = crypto.createHash('sha256').update(email).digest('hex');
  return loadUsers().find(u => u.emailHash === emailHash);
}

async function requestToken(jwt, installation) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: `/app/installations/${installation}/access_tokens`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': '4789ethics-opauth'
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
  const [email, totp] = process.argv.slice(2);
  if (!email || !totp) {
    console.log('Usage: node tools/github-opauth-token.js <email> <TOTP>');
    process.exit(0);
  }
  const user = findUser(email);
  if (!user || !user.totpSecretEnc || !verifyTotp(decryptTotpSecret(user.totpSecretEnc), totp)) {
    console.error('OPauth verification failed');
    process.exit(1);
  }
  const cfg = githubAppCfg;
  if (!cfg || !cfg.app_id || !cfg.private_key || !cfg.installation_id) {
    console.error('GitHub app config missing in app/github_app_config.yaml');
    process.exit(1);
  }
  const jwt = createJwt(cfg.app_id, cfg.private_key);
  try {
    const token = await requestToken(jwt, cfg.installation_id);
    console.log('Installation token:', token);
  } catch (err) {
    console.error('GitHub app auth failed:', err.message);
  }
}

if (require.main === module) {
  main();
}
