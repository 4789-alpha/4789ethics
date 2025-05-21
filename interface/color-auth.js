function verifyColorAuth() {
  const stored = localStorage.getItem('ethicom_color');
  const colors = ['rot', 'gruen', 'grün', 'blau', 'gelb'];
  let question = stored
    ? 'War deine letzte Farbe gleich (beim letzten Start)? (rot, grün, blau, gelb)'
    : 'Wähle eine Grundfarbe zur Authentifizierung (rot, grün, blau, gelb):';
  const input = prompt(question);
  if (!input) return;
  const value = input.trim().toLowerCase();
  if (!colors.includes(value)) {
    alert('Nur Grundfarben rot, grün, blau, gelb wählbar.');
    return;
  }
  const normalized = value === 'gruen' ? 'grün' : value; // allow ue
  if (stored) {
    if (normalized === stored) {
      alert('Farbe bestätigt. Willkommen zurück.');
    } else {
      alert('Hinweis: falscher User, keine Bestätigung.');
    }
  } else {
    localStorage.setItem('ethicom_color', normalized);
    alert('Farbe gespeichert: ' + normalized);
  }
}

window.addEventListener('DOMContentLoaded', verifyColorAuth);
