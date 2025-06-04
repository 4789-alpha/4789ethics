const fs = require('fs');
const path = require('path');

const [,, id, ...titleParts] = process.argv;
if (!id || !titleParts.length) {
  console.error('Usage: node tools/create-department.js <id> <title...>');
  process.exit(1);
}
const title = titleParts.join(' ');

const dataPath = path.join(__dirname, '..', 'sources', 'departments', 'bsvrb.json');
const imgDir = path.join(__dirname, '..', 'sources', 'images', 'departments');
const imgName = `logo-${id}.svg`;

fs.mkdirSync(path.dirname(dataPath), { recursive: true });
fs.mkdirSync(imgDir, { recursive: true });

let list = [];
if (fs.existsSync(dataPath)) {
  list = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

if (list.some(d => d.dept_id === id)) {
  console.error('Department already exists.');
  process.exit(1);
}

list.push({ dept_id: id, title, image: `sources/images/departments/${imgName}`, points: [] });
fs.writeFileSync(dataPath, JSON.stringify(list, null, 2) + '\n');

const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='60'><rect width='120' height='60' fill='#ddd'/><text x='60' y='35' font-size='12' text-anchor='middle' fill='#333'>${id}</text></svg>\n`;
fs.writeFileSync(path.join(imgDir, imgName), svg);
console.log('Created department', id);
