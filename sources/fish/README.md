# Fischdaten

- `swiss-fish.json`: Übersicht mit Arten, Artengruppen und Forellen-Lebensformen. Die doppelte Laube ist zusammengeführt; unterschiedliche taxonomische Stichling-Einträge bleiben erklärt erhalten.
- `bern-fische.json`: ergänzende ältere Beispieldaten für Grössen. Kein Verbreitungsnachweis.
- `references.json`: verlinkte Quellen für Biologie, Bern-Prüfung und Angelhinweise.
- `ch/`: vorhandene PNG-Illustrationen, ergänztes Maifischbild und korrigierte Hintergrundvarianten. Originalbilder bleiben erhalten.

Jeder Eintrag enthält `form_description`, `information`, `fishing_method`, `bait`, `fishing_note`, `fishing_source_ids`, `profile_source_ids` und `bern_occurrence` mit Aussage, Prüfdatum und Quellen. Letzteres unterscheidet `documented`, `historical`, `uncertain` und `no_record`. Ein fehlender Beleg ist kein Nachweis der Abwesenheit. `in_bern` ist nur bei dokumentierten Vorkommen `true`, sonst `null`; die Übersicht verwendet die differenzierte Aussage.

Bern wurde mit dem kantonalen BESBF-Leitfaden (2024), Abfischkampagne 2023, BKFV-Porträts, Bielersee-Erhebung 2017, kantonaler Fangstatistik und Eawag-Felchenberichten abgeglichen. Ortsfremde Arten können in Bern dokumentiert sein. Alte Cobitis-Belege bleiben wegen taxonomischer Unsicherheit gekennzeichnet. Vorkommen von Bach-/Flussforellen sind nicht immer getrennt erhoben. Alle Einträge tragen eine Quellenprüfung; die Quellen sind keine flächendeckende aktuelle Bestandserhebung.

Die Statuscodes stammen überwiegend aus dem Altbestand und wurden nicht gesamthaft neu bewertet. Die Palée wurde von RE auf DD berichtigt: Der ursprüngliche Eintrag übertrug eine lokal ausgestorbene Population auf die ganze Art, obwohl Bielersee-Vorkommen belegt sind. Siehe Rote Liste 2022 (seenbezogene Felchentabelle) und Felchenbericht 2025.

Fangmethoden/Köder sind redaktionelle allgemeine Hinweise für übliche Angelfische, keine Fangfreigabe. Die sechs im Berner Merkblatt explizit ganzjährig geschützten Einträge erhalten keine Köderempfehlung. Die Sonderregelung für Äschen wird genannt. Bei seltenen Arten und Rundmäulern werden keine gezielten Fangempfehlungen gegeben. Verbindlich bleiben aktuelle Gewässerreglemente.

## Bildbearbeitung

Built-in Imagegen: Maifisch neu im Stil der vorhandenen Finte illustriert; Forelle und Wels mit transparentem Hintergrund freigestellt. Die Übersicht zeigt die Bilder auf weissem Untergrund. Das Maifischbild ist als KI-Illustration gekennzeichnet. Die Zeichnungen sind kein alleiniger Bestimmungsschlüssel. Farbzeichnung und Artabgrenzung können zusätzliche Merkmale erfordern.

## Prüfung

Gezielte Regressionen: numerische Sortierung, unbekannte Werte zuletzt, Statusreihenfolge, gespeicherte Spaltenreihenfolge, Suche ohne Wortmitten-Zufallstreffer, vollständige Profile/Bildpfade/Quellen sowie Fanghinweise geschützter Arten. Browserprüfung: numerische Auf-/Absortierung, Spaltenverschieben mit Speicherung, Dialoge, Bern-Filter, leere Suche und neue Bilder. Übersetzungen und Dateiintegrität geprüft. Die vollständige bestehende Testsuite hat in dieser Umgebung fünf unabhängige Fehler wegen fehlender Abhängigkeiten bzw. Umgebungsannahmen (Backend, Bildverarbeitung, OP-Funktionen, optionale Abhängigkeiten, PDF-Extraktion).

## Lizenz

Die ursprünglichen Fischlisten sind als CC BY-NC-SA 4.0 bezeichnet. Siehe `LICENSE.txt` und `DISCLAIMERS.md` im Repository. Verlinkte Quellen bleiben bei ihren jeweiligen Rechteinhabern; keine fremden Bilder wurden übernommen.
