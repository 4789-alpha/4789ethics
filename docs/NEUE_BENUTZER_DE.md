# Erste Schritte für neue Benutzer

Diese kurze Anleitung zeigt, wie du die Struktur 4789 lokal starten kannst.

1. [README.md](../README.md) lesen, um Zweck und Aufbau zu verstehen.
2. Node.js ≥18 installieren und `npm install` ausführen.
   Alternativ `tools/guided-install.sh` nutzen.
3. Einmalig `node tools/migrate-json-to-db.js` ausführen, um vorhandene JSON-Daten in die SQLite-Datenbank zu übernehmen.
4. Server mit `npm start` oder `node tools/start-server.js` starten.
   Optional kannst du einen Seitennamen anhängen, z.B. `npm start signup.html`.
5. Im Browser `http://localhost:8080/index.html` öffnen.
6. Für die Registrierung [signup.html](../signup.html) aufrufen.
7. Zusätzliche Einstellungen mit `python3 install.py` vornehmen. In
   `app/app_settings.yaml` kannst du den Startlevel `startup_op_level`
   festlegen (Standard `0` für OP-0).

Nutze die Struktur reflektiert. Keine Manipulation, keine Simulation.
Ausführliche Erläuterungen stehen in [ANLEITUNG_EINFACH_DE.md](../ANLEITUNG_EINFACH_DE.md).
