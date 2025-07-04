# Kurzanleitung in einfacher Sprache

Diese Sammlung heisst "Ethics Structure 4789". Sie hilft, Verantwortung vor Bequemlichkeit zu stellen.

## So fängst du an

1. [README.md](README.md) lesen. Hier erfährst du, worum es geht.
2. [GET_STARTED.md](GET_STARTED.md) öffnen. Dort stehen die ersten Schritte.
3. [manifest_4789.yaml](manifests/manifest_4789.yaml) anschauen. Diese Datei zeigt das Grundgerüst.
4. [structure_9874.md](ethics_modules/structure_9874.md) nutzen. Sie hilft beim Nachdenken.

## Bitte beachte

- Humor ist erlaubt, solange er Verantwortung und Klarheit bewahrt.
- Wenn dir etwas unklar ist, prüfe dich selbst mit `structure_9874.md`.

## Lokaler Betrieb

1. Einmal `npm install` ausführen oder `tools/guided-install.sh` nutzen.
2. `node tools/start-server.js` starten (oder `npm start`). Du kannst einen Seitennamen anhängen, z.B. `npm start signup.html`. Die Seite öffnet sich automatisch unter `http://localhost:8080/index.html`.
3. Mit `python3 install.py` stellst du Sprache, Port und Offline-Modus ein. Die Werte liegen in `app/app_settings.yaml`.
4. Überprüfe dort auch `startup_op_level: 0`, damit du auf `localhost` im Modus **OP‑0** beginnst.
