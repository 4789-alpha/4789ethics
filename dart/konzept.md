# BSVRB Dart – Produkt- und Umsetzungskonzept

Stand: 6. November 2026. Ziel: gemeinsame Steeldart-Partien über verschiedene Standorte, im Browser, mit Softdart-Unterstützung.

## 1. Produktziel und aktueller Stand

Die Anwendung soll spontane Onlinepartien so einfach wie einen Videoanruf machen: Webseite öffnen, Namen eingeben, Mitspieler finden, Boardkamera ausrichten und spielen. Der Spielstand und die Wurfreihenfolge sind für alle identisch. Die Kamera des aktiven Spielers dominiert die schwarze Oberfläche.

Dieses Repository enthält zunächst einen funktionierenden lokalen Prototyp: Trainingspartien für 1–8 Spieler am selben Gerät, Einzelwurfwertung, Single/Double/Master Out, Bust, Rücknahme, lokales Archiv, Filter, JSON-Export, eigene Boardkamera, optionaler Mikrofonton für lokale Videoaufnahmen und Download der Aufnahmen. Alle Mitspieler werden ausdrücklich als lokal bezeichnet. Keine simulierten Onlinebenutzer, fremden Videos oder erfundenen KI-Ergebnisse.

Noch nicht implementiert: Onlinepräsenz, Einladungen, geräteübergreifende Partien, WebRTC-Konferenzen, serverseitige Daten, automatische Kalibrierung und Darttreffererkennung. Der Entwurf beschreibt diese als folgende Entwicklungsstufen.

## 2. Einstieg und Identität

- Anzeigename wird im Browser lokal gespeichert, zusammen mit einer zufälligen Geräteidentität. Ein Name allein ist keine sichere Identität und darf nicht als eindeutiger Datenbankschlüssel dienen.
- Die Person entscheidet ausdrücklich, ob ihr Alias in der Online-Lobby sichtbar ist. Standard: unsichtbar. Kamera und Mikrofon erst nach Gerätefreigabe und Beitritt verwenden.
- Sichtbarkeit: verfügbar, Einladung offen, in Partie, abwesend oder unsichtbar. Präsenz über zeitlich begrenzte Heartbeats; beim Verlassen automatisch abmelden.
- Onlineprofil enthält nur freigegebenen Alias, Spielmodi, Sprache und optional Niveau. Standort nur freiwillig und grob.
- Gastbetrieb ohne Konto; optional später Konto oder Wiederherstellungsschlüssel für geräteübergreifende Historie und Freunde. Das Löschen lokaler Daten darf keine fremden Profile über denselben Alias zugänglich machen.
- Lobby mit Filter nach Steeldart/Softdart, Spielmodus, Sprache, Niveau und offenen Räumen. Einladung annehmen, ablehnen oder blockieren. Privater Einladungslink/Code für Freunde.

## 3. Von der Einladung zum ersten Dart

1. Spielparameter vereinbaren: 301/501/701, In-/Out-Regeln, Anzahl Legs/Sets, Reihenfolge, Teilnehmer, freie Partie oder Wettbewerb.
2. Geräteeinrichtung pro Spieler: Kamera wählen, Board vollständig zeigen, Bildschärfe/Belichtung prüfen, Mikrofon optional. Smartphone über einmaligen, zeitlich befristeten QR-Kopplungscode als Boardkamera verbinden; Hauptanzeige kann auf PC oder TV laufen.
3. Kalibrierung: leeres Board, Bull und Referenzpunkte erkennen; Segment 20 und Orientierung bestätigen. Perspektive korrigieren und Double-/Triple-Ringe bestimmen. Separate Profile für Boardtyp und Kamera speichern.
4. Testwurf, Trefferkorrektur demonstrieren, Netzwerk und Audio prüfen. Bei schlechter Qualität konkrete Hinweise geben: Bild heller, Kamera näher, Board vollständig ins Bild.
5. Alle melden bereit. Anwurf auslosen oder per Bull entscheiden; Startspieler pro Leg nach vereinbarter Regel wechseln.

