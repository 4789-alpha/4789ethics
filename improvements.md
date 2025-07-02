# Verbesserungs-Checkliste für 4789ethics-1.22

Diese Liste enthält konkrete Vorschläge zur Verbesserung der Benutzerfreundlichkeit und Barrierefreiheit.

---

## 1. Einstieg & Zugänglichkeit

- [x] Einführungsscript (setup.sh/install.py): Interaktive Erstkonfiguration.
- [x] Konsistente, sprechende Ordnerstruktur.

## 3. Login & Benutzerführung
- [x] Optionales Loginmodul mit lokalem Userprofil.
- [x] Speicherung persönlicher Einstellungen: userprofile.json o. Ä.
- [x] Rückmeldung nach Login personalisieren („Willkommen zurück…“).
- [x] Offline-Hilfe auf der Login-Seite verlinken.
- [x] Hinweis auf `--help-offline` beim Start von `serve-interface.js`.

## 4. Barrierefreiheit (Accessibility)
- [ ] Texte screenreaderfreundlich gestalten.
- [x] Kontrastreiche Farben im Terminal, optional deaktivierbar.
- [x] Vollständige Bedienung per Tastatur sicherstellen.
- [x] Langsam-Modus: aktivierbare Pausen und ausführlichere Erklärungen.

## 5. Sprachführung & Dialoge
- [x] Globale Sprachumschaltung via locales/*.json.
- [ ] Einstellung für Du/Sie oder neutrale Ansprache.
- [x] Fehlermeldungen mit klaren Hinweisen zur Lösung.
- [ ] Optionale humorvolle Rückmeldungen ohne Klarheit zu verlieren.

## 6. Weiterführende Verbesserungen
- [ ] API-Dokumentation mit OpenAPI/YAML.
- [ ] Eingebaute Hilfe via --help oder Hotkeys.
- [x] GitHub Actions für automatisierte Tests und Deployments.
- [x] Dependabot für Abhängigkeits-Updates.
- [ ] Codecov oder Coveralls für Testabdeckung.
- [ ] Snyk oder GitHub Advanced Security für Sicherheits-Scans.
- [x] DNA-Daten aus PDF extrahieren und in `gatekeeper/` integrieren.
- [x] OP-Logo-Kollisionen im Hintergrund stets sichtbar halten; Logo-Farbe vom Hintergrund abheben und davor platzieren.

## Roadmap Items
- [ ] Replace the pass/ID system with an optional anonymous level.
- [ ] Merge currently separate modules.
- [ ] Align source evaluation with the anonymous tier.
- [ ] Standardize transfer protocols across modules.
- [ ] Finalize data licensing and provide global guides.
- [ ] Expand translations to all ISO 639-1 languages with a workflow.
- [ ] Split tools and interface into independent modules.

---

Diese Datei dient als Abarbeitungsgrundlage für kommende Releases und Usability-Reviews.
