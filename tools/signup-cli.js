#!/usr/bin/env node
const events = require('events');
const { handleSignup } = require('./serve-interface.js');

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node tools/signup-cli.js <email> <password> [--nick=<n>] [--addr=<a>] [--country=<c>] [--phone=<p>]');
    process.exit(0);
  }
  const [email, password, ...rest] = args;
  const opts = {};
  for (const arg of rest) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k === 'nick') opts.nickname = v;
    else if (k === 'addr') opts.address = v;
    else if (k === 'country') opts.country = v;
    else if (k === 'phone') opts.phone = v;
  }
  const req = new events.EventEmitter();
  const res = { status: 0, body: '', writeHead(code) { this.status = code; }, end(d) { if (d) this.body += d; } };
  handleSignup(req, res);
  req.emit('data', JSON.stringify({ email, password, ...opts }));
  req.emit('end');
  if (res.status === 200) {
    const data = JSON.parse(res.body);
    console.log('ID:', data.id);
    if (data.alias) console.log('Alias:', data.alias);
    console.log('TOTP secret:', data.secret);
  } else {
    console.error('Signup failed. Please check the provided data:', res.body || res.status);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
