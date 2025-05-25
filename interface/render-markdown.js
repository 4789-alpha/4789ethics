function convertInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(md) {
  const lines = md.split(/\n/);
  let html = '';
  let inList = false;
  let inCode = false;
  for (let line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        html += '</code></pre>';
        inCode = false;
      } else {
        inCode = true;
        html += '<pre><code>';
      }
      continue;
    }
    if (inCode) {
      html += line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '\n';
      continue;
    }
    if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += '<li>' + convertInline(line.substring(2).trim()) + '</li>';
      continue;
    }
    if (inList) {
      html += '</ul>';
      inList = false;
    }
    let m = line.match(/^(#{1,6})\s+(.*)$/);
    if (m) {
      const level = m[1].length;
      html += `<h${level}>` + convertInline(m[2].trim()) + `</h${level}>`;
      continue;
    }
    if (line.trim() === '') {
      continue;
    }
    html += '<p>' + convertInline(line.trim()) + '</p>';
  }
  if (inList) html += '</ul>';
  if (inCode) html += '</code></pre>';
  return html;
}
