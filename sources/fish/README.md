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

Built-in Imagegen: Maifisch neu im Stil der vorhandenen Finte illustriert; Forelle und Wels mit transparentem Hintergrund freigestellt. Die Übersicht zeigt transparente Bilder direkt auf dem Seitenhintergrund. Die Zeichnungen sind kein alleiniger Bestimmungsschlüssel. Farbzeichnung und Artabgrenzung können zusätzliche Merkmale erfordern.

## Prüfung

Gezielte Regressionen: numerische Sortierung, unbekannte Werte zuletzt, Statusreihenfolge, gespeicherte Spaltenreihenfolge, Suche ohne Wortmitten-Zufallstreffer, vollständige Profile/Bildpfade/Quellen sowie Fanghinweise geschützter Arten. Browserprüfung: numerische Auf-/Absortierung, Spaltenverschieben mit Speicherung, Dialoge, Bern-Filter, leere Suche und neue Bilder. Übersetzungen und Dateiintegrität geprüft. Die vollständige bestehende Testsuite hat in dieser Umgebung fünf unabhängige Fehler wegen fehlender Abhängigkeiten bzw. Umgebungsannahmen (Backend, Bildverarbeitung, OP-Funktionen, optionale Abhängigkeiten, PDF-Extraktion).

## Lizenz

Die ursprünglichen Fischlisten sind als CC BY-NC-SA 4.0 bezeichnet. Siehe `LICENSE.txt` und `DISCLAIMERS.md` im Repository. Verlinkte Quellen bleiben bei ihren jeweiligen Rechteinhabern; keine fremden Bilder wurden übernommen.

## Berner Fangregeln (2026)

`bern-regulations.json` ordnet jedem Eintrag eine Regelgruppe zu. Vier Tabellenspalten zeigen Schonzeit, Fangmass, Fangfenster und Fangzahlen; der Steckbrief enthält gewässerbezogene Tabellen und amtliche Quellen. Geprüft am 7. November 2026. FiDV-Anhang 1 ist für die September-Fensterangabe Interlaken massgebend (30–45 cm); die abweichende WEU-Übersicht ist ausdrücklich erwähnt. Bundesrechtliche Fangverbote werden separat von IUCN-Codes zugeordnet. Nicht eindeutig zugeordnete Taxa sind gekennzeichnet. Die Informationen gelten für Angelfischerei und ersetzen keine konkrete Bewilligung oder aktuelle Sperrverfügung.

Schleie, Bachsaibling, Kanadische Seeforelle und Karausche ergänzt (BKFV-Porträts und amtlicher Berner Arten-/Regelbestand). Spalten werden direkt am Kopf/Griff gezogen; die frühere Spaltenauswahl entfällt. Tastatur: Griff fokussieren, Alt + links/rechts.

Vollständigkeit: `coverage-audit.json` dokumentiert den Abgleich sämtlicher 71 RL-2022-Taxa, sämtlicher Schweizer Namen der nationalen Fischdatenbank 2026 (107 Originalnamen einschliesslich historischer Einzelfunde), der 20 gebietsfremden Taxa und neuer Forschungsbestände. Alle referenzierten Namen sind einem Eintrag oder einem ausdrücklich als Altbestand gekennzeichneten Aggregat zugeordnet. Artgrenzen sind zeitabhängig. Schweizer Vorkommen werden nicht aus überregionalen, auch ausländische Seen umfassenden Abbildungen abgeleitet. 123 Arten, 4 Forellen-Lebensformen, 3 Aggregate und 25 vorläufige Forschungsformen sind einzeln filterbar.

Seesaibling unter `Salvelinus umbla`, Altname `S. alpinus` als Suchalias. Alte `Phoxinus phoxinus`- und `Barbatula barbatula`-Daten sind Sammelgruppen, keine ungeprüft einer modernen Art zugewiesenen Belege. Neu benannte Bartgrundeln und Elritzen stehen separat. `Coregonus zugensis` nach Revision 2023 als ausgestorbenes Zuger Albeli berichtigt; alte Namensanwendungen in anderen Seen werden nicht als heutige Belege übernommen.

Alle 155 Einträge haben eine Bildverknüpfung. Die 74 Ergänzungen wurden einzeln illustriert und als WebP mit Alphakanal gespeichert; Originalzeichnungen bleiben erhalten. Forschungsformen sind als schematische Darstellungen gekennzeichnet. Die Bilder sind kein alleiniger Bestimmungsschlüssel. Auf Wunsch erscheinen keine KI-Hinweise in der Oberfläche. Genaue Bildvorgaben und erzeugte Dateien liegen im lokalen Ausgabeverzeichnis.
