const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const PDFDocument = require('pdfkit');
const yaml = require('js-yaml');

test('extracts DNA from PDF into identity record', () => {
  const pdfFile = path.join(os.tmpdir(), 'dna.pdf');
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(pdfFile);
  doc.pipe(stream);
  doc.text('Sample sequence AAAACCCGGGTTTAA');
  doc.end();
  return new Promise(resolve => {
    stream.on('finish', () => {
      const idFile = path.join(os.tmpdir(), 'id.yaml');
      spawnSync('python3', ['gatekeeper/pdf_dna_extract.py', pdfFile, idFile]);
      const data = yaml.load(fs.readFileSync(idFile, 'utf8'));
      assert.ok(data.DNA.startsWith('AAAACCCGGGTTT'));
      fs.rmSync(pdfFile, { force: true });
      fs.rmSync(idFile, { force: true });
      resolve();
    });
  });
});
