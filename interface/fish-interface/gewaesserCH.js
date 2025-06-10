async function initGewaesserCH() {
  const mapElem = document.getElementById('ch_map');
  if (!mapElem) return;

  const map = L.map(mapElem).setView([46.8, 8.2], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  try {
    const data = await fetch('../../sources/maps/swiss-waters.json').then(r => r.json());
    const colors = { regal: '#4da6ff', pacht: '#ff9900', frei: '#66cc66' };
    (data.cantons || []).forEach(c => {
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 8,
        color: colors[c.type] || '#666',
        fillColor: colors[c.type] || '#666',
        fillOpacity: 0.8
      }).addTo(map);
      marker.bindPopup(`${c.name} (${c.type})`);
    });
  } catch (e) {
    mapElem.textContent = 'Karte konnte nicht geladen werden.';
  }
}

document.addEventListener('DOMContentLoaded', initGewaesserCH);