Der Browserzugriff auf Kamera und Mikrofon benötigt eine sichere Verbindung und die Freigabe der Person. Das Produkt kann Gerätezugriff nicht erzwingen. Ziel sind aktuelle Browser auf Windows, macOS, Linux, Android und iOS; Unterstützung wird anhand einer dokumentierten Gerätematrix getestet.

## 4. Spieloberfläche

- Hintergrund nahezu schwarz, weisse Zahlen, kontrastreiche grüne Markierung des aktiven Spielers. Farbe nie als einziges Signal.
- Hauptfläche: Boardvideo des aktiven Spielers, typischerweise 65–75 % der Videofläche. Kleine Kacheln zeigen alle übrigen Boards. Bei grossen Räumen umblättern, ohne Teilnehmer zu verlieren.
- Rechte Seite: Restpunkte, Legs/Sets, aktive Aufnahme mit drei Dartfeldern, Checkoutvorschläge und sichtbare Aktionen zum Korrigieren und Bestätigen.
- Unten: Mikrofon, Lautsprecher, Kamera, Aufnahme, Chat, Pause und Raum verlassen. Kameraabschaltung im Wettkampf pausiert die Partie nach vereinbarter Regel.
- Vergrösserung folgt dem aktiven Werfer, nicht der lautesten Stimme. Ein Video darf vorübergehend angeheftet werden; Rückkehr zum Spielmodus bleibt sichtbar.
- Auf Mobilgeräten Hauptvideo oben, Score und Wurfeingabe darunter. Grosse Bedienelemente, Tastaturbedienung und Screenreader-Ausgabe der Spielstände.
- Eigene Kameraansicht für Kalibrierung nicht spiegeln. Aktive Videoübertragung und Aufzeichnung unabhängig und deutlich anzeigen.

## 5. Verlässlicher Spielablauf

Zustände: Lobby → Einrichtung → bereit → Wurfphase → Wertung prüfen → Aufnahme bestätigt → Darts entfernen → Board leer → nächster Spieler → Leg/Set/Match beendet.

- Bis zu drei Darts pro Aufnahme; bei regelkonformem Checkout endet sie früher. Bust beendet die Aufnahme und stellt den Punktestand zu Beginn der Aufnahme wieder her.
- Kein automatischer Spielerwechsel nur aufgrund eines Geräusches oder einer Handbewegung. Das System wartet auf stabile Bilder und die abgeschlossene Wertung.
- Darts erst nach bestätigter Wertung entfernen. Entfernung wird als eigene Phase behandelt, damit herausgezogene Darts nicht als neue Treffer erscheinen.
- Abpraller, Fehlwürfe, heruntergefallene Darts und abgebrochene Aufnahmen ausdrücklich erfassen. Ihre Behandlung folgt dem gewählten Regelprofil.
- Checkoutvorschläge verwenden Restpunkte, verbleibende Darts und die Out-Regel. Anzeige ist eine Hilfe; das System erkennt keinen Checkout allein aus der Restsumme.
- Audio optional: stummschalten, Lautstärke, Rausch-/Echounterdrückung, Kopfhörerhinweis. Textchat und Spielsignale funktionieren ohne Mikrofon.
- Kurzer Netzabbruch: Raum und Spielstand bleiben reserviert, Wiederverbindung mit gleichem Spielerrecht. Bei längerem Ausfall Pause und gemeinsam vereinbarter Abbruch oder Aufgabe.
- Ohne bestätigten gemeinsamen Zustand keine heimlich fortlaufenden Onlinewürfe. Ausstehende Eingaben sichtbar kennzeichnen und nach Wiederverbindung eindeutig abgleichen.
- Nach Matchende: Ergebnis bestätigen, Statistiken, Rückspiel mit gleichen Einstellungen, Export oder nächste Gegnerwahl.

