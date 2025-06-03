const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function assembleOp8(outputPath) {
  const repoRoot = path.join(__dirname, '..');
  const op7Path = path.join(repoRoot, 'sources', 'images', 'op-logo', 'tanna_op7.png');
  if (!fs.existsSync(op7Path)) {
    console.error('tanna_op7.png not found.');
    process.exit(1);
  }

  const img = await loadImage(op7Path);

  const width = img.width * 2;
  const height = img.height;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);
  ctx.drawImage(img, img.width, 0);

  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#39FF14';
  ctx.fillRect(0, 0, width, height);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Generated', outputPath);
}

if (require.main === module) {
  const out = process.argv[2] || path.join(__dirname, '..', 'sources', 'images', 'op-logo', 'tanna_op8.png');
  assembleOp8(out).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = assembleOp8;
