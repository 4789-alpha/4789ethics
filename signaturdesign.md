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