## 6. Bildanalyse für Steeldart und Softdart

Eine einzelne Webcam kann Eintrittspunkte verdecken. Dartschäfte und Flights können andere Spitzen überlagern; schräger Blickwinkel, Schatten, Drahtnähe, Bewegung und Reflexionen erschweren die Zuordnung. Fehlerfreie Erkennung mit beliebiger Hardware wird deshalb nicht versprochen.

Vorgeschlagene Verarbeitung:

1. Boardsegmentierung und Kalibrierung auf ein geometrisches Boardmodell; Orientierung des Zahlenrings sichern.
2. Stabilität der Kamera und Schärfe überwachen. Nach Kamerabewegung stoppen und neu kalibrieren.
3. Bilder vor/nach einem Wurf vergleichen; Hände und das Herausziehen von Darts vom Einwurf unterscheiden.
4. Ein spezialisiertes, auf Dartaufnahmen trainiertes Modell lokalisiert den Eintrittspunkt. Ein allgemeiner Objekt-Detektor liefert dafür allein keine ausreichende Präzision.
5. Eintrittspunkt in Boardkoordinaten überführen, Winkel und Radius bestimmen, Feld sowie Multiplikator zuordnen.
6. Zeitliche Plausibilität, Anzahl vorhandener Darts und mehrere Frames prüfen. Grenztreffer und verdeckte Spitzen als unsicher markieren.
7. Wertung vorschlagen, Unsicherheiten bestätigen lassen; keine stillen Schätzwerte als gesicherte Treffer ausgeben.
8. Optional zwei oder drei Kameras mit gemeinsamer Kalibrierung kombinieren. Mehrkameranutzung verbessert die Sichtbarkeit, ersetzt aber keine Validierung.

Steeldart und Softdart erhalten getrennte Boardprofile und Validierungsdaten. Boardgrössen und Segmentgeometrien dürfen nicht pauschal gleichgesetzt werden. Softdart-Punkte werden zunächst ebenfalls optisch/manuell erfasst; eine elektronische Boardanbindung ist eine eigene, gerätespezifische Erweiterung.

Die Erkennung soll möglichst am Kameragerät laufen, unabhängig von reduzierter Übertragungsauflösung für andere Spieler. Schwächere Geräte erhalten einen manuellen Modus. Eine optionale Serveranalyse braucht Einwilligung und eine separate Kapazitätsplanung.

Validierung: echte, freiwillig bereitgestellte und annotierte Boardaufnahmen mit getrennten Trainings- und Testgeräten, Boardmarken, Lichtbedingungen und Kamerawinkeln. Messen: exaktes Feld inklusive Multiplikator, übersehene/zusätzliche Darts, unsichere Treffer, Korrekturquote, Latenz und Fehlentscheidungen bei Checkouts. Automatik erst nach vorab definierten und erreichten Qualitätsgrenzen aktivieren; keine ungeprüften Genauigkeitsprozente veröffentlichen.

## 7. Korrekturen und Fairness

- Jeder Dart erhält eine stabile Ereignis-ID. Korrektur per Feldauswahl, Boardklick oder direkter Einzelwurfeingabe; optional gesamte Aufnahme bearbeiten.
- Änderung enthält ursprünglichen Wert, neuen Wert, Spieler, Zeit und Grund. Beide Seiten sehen die Änderung sofort.
- Freies Spiel: Korrektur mit sichtbarer Mitteilung. Gewerteter Wettbewerb: Zustimmung des Gegners oder Schiedsrichters vor Fortsetzung.
- Historische Korrekturen werden auf ihren Einfluss geprüft: Nachfolgende Aufnahmen, Busts, Reihenfolge und Legende müssen neu berechnet oder bis zum letzten gültigen Zustand zurückgesetzt werden. Blosses Ändern einer Restsumme reicht nicht.
- Doppelquote benötigt tatsächlich geworfene Versuche auf Doppel und ihre Ziele. Aus Kameratreffern lässt sich die Absicht eines Fehlwurfs nicht sicher ableiten; fehlende Angaben als unbekannt führen.
- Manuelle und automatisch erkannte Treffer getrennt kennzeichnen. Ranglisten erst mit geeigneter Identität, Streitfallregeln und Missbrauchsschutz freigeben.

