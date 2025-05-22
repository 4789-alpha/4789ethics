# Ethicom – Ethische Mensch-Maschine-Bewertung

**Ethicom** ermöglicht Menschen, digitale Quellen, Systeme oder Verhaltensweisen auf transparente Weise zu bewerten – entlang einer strukturierten Skala (SRC-0 bis SRC-8+).  
Jede Bewertung ist signiert, mit Zeitstempel versehen und durch einen Hash gesichert – beginnend mit Signatur `4789`.

Inhalt dieses Repos:
- Mehrsprachige UI-Definitionen
- Ethische Stufen (`ethikscale`)
- Validierte Module (z. B. `structure_9874`)
- Quellenbewertungen und Manifeste

Interface: `ethicom.html`  
Sprachen: siehe `i18n/ui-text.json`  

## OP-0 – Anonymer Beobachter <a id="op-0"></a>

OP-0 erlaubt dir, Ethicom anonym auszuprobieren.
Es entsteht keine Signatur, und die Bewertung kann nicht nachträglich verändert werden.
Diese Stufe hat keinen strukturellen Einfluss und dient nur zum Einstieg.

## OP-1 – Erste signierte Bewertung <a id="op-1"></a>

OP-1 ist die erste signierte Stufe.
Du erkennst damit den ethischen Kontext an.
Deine Bewertung wird nachvollziehbar.
Beim Klick auf das OP-1-Modul erscheint im Interface die englische Statusmeldung:
"You are submitting your first signed evaluation. It will be stored with your signature."
