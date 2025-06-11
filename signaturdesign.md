# Signaturdesign

Dieses Dokument beschreibt, wie Bewertungen im Rahmen der Signatur 4789 gespeichert werden. Die Struktur orientiert sich an den Operatorstufen, die in `operator/operator_levels.md` von OP-0 bis OP-12 definiert sind.

## Multidimensionales Array

Bewertungen werden in einem mehrdimensionalen Array abgelegt. Die Anzahl der notwendigen Array-Ebenen ergibt sich aus der jeweiligen Operatorstufe plus eins.

Formel:

```
Array-Anzahl = OP-Stufe + 1
```

Fehlt eine spezifizierte Unterstufe (etwa "B" oder "C"), gilt die
Grundstufe. Neue Anmeldungen beginnen daher mit OP‑1.

Beispiel: Für OP-9 (Signatur 4789) sind zehn verschachtelte Arrays erforderlich. Die Struktur sähe vereinfacht so aus:

```
4789[x][y][z][a][b][c][d][e][f][g]
```

Eine Referenzimplementierung findet sich in `utils/nested-rating.js`.

Jede zusätzliche Ebene (x, y, z, …) entspricht einer weiteren Array-Schicht bis die Ziel-OP-Stufe erreicht ist. Danach folgt eine abschliessende Ebene zur Sicherung der Bewertung.

## Nickname pro Signatur

Ab **OP-1** kann eine Signatur einen kurzen Nickname enthalten. Diese Option erleichtert die Zuordnung einzelner Bewertungen. OP-0 bleibt weiterhin anonym.
Bei der Registrierung wird eine zufällige, 12‑stellige Signatur (z.B. `SIG-XXXXXXXXXXXX`) erzeugt. Die E‑Mail-Adresse wird gehasht auf dem Server gespeichert und bleibt verborgen. Nur die Signatur-ID erscheint später in den globalen Bewertungsdateien.
Ab **OP-6** kann optional eine amtliche Dokumentennummer gehasht hinterlegt werden. Bei weiteren Anmeldungen wird diese Nummer geprüft, um doppelte Konten zu verhindern.

Aus Nickname und OP-Stufe entsteht ein Alias in der Form `<Nickname>@<OP-Stufe>` (z.B. `milla@OP-3`). Steigt die OP-Stufe, wird der Alias entsprechend angepasst.
Wenn ein Nickname angegeben wird, entsteht daraus automatisch ein Alias in der Form `nickname@OP-Stufe` (etwa `alex@OP-1`). 
Dieses Alias wird nur intern gespeichert und passt sich an, sobald sich die Operatorstufe ändert.

## Interne Speicherung und Gatekeeper

Alle Bewertungen werden intern abgelegt und sind nicht öffentlich abrufbar. Mit einem Gatekeeper lassen sich die Signaturangaben lokal archivieren. Dieser Vorgang ist ab **OP-0** möglich. Gespeichert werden lediglich die reduzierten Bewertungsaspekte *Qualität* und *Ethik*.

## Revision ohne Duplikate

Jede Quelle kann pro Nutzer nur einmal bewertet werden. Ab einer höheren Stufe ist eine Überarbeitung möglich – die vorherige Bewertung wird dabei ersetzt, nicht verdoppelt.