## 8. Aufzeichnung und Datenschutz im Produkt

Spielereignisse und Videoaufzeichnungen sind getrennte Datenarten. Der Spielverlauf wird als strukturierter Ereignisstrom gespeichert und kann auch ohne Video ausgewertet werden.

- Strukturierte Daten: Match, Teilnehmer, Regelprofil, Legs/Sets, Aufnahme, Dart, Korrekturen, Abbruch und Ergebnisbestätigung.
- Video optional, standardmässig aus. Vor Beginn Zustimmung aller Betroffenen; neue Teilnehmer erneut berücksichtigen. Aufzeichnungsanzeige auf allen Geräten und jederzeitiger Stopp.
- Wahl zwischen lokalem Download und ausdrücklich aktiviertem Onlinearchiv. Speicherdauer, Download, Löschung und Zugriffsberechtigung vor Aktivierung anzeigen.
- Training mit eigenen Aufnahmen ist keine automatische Einwilligung zum Modelltraining. Dafür separate, widerrufbare Freigabe und geregelte Datenverwendung.
- Öffentliche Profilansicht und private Analysen trennen. Blockieren, Melden, Raumrechte und Einladungslimits vor öffentlichem Lobbybetrieb implementieren.

## 9. Auswertung

| Bereich | Auswertungen |
|---|---|
| Ergebnisse | Siege/Niederlagen, Legs/Sets, Serien, Aufgabe und abgebrochene Partien |
| Scoring | 3-Dart-Average, First-9-Average, Punktverteilung, 60+/100+/140+/180, Best Leg |
| Finish | Checkoutquote je klar definierter Basis, Doppelquote bei bekannten Versuchen, höchstes Finish, Bustquote |
| Präzision | Trefferheatmap, Segment-/Ringverteilung, Streuung bei bekannten Zielpunkten |
| Entwicklung | Verlauf über Zeit, gleitende Mittelwerte, Training/Wettkampf, Vergleich mit eigenem Niveau |
| Gegner | Direktvergleich, Heim-/Remote-Setup, Ergebnisse nach Gegnerniveau bei ausreichenden Daten |
| Technik | Korrekturquote, unsichere Erkennungen, Verbindungsqualität, Kameraprofile |

Filter: Zeitraum, Spieler, Gegner, Boardtyp, Spielmodus, In-/Out-Regeln, Training/Wettkampf, Liga/Turnier, gewonnen/verloren, manuell/automatisch, Kameraaufbau und abgeschlossene/abgebrochene Spiele. Kennzahlen zeigen Definition, Stichprobengrösse und fehlende Daten. Abgebrochene Legs standardmässig separat ausweisen. CSV-/JSON-Export, später Berichtsdownload.

3-Dart-Average = regelgültig erzielte Punkte / tatsächlich geworfene Darts × 3. Bei Bust zählt die gesamte Aufnahme null Punkte, geworfene Darts zählen weiter. Ein Checkout mit einem Dart zählt als ein Dart. Nicht geworfene Darts werden nicht künstlich ergänzt.

## 10. Systemarchitektur und Betrieb

Bestehende Oberfläche: statische Dateien im Repository `4789-alpha/4789ethics`. Die vorhandene `.github/workflows/deploy.yml` veröffentlicht nach `main` auf GitHub Pages; `CNAME` nennt `bsvrb.ch`. Hostpoint wurde als Anbieter genannt; Domainregistrierung, DNS und tatsächliches Webhosting müssen beim Betrieb getrennt betrachtet werden. Keine DNS-Änderung ist für das Hinzufügen statischer Dartdateien erforderlich.

