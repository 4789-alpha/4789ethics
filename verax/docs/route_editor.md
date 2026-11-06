# VERAX Routengestaltung

`route_editor.html` führt Route und Aufgaben zusammen. Die bisherigen Links `editor.html` und `limen-editor.html` führen dorthin.

1. «Routenpunkte setzen» aktivieren, dann auf die Karte tippen. Punkte verschieben oder über ihr Popup entfernen. Die Verbindung ist eine direkte Linie, kein automatisches Weg-Routing.
2. Eine der 15 Vorlagen aus Tiere, Geschicklichkeit, Denken, Natur, Begegnung und Orientierung auswählen und auf der Karte platzieren. Titel, Aufgabe, Lösung, Schwierigkeit, Dauer, Versuche und Alternativen bearbeiten. Eigene Aufgaben sind frei gestaltbar und als Browser-Vorlage speicherbar.
3. Stationen sortieren, duplizieren und prüfen. Wetter, Tageszeit, Verkehr und Temperatur beschreiben das geplante Szenario, keine Live-Daten.
4. JSON sichert den vollständigen Entwurf (track, waypoints, conditions, Bild). GPX enthält Route und Wegpunkte mit Aufgabentext. Beide Dateitypen lassen sich wieder laden; frühere Limen-JSON-Dateien mit track/waypoints bleiben lesbar. JSON bewahrt Lösungen und Einstellungen, GPX nicht.

Entwürfe und eigene Vorlagen liegen lokal im Browser. Es erfolgt keine serverseitige Veröffentlichung der Routen. Export sichert sie unabhängig vom Browser. Rückgängig stellt die letzten 60 Änderungen wieder her. Die Druckansicht enthält Stationen und aufklappbare Lösungen.

Die Karte benötigt Internet und Leaflet/OpenStreetMap. Standortabfrage ist optional. Bilder: PNG/JPEG/WebP bis 2 MB, ohne Personen oder Privatgrundstücke. Tierbegegnungen und Gefahren werden als gedachte Szenarien verwendet. Das Beispiel ist schematisch und keine vor Ort geprüfte Route.
