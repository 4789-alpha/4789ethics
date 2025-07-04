# Verbesserungs-Checkliste für 4789ethics-1.22

Diese Liste enthält konkrete Vorschläge zur Verbesserung der Benutzerfreundlichkeit und Barrierefreiheit.

---

## 4. Barrierefreiheit (Accessibility)
- [ ] Texte screenreaderfreundlich gestalten.

## 5. Sprachführung & Dialoge
- [ ] Einstellung für Du/Sie oder neutrale Ansprache.
- [ ] Optionale humorvolle Rückmeldungen ohne Klarheit zu verlieren.

## 6. Weiterführende Verbesserungen
- [ ] API-Dokumentation mit OpenAPI/YAML.
- [ ] Eingebaute Hilfe via --help oder Hotkeys.
- [ ] Codecov oder Coveralls für Testabdeckung.
- [ ] Snyk oder GitHub Advanced Security für Sicherheits-Scans.

## 7. Debug-Checkliste für Animationen
Nutze diese Liste, wenn eine Animation nicht sichtbar ist oder blockiert erscheint:

- [ ] Ist das animierte Element im DOM sichtbar?
- [ ] Hat es `z-index: 0` und liegt damit unter dem Content?
- [ ] Blockiert ein Container die Sicht (etwa durch `background-color`)?
- [ ] Wird eine `display: none`-Regel versehentlich gesetzt?
- [ ] Wird `overflow: hidden` auf `body` oder `html` gesetzt?
## Fragenkatalog
### Designfragen
- Wie lassen sich Farben und Kontraste weiter verbessern?
- Gibt es bessere Layout-Ideen für kleine Bildschirme?

### Bedienungsfragen
- Welche Schritte erleichtern Erstnutzern den Einstieg?
- Sind alle Tastaturkürzel ausreichend dokumentiert?

### Funktionalitätsfragen
- Wie kann der Offline-Modus erweitert werden?
- Welche APIs sollen in Zukunft integriert werden?

Weitere Punkte können nach Bedarf ergänzt werden.
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
