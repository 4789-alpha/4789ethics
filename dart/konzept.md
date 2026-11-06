# BSVRB Dart – Live-Beta

## Stand und Bedienung

Diese Fassung ersetzt den ersten lokalen Bedienprototyp durch private WebRTC-Partien und eine experimentelle, bestätigungspflichtige Kameraerkennung.

### Gemeinsam an einem Gerät

Namen eingeben, «Gemeinsam an einem Gerät» wählen und weitere Namen kommagetrennt ergänzen. Alle werfen nacheinander auf ein gemeinsames Board. Bis zu acht Spieler. Nach der Aufnahme Darts entfernen und «Board ist leer · weiter» drücken. Es ist keine Verbindung zwischen Geräten erforderlich.

### Mehrere Geräte, auch im selben WLAN

1. «Online · mehrere Geräte» wählen und eigenen Namen eingeben.
2. Eine Person öffnet einen privaten Raum und teilt den vollständigen Einladungslink.
3. Mitspieler öffnen den Link, geben ihren Namen ein und klicken «Raum beitreten».
4. Wenn alle verbunden sind, startet der Gastgeber die Partie.
5. Kamera und optional Mikrofon ausdrücklich einschalten. «Mitspieler hören» aktiviert den Empfangston. Das eigene Video bleibt stumm.

Der Raum verwendet PeerJS 1.5.5 und WebRTC: Spielzustände werden über verschlüsselte Datenkanäle ausgetauscht, Kamera/Audio über Medienverbindungen. Der Gastgeber ist für den Spielstand zuständig. Nur der aktive Spieler darf Darts für seine Position einreichen; nur der vorherige Werfer darf das leere Board bestätigen oder seine letzte Aktion zurücknehmen. Versionsnummern und eindeutige Aktionskennungen verhindern doppelte/stale Wertungen. Alle sehen die vom Gastgeber bestätigte Wertung.

Der Gastgeber muss die Seite geöffnet halten. Bei Trennung wird die Wertung pausiert. Ein Gast kann auf derselben geöffneten Seite den Raum verlassen und mit derselben Einladung erneut beitreten; die Gerätekennung wird innerhalb dieser Seite wiederverwendet. Vollständiger Seitenneustart während einer laufenden Partie, Gastgeberwechsel und dauerhafte Server-Wiederherstellung sind noch nicht umgesetzt. Alle Geräte müssen verbunden sein; ein dauerhaft ausgeschiedener Spieler erfordert eine neue Partie.

Private Einladung und Raumkennung sind zufällig erzeugt. Nur wer die Einladung kennt, kann dem Raum beitreten. Es gibt noch keine öffentliche Online-Lobby, Freundesliste, verifizierte Konten, globale Rangliste oder Wettkampf-Korrekturbestätigung durch den Gegner. Diese Beta ist für private Partien, keine betrugssichere Turnierinstanz.

## Verbindung und Betrieb

Die Oberfläche bleibt statisch unter https://bsvrb.ch/dart/. Standardmässig vermittelt der öffentliche PeerJS-Cloud-Dienst die WebRTC-Verbindung; er ist eine externe Abhängigkeit und kein eigener BSVRB-Spielserver. PeerJS und seine Lizenz liegen lokal im Repository, kein Laufzeit-CDN ist nötig.

In typischen Netzen entstehen direkte Verbindungen. Manche Mobilfunk-, Firmen- und symmetrischen NAT-Netze benötigen einen TURN-Relayserver. Ein eigener TURN-Dienst ist nicht provisioniert. Die Oberfläche erlaubt, einen vorhandenen TURN-Server sowie optional einen eigenen HTTPS/WSS-PeerServer einzutragen. Zugangsdaten werden nur im Arbeitsspeicher dieser Seite verwendet, nicht gespeichert oder ins Repository geschrieben. TURN-Zugangsdaten sollten kurzlebig und eingeschränkt sein. Eine Verbindungsgarantie über beliebige Netze kann ohne betriebene Relay-Infrastruktur nicht gegeben werden.

Quellen: https://peerjs.com/client/faq und https://peerjs.com/client/api/peer

## Kameraerkennung: tatsächlich implementierter Ablauf

1. Kamera so befestigen, dass das komplette Board im Bild bleibt.
2. «Board kalibrieren» drücken. Die äussere Doppelring-Kante nacheinander oben bei 20, rechts bei 6, unten bei 3 und links bei 11 antippen.
3. Die eingezeichneten Ringe prüfen. Bei Abweichung neu kalibrieren.
4. Leeres Board aufnehmen: «Board leer · Erkennung starten».
5. Einen Dart werfen. Nach mehreren stabilen Bildern sucht die Software längliche, neu hinzugekommene Bildveränderungen. Grössere Bewegungen und breite Verdeckungen werden nicht als Treffer übernommen.
6. Eine längliche Veränderung erzeugt einen Vorschlag. Ihre Endpunkte werden geschätzt; der näher zum Zentrum gelegene Endpunkt dient als erste Spitzenhypothese. Das ist eine Heuristik, kein verlässlicher Nachweis der echten Eintrittsstelle.
7. Die Software zeigt den Marker, die geometrisch berechnete Radiusposition, den Ring und einen Feldvorschlag. Über «Spitze im Kamerabild korrigieren» kann die tatsächliche Eintrittsstelle angetippt werden. Ring und Feld lassen sich auch direkt wählen.
8. Erst «Treffer bestätigen» zählt den Dart. «Kein Dart» verwirft die Veränderung und aktualisiert die Referenz. Nach einer bestätigten Eingabe wird das Bild mit dem steckenden Dart zur Referenz für den nächsten Wurf.
9. Nach der Aufnahme Darts entfernen und leeres Board bestätigen. Eine bewegte Kamera benötigt neue Kalibrierung.

