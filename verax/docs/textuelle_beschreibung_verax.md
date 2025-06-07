Textuelle Beschreibung (VERAX)

Diese Datei beschreibt in lesbarer Form die aktuellen Module und Regeln des VERAX-Codex-Systems. Sie kann für Dokumentation, Review oder als Kommentarbasis genutzt werden.

---

1. limen: – Raumstruktur

gebogener Vektor, mind. 2 km Länge

±300 m Bewegungsbreite (Limen-Korridor)

min. 2 physische, 1 taktische, 2 entscheidungsbasierte Engstellen

.gpx-Datei mit Routenpunkten erforderlich

Namensschema: Limen-Ort-Jahr, optional VX-3 bis VX-9


2. umwelt: – Umgebungseinflüsse

Wetterdaten (API oder lokal)

Lichtniveau (Tageszeit oder Sensor)

Temperaturgrenzwerte

Auswirkung auf Bewegungs-, Entscheidungs- und Energieverhalten


3. bewegung: – GPS-Verhalten

Auswertung von Richtung, Geschwindigkeit, Innehalten

Bedeutungen z. B.:

Sprint auf Engstelle = Konfrontation

Umgehung = Flucht / Verzicht

Stillstand > 90 s = Tarnung / Reflexion



4. entscheidung: – Nutzerwahl

Eingabe per Lautstärketasten (4 Optionen):

laut/kurz = impulsiv → z. B. zurückweichen

laut/lang = aktiv → z. B. erlösen

leise/kurz = beobachten

leise/lang = ausnehmen


Dokumentation + Kommentarfeld möglich

Jede Entscheidung kann gewichtet werden


5. inventar: – Ausrüstung

Erlaubt:

1× Sackmesser

Symbolwaffe (Speer, Schleuder, Bogen)

Fischerrute (optional/symbolisch)

max. 5 Gegenstände im Rucksack


Verboten:

Industrielle Waffen

GPS-Navigation

Verpackte Nahrung



6. protokoll: – Verlauf

Zeitpunkt, Ort, Entscheidung werden erfasst

Optional: Puls, Text, Reflexion

Ausgabe als JSON (logs/)


7. meta: – Metadaten

version: Codex-Spezifikation

erstellt_von: 4789 (Name sichtbar ab OP-7)

lizenz: BSVRB intern

sichtbarkeit: lokal, intern, öffentlich



---

Dieses Dokument ist Teil des Verzeichnisses verax/docs/. Ergänzt durch README.md, regeln_limen.md, player_handbuch.md und entscheidung.yaml.
