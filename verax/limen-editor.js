(() => {
  let map;
  const track = [];
  const waypoints = [];
  let trackLayer = null;
  let drawnItems;

  function initMap() {
    map = L.map('map').setView([46.8345, 7.4953], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on('draw:edited', onEdited);
    map.on('draw:deleted', onDeleted);
  }

  function onCreated(e) {
    const layer = e.layer;
    drawnItems.addLayer(layer);
    if (e.layerType === 'polyline') {
      trackLayer = layer;
      updateTrack();
    } else if (e.layerType === 'marker') {
      const data = { lat: layer.getLatLng().lat, lng: layer.getLatLng().lng, story: '' };
      layer.meta = data;
      waypoints.push(data);
      const form = document.createElement('div');
      const text = document.createElement('textarea');
      text.rows = 2;
      text.placeholder = 'Kurztext...';
      const btn = document.createElement('button');
      btn.textContent = 'Speichern';
      form.appendChild(text);
      form.appendChild(btn);
      btn.addEventListener('click', () => {
        data.story = text.value.trim();
        layer.closePopup();
        if (data.story) layer.bindPopup(data.story);
      });
      layer.bindPopup(form).openPopup();
    }
  }

  function onEdited(e) {
    e.layers.eachLayer(layer => {
      if (layer === trackLayer) {
        updateTrack();
      } else if (layer.meta) {
        layer.meta.lat = layer.getLatLng().lat;
        layer.meta.lng = layer.getLatLng().lng;
      }
    });
  }

  function onDeleted(e) {
    e.layers.eachLayer(layer => {
      if (layer === trackLayer) {
        track.length = 0;
        trackLayer = null;
      } else if (layer.meta) {
        const idx = waypoints.indexOf(layer.meta);
        if (idx !== -1) waypoints.splice(idx, 1);
      }
    });
  }

  function updateTrack() {
    if (!trackLayer) return;
    const pts = trackLayer.getLatLngs();
    track.length = 0;
    pts.forEach(p => track.push({ lat: p.lat, lng: p.lng }));
  }

  function exportJSON() {
    const data = { track, waypoints };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'limen.json');
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function exportGPX() {
    const parts = ['<?xml version="1.0" encoding="UTF-8"?>', '<gpx version="1.1" creator="limen-editor">'];
    waypoints.forEach((w, i) => {
      parts.push(`<wpt lat="${w.lat}" lon="${w.lng}"><name>${i + 1}</name><desc>${escapeHTML(w.story)}</desc></wpt>`);
    });
    if (track.length) {
      parts.push('<trk><trkseg>');
      track.forEach(p => {
        parts.push(`<trkpt lat="${p.lat}" lon="${p.lng}"></trkpt>`);
      });
      parts.push('</trkseg></trk>');
    }
    parts.push('</gpx>');
    const blob = new Blob([parts.join('')], { type: 'application/gpx+xml' });
    downloadBlob(blob, 'limen.gpx');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('export_json').addEventListener('click', exportJSON);
    document.getElementById('export_gpx').addEventListener('click', exportGPX);
  });
})();
