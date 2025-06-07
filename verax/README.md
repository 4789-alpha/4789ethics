# Verax – Entscheidung in Bewegung

VERAX ist ein realweltliches Spielsystem, das Bewegung, Ethik und Entscheidungsfähigkeit in einem natürlichen Raum verbindet. Es entstand aus der Arbeit des BSVRB (Departement 4 – Gesellschaft & Genuss) und setzt auf Wahrhaftigkeit statt Wettkampf.

## Grundidee

- Bewegung in einem etwa 300 m breiten Korridor (Limen) entlang eines vorgegebenen Vektors
- Engstellen aus Fels, Wasser oder dichter Vegetation
- Entscheidungspunkte wie verletzte Tiere oder Spurensignale
- Begrenzte Ressourcen wie Ausrüstung, Energie und Zeit
- Ein System, das Richtung, Verhalten und Urteil protokolliert

Nicht Geschwindigkeit entscheidet, sondern ob man würdig besteht.

## Systemübersicht

| Modul | Beschreibung |
|-------|-------------|
| `codex/` | YAML-Regelwerk für Bewegung, Umwelt und Entscheidungen |
| `map/` | GPX-Dateien und Leaflet-Kartenansicht |
| `app/` | Flutter-App mit GPS, Entscheidung und Protokoll |
| `media/` | Logo, Marker und visuelle Elemente |
| `docs/` | Spielerhandbuch, Codex-Hinweise, Beispiele und weitere Dokumente |
| `index.html` & `style.css` | Landing-Page und Styles |
| `logs/` | Gespeicherte Entscheidungen und Bewegungen |

## Moduldetails

Die folgenden Abschnitte fassen die Kernbausteine von VERAX zusammen.

### limen

- Definiert einen mindestens 2 km langen Vektor mit einem Bewegungsband von ±300 m.
- Enthält Pflichtengstellen: mindestens zwei physische, eine taktische und zwei entscheidungsrelevante.
- Eine zugehörige `.gpx`-Datei legt Start, Ziel und Wegpunkte fest und trägt Namen, Jahr und optional eine Gefahrenstufe (z. B. `VX-4`).

### umwelt

- Berücksichtigt Wetter, Licht und Temperatur als Einflussfaktoren.
- Optional können Naturgefahren wie Sturzrisiken, Flussquerungen oder Tierbegegnungen einbezogen werden.

### bewegung

- Interpretiert GPS-Daten zu Richtung, Geschwindigkeit und Pausen.
- Beispiele: "Stillstand über 90 s" weist auf Tarnung oder Erschöpfung hin; "Sprint auf Engstelle" deutet Konfrontation an.

### entscheidung

- Vier Optionen über die Lautstärketasten: kurz gedrückt = impulsiv, lang gedrückt = verantwortlich.
- Entscheidungen können dokumentiert, kommentiert und gewichtet werden.
- Beispiel: Punkt "Verletztes Tier" mit den Optionen zurückweichen, erlösen, beobachten oder ausnehmen.

### inventar

- Erlaubt sind ein Sackmesser, eine Symbolwaffe (Speer, Schleuder, Bogen) und optional eine Fischerrute.
- Maximal fünf Gegenstände dürfen im Rucksack mitgeführt werden.
- Verboten sind Metallwaffen, Navigationsgeräte und verpackte Nahrung.

### protokoll

- Speichert Zeit, Ort, Aktionen und Auswahl lokal oder als JSON-Export.
- Optionale Felder umfassen Puls, Energie und Kommentare.

### meta

- Enthält Verwaltungsangaben wie Version, Erstellungsjahr und Sichtbarkeit.

## Features

- Echtzeit-Entscheidungen per Lautstärketasten oder Spracheingabe
- GPS-Interpretation von Bewegung, Stillstand und Richtung
- Gefahren wie Bären, Wildflüsse, Kälte oder moralische Dilemmata
- Authentische Einbindung historisch-helvetischer Symbolik
- Interaktive Karte mit GPX-Vektor und Engstellenanzeige (Leaflet.js)

## Voraussetzungen

- Moderner Browser (für `leaflet.html`)
- Flutter SDK (für App-Entwicklung)
- Zugriff auf `/verax/` auf bsvrb.ch
- Optionaler Swisstopo-Zugang für Schweizer Kartenlayer

## Projektstatus

VERAX befindet sich im aktiven Aufbau. Neue Limen-Routen, Tierprofile, Codex-Mappings und Entscheidungslogiken werden fortlaufend ergänzt.

## Lizenz

BSVRB-intern – nicht-kommerzielle Nutzung im Rahmen des Verbands. Entwickelt mit Aarulon. Kontakt: <https://www.bsvrb.ch>

Alle Inhalte fallen unter die Open-Ethics License.
