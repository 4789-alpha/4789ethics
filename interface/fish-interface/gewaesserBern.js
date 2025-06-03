async function initGewaesserBern() {
  const svg = document.getElementById('bern_map');
  if (!svg) return;
  try {
    const data = await fetch('../../sources/maps/bern-waters.json').then(r => r.json());
    const ns = 'http://www.w3.org/2000/svg';

    if (data.outline) {
      const outline = document.createElementNS(ns, 'polygon');
      outline.setAttribute('points', data.outline.map(p => p.join(',')).join(' '));
      outline.setAttribute('fill', '#eef2e9');
      outline.setAttribute('stroke', '#666');
      outline.setAttribute('stroke-width', '0.5');
      svg.appendChild(outline);
    }

    (data.waters || []).forEach(w => {
      if (w.type === 'lake') {
        const poly = document.createElementNS(ns, 'polygon');
        poly.setAttribute('points', w.coords.map(p => p.join(',')).join(' '));
        poly.setAttribute('fill', '#4da6ff');
        poly.setAttribute('stroke', '#3366cc');
        poly.setAttribute('stroke-width', '0.5');
        const title = document.createElementNS(ns, 'title');
        title.textContent = w.name;
        poly.appendChild(title);
        svg.appendChild(poly);
      } else if (w.type === 'line') {
        const line = document.createElementNS(ns, 'polyline');
        line.setAttribute('points', w.coords.map(p => p.join(',')).join(' '));
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', '#3366cc');
        line.setAttribute('stroke-width', '1');
        const title = document.createElementNS(ns, 'title');
        title.textContent = w.name;
        line.appendChild(title);
        svg.appendChild(line);
      }
    });
  } catch (e) {
    svg.textContent = 'Fehler beim Laden der Karte.';
  }
}

document.addEventListener('DOMContentLoaded', initGewaesserBern);
