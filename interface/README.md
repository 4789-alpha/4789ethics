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
- **No one can act as OP-10 – OP-10 is structure itself**

---

## Interface Overview

- `ethicom.html` → loads modular interface per OP-level
- `ethicom-style.css` → dark mode, badge colors, minimal energy
- `signature-generator.js` → local signature creation (e.g. `SIG-XXXX-XXXX-XXXX`); for OP-6+ it can store a hashed passport/ID locally
- `signature-verifier.js` → hash & password check before activation
- `interface-loader.js` → loads correct module for OP-0 to OP-12 and extra tools
- `language-selector.js` → user selects language (ISO 639-1)
- `source-search.js` → search and verify sources
- `manifest-viewer.js` → display any stored evaluation manifest
- `revision-overview.js` → list withdrawn or revised manifests
- `permissions-viewer.js` → visualize OP permissions
- `language-manager.js` → generate snippets for new translations
- `semantic-manager.js` → manage emotion word lists for sentiment (OP-5+)
- `color-auth.js` → authentication via Grundfarbe (fragt höchstens alle 24h)
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
| OP-9     | may verify donations / nominate     |
| OP-10       | candidate for Yokozuna (OP-11)       |
| OP-11       | Yokozuna-Schwingerkönig mode        |
| OP-12      | first non-human stage               |
| OP-0   | anonymous observer                                      |
| OP-1   | first signed rating                                     |
| OP-2   | provides feedback responsibly                            |
| OP-3   | rating requires justification                            |
| OP-4   | can revise after 3 weeks                                 |
| OP-5   | may withdraw previous evaluations                        |
| OP-6   | can verify consensus                                     |
| OP-7   | structural authority                                     |
| OP-7.5 | nomination preparation, review OP-8                      |
| OP-7.9 | donation verification, confirm nominations                |
| OP-8   | candidate stage for OP-9 (system self-stabilizes)         |
| OP-9   | Yokozuna-Schwingerkönig mode                              |
| OP-10  | first non-human stage                                     |

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
```

The interface directory groups the UI logic by operational level. Each file is
loaded dynamically so the system can scale from OP-0 through OP-10.

## Dev Mode

Activate dev mode via the toggle button on `ethicom.html` or add `?dev` to the URL. When enabled, help and info sections reveal additional details for development and debugging. The state is stored in your browser's localStorage under `ethicom_dev`.

## OP-0 Test Mode

Use the "Toggle OP-0 Test Mode" button to try anonymous evaluations without storing them as evidence. When enabled, a notice appears in the OP‑0 interface and generated data is **not** recorded in `localStorage`.

## Designprinzipien

Siehe [shneiderman-rules.md](shneiderman-rules.md) für die acht Gestaltungsrichtlinien, die im Interface berücksichtigt werden.