Technik: projektive Transformation aus vier Korrespondenzen, Grauwert-Bildvergleich, Stabilitätsprüfung, zusammenhängende Komponenten und Hauptachsenanalyse. Die Verarbeitung läuft lokal, ohne Bild-Upload für die Erkennung. Das ist bereits ausführbare Bildanalyse, aber kein trainiertes Dartmodell.

Grenzen: Flights/Schäfte können Eintrittspunkte verdecken; Schatten, Flackern, Kamerawackeln und nahe beieinanderliegende Darts können falsche oder ausbleibende Vorschläge erzeugen. Die Radiusangabe ist nur so korrekt wie Kalibrierung und gewählte Spitze. Im Zweifel Spitze oder Feld selbst setzen. Die Automatik erkennt nicht zuverlässig Abpraller, Fehlwürfe ohne steckenden Dart oder die Absicht eines Wurfs; dafür die manuellen Tasten verwenden. Während eigener Nicht-Wurfphasen ist die automatische Erkennung gesperrt.

Steeldart: Aussenradius 170 mm, Doppel 162–170 mm, Triple 99–107 mm, Outer Bull 15,9 mm, Bull 6,35 mm. Softdart in dieser Beta: dasselbe normierte Ringprofil, auf 168 mm skaliert, für verbreitete 13,2-Zoll-Boards. Andere Softdart-Geometrien benötigen ein passendes eigenes Ringprofil; nicht ungeprüft für 15,5-Zoll- oder abweichende Boards verwenden.

## Punkteansagen

«Aufnahmen laut ansagen» aktivieren. Nach abgeschlossener Aufnahme wird deren Summe gesprochen, bei Bust «No score» und beim Finish «Game shot». Die 180-Ansage ist langsamer und betonter. Sprache und vorhandene Gerätestimme sind wählbar. Es werden keine Aufnahmen realer Caller oder fremde Tondateien verwendet. Aussprache, verfügbare Stimmen und Wiedergabe hängen von Browser und Betriebssystem ab. Auf mobilen Geräten muss die Funktion zunächst über einen Tastendruck freigeschaltet werden.

## Mobile Oberfläche

Die Seite hat ein Geräte-Viewport, responsive Formulare, einen einspaltigen Spielbereich unter 950 px, passende Board-Videoflächen, zweispaltige kleine Teilnehmerkacheln, einen Fünfersatz grosser Zahlentasten sowie einen manuellen Korrekturlink zum eigenen Kamerabild. Kein festes Desktop-Mindestmass. Smartphone-Browser können Kamera und WebRTC beim Sperren des Bildschirms oder beim Wechsel in andere Apps unterbrechen; zum Spielen die Seite aktiv lassen.

## Speicherung und Auswertung

Anzeigename, Caller-Einstellung und abgeschlossene Legs liegen lokal im Browser. Das Archiv aus der ersten Fassung bleibt lesbar. Videoaufnahmen werden nur ausdrücklich gestartet und als lokaler Download angeboten. Nur eigenes Boardvideo und optional eigener Mikrofonton werden aufgenommen; entfernte Videos werden nicht mitgeschnitten. Lange Aufnahmen benötigen Arbeitsspeicher und sind vor dem Schliessen herunterzuladen.

Average berücksichtigt tatsächlich geworfene Darts, Bust-Aufnahmen ergeben null Punkte. Archivfilter nach Spieler und Boardtyp sowie JSON-Export sind implementiert. First 9, Doppelquote, Heatmaps, Zeitfilter, Direktvergleich, Cloudarchiv, Legs/Sets als Mehrleg-Match und Turniere bleiben weitere Entwicklungsschritte.

## Validierung und praktische Grenzen

- Elf Regel-, Geometrie-, Bildvergleichs- und Caller-Texttests.
- Browser: 180-Aufnahme, Korrektur und Spielerwechsel mit Leerboard-Bestätigung.
- Zwei echte PeerJS-Browserinstanzen: private Einladung, Gastgeber-/Gastbeitritt, gemeinsamer Punktestand, gesperrte Fremdwertung, Gastwurf und Wiederbeitritt.
- WebRTC-Test: Datenkanal-Rundreise und ein erzeugter Testvideostream in beide Richtungen.
- Bildpipeline: ein künstlich hinzugefügter länglicher Dart im laufenden Testvideostream wurde erkannt. Das ist kein Genauigkeitsbenchmark mit physischen Darts.
- Responsive Geometrieprüfung bei 390 px Breite in einem Browser-Frame. Reale Kameraauswertung unter verschiedenen Lichtbedingungen und echte getrennte Mobilfunk-/Heimnetze sind noch zu erproben.

## Open Source

PeerJS 1.5.5, MIT License, Copyright (c) 2013 Michelle Bu und Eric Zhang. Bibliothek und vollständige Lizenz im Unterordner `vendor/`.

Quellcode: https://github.com/peers/peerjs
Dokumentation: https://peerjs.com/client/getting-started

Die Dartlogik, geometrische Erkennung und Oberfläche sind projektspezifisch implementiert. Es wird keine ungetestete Erkennungsgenauigkeit oder allgemeine Verbindungsgarantie behauptet.
