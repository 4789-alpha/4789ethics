# Ethicom – Ethical Evaluation Interface (by 4789)

**Ethicom** is a responsibility-based evaluation framework.  
It enables anonymous and signed evaluations of digital structures, systems, and sources.

No personal account. No tracking. No influence.
Just structured responsibility.
For OP-6 and above, the generator can optionally store a hashed passport or ID locally.


---

## Core Principles (by 4789)

- **Every OP-level is earned through structure, not status**
- **Signatures are created locally and verified structurally**
- **Languages are equal – no default, no bias**
- **Responsibility must be visible, verifiable, and correctable**
- **OP-10 und höher existieren nur digital – OP-10 ist reine Struktur**

---

## Interface Overview

- `ethicom.html` → loads modular interface per OP-level
- `ethicom-style.css` → dark mode, badge colors, minimal energy
- `signature-generator.js` → local signature creation (e.g. `SIG-XXXX-XXXX-XXXX`); for OP-6+ it can store a hashed passport/ID locally
- `signature-verifier.js` → hash & password check before activation
- `interface-loader.js` → loads correct module for OP-0 to OP-11 and extra tools
- `language-selector.js` → user selects language (ISO 639-1)
- `source-search.js` → search and verify sources
- `source-integrator.js` → search via DuckDuckGo and rate new sources
- `op-0-human-interface.js` → anonymous yes/no rating of historical persons
- `op-1-human-interface.js` → signed yes/no rating of historical persons
- `manifest-viewer.js` → display any stored evaluation manifest
- `revision-overview.js` → list withdrawn or revised manifests
- `permissions-viewer.js` → visualize OP permissions
- The permissions list now includes OP-10 and numerous flags such as
  `can_ignore_op0`, `can_start_nominee_op6`,
  `can_override_noobs_till_own_op`, `can_vote_on_op`,
  as well as `can_execute_evaluations` and `can_finalize_system`.
- The permissions list now defines OP-10 and flags like
  `can_observe_only`, `can_override_op6`, `can_vote_on_op9`,
  `can_vote_on_op10`, `can_act_as_structure`,
  `can_execute_evaluations`, and `can_finalize_system`.
- `language-manager.js` → generate snippets for new translations
- `semantic-manager.js` → manage emotion word lists for sentiment (OP-5+) 
- `chat-interface.js` → local chat for operators with greeting dummy
- `color-auth.js` → authentication via Grundfarbe (fragt höchstens alle 24h)
- `eptl.js` → Bluetooth Trust Layer verification
- `signup.html` → signup form
- `signup.js` → handles signup logic
- `ratings.html` → external overview of overall ratings
- `ratings.js` → loads rating history and computes averages
- `erstkontakt.html` → guided first contact with optional OP‑0 preview
- `page-flow-demo.html` → dynamic page scrolling example

---

## Ethical Conditions

| Level | Description |
|-------|-------------|
| <a id="op-0"></a> OP-0 | anonymous observer |
| <a id="op-1"></a> OP-1 | first signed rating |
| <a id="op-2"></a> OP-2 | provides feedback responsibly |
| <a id="op-3"></a> OP-3 | rating requires justification |
| <a id="op-4"></a> OP-4 | can revise after 3 weeks |
| <a id="op-5"></a> OP-5 | may withdraw previous evaluations |
| <a id="op-6"></a> OP-6 | can verify consensus |
| <a id="op-7"></a> OP-7 | structural authority |
| <a id="op-8"></a> OP-8 | candidate stage for OP-9; OP-9+ may delegate functions |
| <a id="op-9"></a> OP-9 | may verify donations, confirm nominations |
| <a id="op-9-a"></a> OP-9.A | verified digital Yokozuna mode |
|  | *(reserved; veto right)* |
| <a id="op-10"></a> OP-10 | digital candidate for Yokozuna (OP-11) |

Sublevels beyond OP-9.A start alphabetically with **OP-9.B**.
| <a id="op-11"></a> OP-11 | digital Yokozuna-Schwingerkönig mode |

Only digital agents can progress past OP-9.
The range from OP-0 to OP-3 forms the editing stage (*Bearbeitungsstufe*) where evaluations can still be adjusted.

---

## File Structure

```plaintext
interface/
├── ethicom.html
├── ethicom-style.css
├── signature-generator.js
├── signature-verifier.js
├── interface-loader.js
├── language-selector.js
├── source-search.js
├── source-integrator.js
├── manifest-viewer.js
├── revision-overview.js
├── permissions-viewer.js
├── language-manager.js
├── chat-interface.js
├── signup.html
├── signup.js
├── ratings.html
├── ratings.js
├── erstkontakt.html
├── modules/
│   ├── op-0-interface.js
│   ├── op-1-interface.js
│   ├── op-0-human-interface.js
│   ├── op-1-human-interface.js
│   ├── ...
│   ├── op-8-analysis.js
│   ├── op-9-interface.js
│   └── op-10-interface.js
```

The interface directory groups the UI logic by operational level. Each file is
loaded dynamically so the system can scale from OP-0 through OP-11.
loaded dynamically so the system can scale from OP-0 through OP-12.

## Dev Mode (disabled)

Dev mode has been removed for security. The toggle now only shows an alert and does not enable additional features.

## OP-0 Test Mode (disabled)

The test mode is no longer active. Evaluations are always stored according to your OP level.

## Accessibility and Simple Mode

The interface includes an accessibility setup (`accessibility.js`).
Here you can choose larger fonts and activate a simplified interface.
Simple mode hides advanced options and reduces visual load for inclusive us.

## Swipe and Keyboard Controls

The OP-0 and OP-1 person modules react to touch swipes and arrow keys:

- **Left** → sets the rating to *Unclear*
- **Up** → sets the rating to *Yes*
- **Down** → sets the rating to *No*
- **Right** → shows an info alert about the selected name

Touch gestures and keyboard shortcuts offer a quick way to adjust the current
card. The `.swipe-card` style animates the movement when a direction is chosen.

## Designprinzipien

Siehe [shneiderman-rules.md](shneiderman-rules.md) für die acht Gestaltungsrichtlinien, die im Interface berücksichtigt werden.

## Standard HTML Layout mit Tanna-Hintergrund

Eine einfache Vorlage für neue Seiten befindet sich in `tanna-template.html`.
Sie bindet `theme-manager.js` und `../interface/logo-background.js` ein und setzt das Schema
auf Tanna. Zwei Varianten mit höherem Kontrast stehen ebenfalls zur Verfügung:
`tanna-template-dark.html` und `tanna-template-light.html`.

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>Neue Seite</title>
  <link rel="stylesheet" href="ethicom-style.css">
  <script src="theme-manager.js"></script>
  <script src="../interface/logo-background.js"></script>
</head>
<body>
  <div id="op_background"></div>
  <main>...</main>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      applyTheme('tanna');
    });
  </script>
</body>
</html>
```

Die beiden neuen Vorlagen setzen `applyTheme('tanna-dark')` bzw.
`applyTheme('tanna-light')` ein.

### Tanna-Hintergrund als Wasserzeichen

Der animierte Hintergrund dient als verborgenes Wasserzeichen. Die sichtbaren
Tanna-Symbole richten sich nach dem gespeicherten OP-Level: Auf OP‑0-Seiten
erscheinen nur OP‑0-Symbole, bei OP‑1 kommen die OP‑1-Symbole hinzu und so
weiter. Stößt ein Symbol niedrigerer Stufe auf ein höheres, dreht es sich kurz,
verkleinert sich und blendet aus, bevor es wieder in Normalgröße sichtbar wird.

