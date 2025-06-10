const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function listHtml(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(listHtml(p));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function relPath(file, target) {
  return path.relative(path.dirname(file), path.join(root, target)).replace(/\\/g,'/') + '/';
}

function process(file) {
  const skip = ['interface/op-navigation.html','interface/nav-menu.html','interface_OLD/op-navigation.html','aari/index.html'];
  const rel = path.relative(root, file).replace(/\\/g,'/');
  if (skip.includes(rel)) return;
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('<!DOCTYPE html>')) return;

  const lines = text.split(/\n/);
  const out = [];
  const cssPath = relPath(file,'interface');
  const utilsPath = relPath(file,'utils');
  let inserted = false;

  for (const line of lines) {
    if (/ethicom-style\.css/.test(line)) continue;
    if (/script.*interface\//.test(line) && !/bundle\.js/.test(line)) continue;
    if (/script.*(ethicom-utils|color-utils|color-auth|disclaimer|accessibility|auto-outline|theme-manager|logo-background|side-drop|op-side-nav|module-logo|translation-manager|interface-loader|language-selector|touch-features|module-arranger|version)\.js/.test(line)) continue;
    if (/script.*bundle\.js/.test(line)) continue;
    if (/script.*op-level\.js/.test(line)) continue;
    out.push(line);
    if (!inserted && /<title/.test(line)) {
      out.push(`  <link rel="stylesheet" href="${cssPath}ethicom-style.css">`);
      out.push(`  <script src="${cssPath}bundle.js" defer></script>`);
      out.push(`  <script src="${utilsPath}op-level.js"></script>`);
      inserted = true;
    }
  }

  if (!inserted) {
    const idx = out.findIndex(l=>/<head>/.test(l));
    if (idx >= 0) {
      out.splice(idx+1,0,
        `  <link rel="stylesheet" href="${cssPath}ethicom-style.css">`,
        `  <script src="${cssPath}bundle.js" defer></script>`,
        `  <script src="${utilsPath}op-level.js"></script>`);
    }
  }

  fs.writeFileSync(file, out.join('\n'));
}

for (const f of listHtml(root)) {
  process(f);
}