Vorgeschlagener Ausbau:

- Browseroberfläche unter `/dart/` mit responsive Videoansicht und Kamera-Assistent.
- Separater HTTPS/WSS-Spielservice für Präsenz, Räume, Einladungen und verbindliche Spielzustände. Technologieentscheidung nach Prüfung der verfügbaren Hostpoint-Laufzeit; alternativ eigener separater Dienst.
- Server prüft aktive Person, Spielregel und Versionsnummer jedes Ereignisses. Idempotente Ereignis-IDs verhindern doppelte Punkte nach Wiederverbindung. Sequenznummern und Snapshots erlauben konsistente Wiederaufnahme.
- Datenbank für Profile, Partien, Ereignisse und Berechtigungen. Video in separatem Objektspeicher mit begrenzten Zugriffslinks und Löschregeln.
- WebRTC für Kamera/Audio, Signalisierung über den Spielservice, STUN/TURN für Verbindungen über unterschiedliche Netze. Für mehrere Teilnehmer ein SFU-Videoserver statt unbeschränkt wachsender Direktverbindungen.
- Aktivem Board höhere Übertragungsqualität zuteilen, übrige Videos reduzieren. Analyse verwendet den lokalen Kamerastream, nicht zwingend die komprimierte Konferenzansicht.
- Keine Zugangsschlüssel im Browsercode oder Repository. Raumbeitritt mit kurzlebigen Berechtigungen, Herkunftsprüfung, Einladungslimits und Servervalidierung.

GitHub Pages allein kann diese Serverdienste nicht ausführen. Ein statischer Platzhalter oder lokaler Browser-Speicher ersetzt keine echte Online-Lobby. Der konkrete Tarif und die vorhandene Infrastruktur bestimmen, welche Dienste bei Hostpoint oder zusätzlich betrieben werden.

## 11. Entwicklung und Freigabe

1. Lokaler Bedienprototyp: Oberfläche, Kamera, manuelle Wertung, Archiv und Regeltests. In diesem Stand enthalten.
2. Online-Basis: zwei echte Geräte, private Räume, synchronisierte manuelle Wertung, Kamera/Audio, Wiedereintritt und protokollierte Korrekturen. Danach Gruppenpartien mit aktiver Videovergrösserung.
3. Kamera-Assistent: Kalibrierung, Testwürfe, Qualitätshinweise, Sammlung separat freigegebener Testdaten.
4. Bildanalyse im Beobachtungsmodus: Treffer vorschlagen, manuelle Eingabe bleibt verbindlich; Fehlertypen auswerten. Anschliessend bestätigungspflichtige Automatik, erst später verlässliche automatische Übernahme.
5. Ausbau: persistente Konten, Analysefilter, Teams, Turniere, Ligen, Zuschauer und Mehrkameramodus.

Abnahme für Onlinebetrieb: gleicher Stand auf mindestens zwei entfernten Geräten; keine Doppelbuchung bei Wiederverbindung; Korrekturen verändern Scores und Statistiken konsistent; Kamera-/Mikrofonrechte sind widerrufbar; Netz-/Kameraausfälle führen zu nachvollziehbaren Zuständen; gültige Checkouts und Busts stimmen für jedes Regelprofil; Aufnahme erfolgt nur nach Zustimmung; wichtige Abläufe funktionieren auf der vereinbarten Desktop-/Mobilmatrix.

## 12. Technische Referenzen

- Browser-Kamera und Gerätefreigabe: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- WebRTC-Standard: https://www.w3.org/TR/webrtc/
- Beispiel einer Laufzeit für lokale Bildmodelle (kein fertiges Dartmodell): https://developers.google.com/edge/mediapipe/solutions/vision/object_detector
