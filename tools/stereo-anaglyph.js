let createCanvas, loadImage;
try {
  ({ createCanvas, loadImage } = require('canvas'));
} catch {
  console.error('The "canvas" package is required for stereo-anaglyph.');
  console.error('Install it with "npm install canvas" and ensure native libs build.');
  process.exit(1);
}
const fs = require('fs');

async function stereoToAnaglyph(leftPath, rightPath, outputPath, options = {}) {
  const { shift = 0 } = options;

  const leftImg = await loadImage(leftPath);
  const rightImg = await loadImage(rightPath);
  const width = Math.min(leftImg.width, rightImg.width);
  const height = Math.min(leftImg.height, rightImg.height);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(leftImg, 0, 0, width, height);
  const leftData = ctx.getImageData(0, 0, width, height);

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(rightImg, shift, 0, width, height);
  const rightData = ctx.getImageData(0, 0, width, height);

  const result = ctx.createImageData(width, height);
  for (let i = 0; i < result.data.length; i += 4) {
    result.data[i] = leftData.data[i];       // red from left
    result.data[i + 1] = rightData.data[i + 1]; // green from right
    result.data[i + 2] = rightData.data[i + 2]; // blue from right
    result.data[i + 3] = 255;
  }
  ctx.putImageData(result, 0, 0);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

if (require.main === module) {
  const [left, right, out, focus] = process.argv.slice(2);
  if (!left || !right || !out) {
    console.error('Usage: node stereo-anaglyph.js <left> <right> <output> [foreground|full]');
    process.exit(1);
  }
  const shift = focus === 'foreground' ? -20 : 0;
  stereoToAnaglyph(left, right, out, { shift }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = stereoToAnaglyph;
