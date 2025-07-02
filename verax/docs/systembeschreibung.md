# VERAX: Systembeschreibung, Gefahrenkatalog & dynamische Szenarien

## Grundidee

VERAX ist ein naturnahes Bewegungsspiel im realen Raum. Der Spieler befindet sich in einem kontrollierten Gefahrenraum, etwa in der Umgebung eines Flussabschnitts, und löst Aufgaben, indem er sich unter realen Bedingungen bewegt. Ziel ist nicht der Sieg, sondern die Rekonstruktion von Linien durch umsichtiges Verhalten.

## Modulsystem

- **Codex**: Ethikregeln und Signaturen
- **Szenario**: Orts- und situationsgebundene Aufgabe
- **Gefahrenkatalog**: Adaptiver Modulspeicher
- **Resonanzpunkte**: Reale Orte mit Aufgaben
- **Linien**: Symbolische Verbindung durch Handlung

## Gefahrenkatalog (Auszug)

### 1. Tierische Bedrohungen

| ID   | Art        | Verhalten / Reaktion            | Risiko            | Aktiv bei        |
|------|------------|---------------------------------|-------------------|------------------|
| T001 | Wildschwein| Verteidigt Frischlinge          | Verletzungsgefahr | Dämmerung, Frühjahr |
| T002 | Kreuzotter | Sonnenbad auf Pfaden            | Biss (leicht giftig) | >15°C, Kieszonen |
| T003 | Fuchs      | Scheu, aber evtl. tollwütig     | indirekt          | Herbst, Waldnähe |
| T004 | Bussard    | Nestschutz durch Sturzflüge     | Erschrecken       | Frühling, Höhenlagen |

### 2. Natürliche Hindernisse

| ID   | Element       | Risiko             | Aktiv bei       |
|------|---------------|-------------------|-----------------|
| N001 | Windbruch     | Weg blockiert     | nach Sturm      |
| N002 | Altwasser     | Einsinken         | nach Regen      |
| N003 | Moränenkante  | Steinschlaggefahr | Frühjahr        |
| N004 | Wurzelhang    | Glatt, laut       | feucht, Schatten |

### 3. Menschliche Hindernisse

| ID   | Typ           | Wirkung           | Aktiv bei       |
|------|---------------|-------------------|-----------------|
| M001 | Weidezaun     | Elektroschock     | Frühjahr–Herbst |
| M002 | Forstarbeiten | Sperrung, Lärm    | Werktags        |
| M003 | Verkehrsweg   | Sichtbarkeit, Lärm| Querung         |
| M004 | Fremdperson   | Verunsicherung    | alle Tageszeiten |

### 4. Zeit- & Wetterrisiken

| ID   | Typ       | Wirkung                  | Bedingung           |
|------|-----------|--------------------------|--------------------|
| Z001 | Nebel     | Sicht < 10 m             | <8°C, 90% LF        |
| Z002 | Dämmerung | Veränderte Akustik       | <06:00 oder >21:00 |
| Z003 | Hitze     | Erschöpfung              | >30°C, 11–16 Uhr   |
| Z004 | Windböen  | Astbruchgefahr           | >40 km/h           |

## Szenarienlogik

Ein Szenario kombiniert jeweils 1–2 tierische Gefahren, 1–2 natürliche Hindernisse, ein menschliches Hindernis und einen Zeit-/Wetterfaktor. Beispiel:

> **Die Linie im Nebel** = Wildschwein + Wurzelhang + Forstarbeiter + Nebel

Dadurch entsteht eine dynamische Aufgabe mit eingeschränkter Sicht und möglichem Umweg.

## Beispiel-Szenario: Die Linie von Garba

- **Strecke**: Mühlethurnen → Rümligen → Obermuhlern
- **Spielzeit**: 2–4 h
- **Resonanzpunkte**:
  1. Übergang des Flussbetts – lautlose Querung
  2. Auge der Garba – Fingerspitzen ins Altwasser
  3. Kamm des Windes – Steingeometrie nach Süden
  4. Echo des Holzes – Klang ohne Muster
- **Endpunkt**: Aussichtskante Belpberg

## Ethik-Codex

- Kein Eingriff in Flora und Fauna
- Keine Spuren hinterlassen
- Wahrnehmen vor Handeln
- Hören vor Gehen
- Die Linie ehren, nicht verkürzen

## Szenario-Objekt (Beispiel)

```yaml
scenario:
  id: "verax_garba_earlyfog"
  location: "Mühlethurnen – Rümligen"
  time_window: "05:00–09:00"
  conditions:
    - weather: "fog"
    - temperature: "<10°C"
  modules:
    - tier: T001
    - nature: N004
    - human: M003
    - env: Z001
  rules:
    - silence_required: true
    - wet_ground_penalty: +10s
  outcome:
    - deviation_required: true
    - codex_triggered: "Beobachtung ohne Sicht"
```

---

Diese Struktur erlaubt eine dynamische Kombination realer Bedingungen mit spielerischen Aufgaben und ethischem Verhalten.
