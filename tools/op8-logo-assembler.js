const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function assembleOp8(outputPath) {
  const repoRoot = path.join(__dirname, '..');
  const op7Path = path.join(repoRoot, 'op-logo', 'tanna_op7.png');
  if (!fs.existsSync(op7Path)) {
    console.error('tanna_op7.png not found.');
    process.exit(1);
  }

  const img = await loadImage(op7Path);
  const side = Math.max(img.width, img.height);
  const canvas = createCanvas(side, side);
  const ctx = canvas.getContext('2d');

  ctx.translate(side / 2, side / 2);

  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();

  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();

  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#39FF14';
  ctx.fillRect(-side / 2, -side / 2, side, side);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Generated', outputPath);
}

if (require.main === module) {
  const out = process.argv[2] || path.join(__dirname, '..', 'op-logo', 'tanna_op8.png');
  assembleOp8(out).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = assembleOp8;
