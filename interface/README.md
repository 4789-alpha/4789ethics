# Ethicom – Ethical Evaluation Interface (by 4789)

**Ethicom** is a responsibility-based evaluation framework.  
It enables anonymous and signed evaluations of digital structures, systems, and sources.

No personal account. No tracking. No influence.  
Just structured responsibility.

---

## Core Principles (by 4789)

- **Every OP-level is earned through structure, not status**
- **Signatures are created locally and verified structurally**
- **Languages are equal – no default, no bias**
- **Responsibility must be visible, verifiable, and correctable**
- **No one can act as OP-8 – OP-8 is structure itself**

---

## Interface Overview

- `ethicom.html` → loads modular interface per OP-level
- `ethicom-style.css` → dark mode, badge colors, minimal energy
- `signature-generator.js` → local signature creation (e.g. `SIG-XXXX-XXXX-XXXX`)
- `signature-verifier.js` → hash & password check before activation
- `interface-loader.js` → loads correct module for OP-0 to OP-10 and extra tools
- `language-selector.js` → user selects language (ISO 639-1)
- `source-search.js` → search and verify sources
- `manifest-viewer.js` → display any stored evaluation manifest
- `revision-overview.js` → list withdrawn or revised manifests
- `permissions-viewer.js` → visualize OP permissions
- `language-manager.js` → generate snippets for new translations
- `signup.html` → signup form
- `signup.js` → handles signup logic
- `ratings.html` → external overview of overall ratings
- `ratings.js` → loads rating history and computes averages
- `erstkontakt.html` → guided first contact with optional OP‑0 preview

---

## Ethical Conditions

| Level      | Description                         |
|------------|-------------------------------------|
| OP-0       | anonymous observer                  |
| OP-1       | first signed rating                 |
| OP-3+      | rating requires justification       |
| OP-4+      | can revise after 3 weeks            |
| OP-5+      | may withdraw previous evaluations   |
| OP-6+      | can verify consensus                |
| OP-7.9     | may verify donations / nominate     |
| OP-8       | candidate for Yokozuna (OP-9)       |
| OP-9       | Yokozuna-Schwingerkönig mode        |
| OP-10      | first non-human stage               |

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
├── manifest-viewer.js
├── revision-overview.js
├── permissions-viewer.js
├── language-manager.js
├── signup.html
├── signup.js
├── ratings.html
├── ratings.js
├── erstkontakt.html
├── modules/
│   ├── op-0-interface.js
│   ├── op-1-interface.js
│   ├── ...
│   ├── op-8-analysis.js
│   ├── op-9-interface.js
│   └── op-10-interface.js
