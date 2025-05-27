# Signaturdesign

Dieses Dokument beschreibt, wie Bewertungen im Rahmen der Signatur 4789 gespeichert werden. Die Struktur orientiert sich an den Operatorstufen, die in `operator/operator_levels.md` von OP-0 bis OP-12 definiert sind.

## Multidimensionales Array

Bewertungen werden in einem mehrdimensionalen Array abgelegt. Die Anzahl der notwendigen Array-Ebenen ergibt sich aus der jeweiligen Operatorstufe plus eins.

Formel:

```
Array-Anzahl = OP-Stufe + 1
```

Beispiel: Für OP-9 (Signatur 4789) sind zehn verschachtelte Arrays erforderlich. Die Struktur sähe vereinfacht so aus:

```
4789[x][y][z][a][b][c][d][e][f][g]
```

Jede zusätzliche Ebene (x, y, z, …) entspricht einer weiteren Array-Schicht bis die Ziel-OP-Stufe erreicht ist. Danach folgt eine abschließende Ebene zur Sicherung der Bewertung.

## Nickname pro Signatur

Ab **OP-1** kann eine Signatur einen kurzen Nickname enthalten. Diese Option erleichtert die Zuordnung einzelner Bewertungen. OP-0 bleibt weiterhin anonym.
Bei der Registrierung wird eine zufällige, 12‑stellige Signatur (z.B. `SIG-XXXXXXXXXXXX`) erzeugt. Zusammen mit der privat hinterlegten E‑Mail‑Adresse wird sie unter `ethicom_signature` im Browser gespeichert. Nur die Signatur-ID erscheint später in den globalen Bewertungsdateien; die E‑Mail bleibt verborgen.

## Interne Speicherung und Gatekeeper

Alle Bewertungen werden intern abgelegt und sind nicht öffentlich abrufbar. Ab **OP-7** archiviert ein Gatekeeper die Signaturangaben. Gespeichert werden lediglich die reduzierten Bewertungsaspekte *Qualität* und *Ethik*.

## Revision ohne Duplikate

Jede Quelle kann pro Nutzer nur einmal bewertet werden. Ab einer höheren Stufe ist eine Überarbeitung möglich – die vorherige Bewertung wird dabei ersetzt, nicht verdoppelt.

