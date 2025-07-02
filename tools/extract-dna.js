#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const yaml = require('js-yaml');

if (process.argv.length < 4) {
  console.log('Usage: node tools/extract-dna.js <pdf-file> <identity.yaml>');
  process.exit(1);
}

const pdfFile = process.argv[2];
const idFile = process.argv[3];

async function run() {
  let data;
  try {
    data = await pdfParse(fs.readFileSync(pdfFile));
  } catch (err) {
    console.error('Failed to parse PDF:', err.message);
    return;
  }
  const match = data.text.match(/[ATCG]{10,}/i);
  if (!match) {
    console.log('No DNA sequence found');
    return;
  }
  const dna = match[0];
  let obj = {};
  if (fs.existsSync(idFile)) {
    obj = yaml.load(fs.readFileSync(idFile, 'utf8')) || {};
  }
  obj.DNA = dna;
  fs.writeFileSync(idFile, yaml.dump(obj));
  console.log('DNA sequence stored');
}

run();
