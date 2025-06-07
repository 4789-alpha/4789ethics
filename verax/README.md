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
| `docs/` | Spielerhandbuch, Codex-Hinweise und Beispiele |
| `index.html` & `style.css` | Landing-Page und Styles |
| `logs/` | Gespeicherte Entscheidungen und Bewegungen |

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
