## Ethics Structure 4789 [⇧](#contents)

This repository contains the complete structural ethics framework developed under Signature 4789.  
It is not tied to a person, but to a standard: responsibility over convenience: **4789**

**What this is:**
- A full operator model (OP 0–9.x)
- A self-reflection system (Signature **9874**)
- An ethics-first framework for digital  systems, education, governance, translation, private use, etc.

**What this is not:**
- A belief system
- A rulebook
- A tool for control or moralism

This structure must be carried – not quoted.
Use it only if you reflect, respond, and act with consequence.

For a brief tour of the main files, see [GET_STARTED.md](GET_STARTED.md).

**License:** Open-Ethics (see `LICENSE.txt`)
No manipulation. No simulation. No flattening of responsibility.
Humor ist willkommen, wenn er Verantwortung und Klarheit unterstützt.

## Contents

- [Ethics Structure 4789](#ethics-structure-4789)
- [Repository Structure](#repository-structure)
- [OP-Permissions](#op-permissions)
- [SRC vs. OO Levels](#src-vs-oo-levels)
- [Evaluated Sources (as examples)](#evaluated-sources-as-examples)
- [File Integrity](#file-integrity)
- [Adding Languages](#adding-languages)
- [Generating Interface README](#generating-interface-readme)
- [Gatekeeper Control](#gatekeeper-control)
- [API Access Control](#api-access-control)
- [OP Function Bundles](#op-function-bundles)
- [Currency Synchronization](#currency-synchronization)
- [Roadmap](#roadmap)
- [Local Deployment](#local-deployment)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

## Repository Structure [⇧](#contents)

| Directory | Purpose |
|-----------|---------|
| `app/` | Application settings, language rules, and user state |
| `ethics_modules/` | Core YAML and markdown modules for the ethics framework, including `structure_9874`, `ske_module`, and `public_trust_vii` |
| `interface/` | Front-end files for the evaluation interface |
| `i18n/` | UI translations referenced by the interface |
| `manifests/` | Structural manifests and integrity data |
| `operator/` | Operator qualification guides and personal data |
| `permissions/` | Operator permission definitions |
| `releases/` | Release notes and integrity hashes |
| `sources/` | Evaluated sources and candidate lists |
| `test/` | Node.js test suite |
| `tools/` | Utility scripts (e.g., trust-demotion engine, Python API example) |
| `use_cases/` | Example scenarios and dissemination ideas |

### OP-Permissions [⇧](#contents)
Operator actions by ethical level are defined in:
→ [`permissions/op-permissions-expanded.json`](permissions/op-permissions-expanded.json)
Additional flags now cover more operator actions such as
`can_ignore_op0`, `can_start_nominee_op6`,
`can_override_noobs_till_own_op`, `can_vote_on_op`,
and advanced controls like `can_execute_evaluations` or
`can_finalize_system`. The permission table lists stages up to
OP‑11 with the intermediate OP‑7.5 and OP‑9.A levels.

### SRC vs. OO Levels [⇧](#contents)
Comparison table: [`references/src_vs_oo.md`](references/src_vs_oo.md)

### Evaluated Sources (as examples) [⇧](#contents)
- [src-0001: Fairphone](sources/src-0001.json) → [`SRC-4`](manifests/op-eval-4789-src-0001.json)
- [src-0002: Ecosia](https://www.ecosia.org/) → [`SRC-4`](manifests/op-eval-4789-src-0002.json)

### File Integrity [⇧](#contents)

**ethicom.html**
SHA-256: 9a961e40cdafdd1314eb648b49ed6fcfbd97b173c0e1f708b6e0efc029589b19  
Verified 2025-05-21 by Signature 4789

**ethicom-consensus.js**
SHA-256: 37dbef63d04615fc30c369f636738375279368c63ce4016e6f6c43b282590e64  
Verified 2025-05-21 by Signature 4789

> Ethics is not explained. It is carried.
> – Signature 4789

### Adding Languages [⇧](#contents)

Translations for the evaluation interface are defined in `i18n/ui-text.json`. To
include another language, add a new JSON object using the two-letter ISO 639-1
code as the key and provide translations for all fields found under the `"de"`
entry. The interface will automatically recognize the new language.
Word collections for additional languages can be gathered with
`tools/language-corpus.js`. The script updates `i18n/language-corpus.json`
based on plain text input. To verify which interface languages are still
missing translations, run:

```bash
node tools/check-translations.js
```

This prints a list of language codes and the fields that still require translation or are unchanged from German. In the interface dropdown, languages with missing fields show an asterisk (`*`) so users know the translation is not complete.

### Generating Interface README [⇧](#contents)

Create a localized README for the interface by running:

```bash
node tools/generate-haupt-readme.js <lang>
```

Replace `<lang>` with a two-letter ISO code (e.g. `de` or `fr`).
The script copies the matching `i18n/README.<lang>.md` into
`interface/haupt-readme.md`. If no translation exists, the German
README is used.

### Gatekeeper Control [⇧](#contents)


Local control can be toggled via `tools/gatekeeper.js`. The script reads
`app/gatekeeper_config.yaml` and only allows actions when `allow_control` is set
to `true` for the controller `gstekeeper.local`. This keeps remote commands gated and
limited to the local environment.
`gstekeeper.local` holds back every personal ID/information and has permission to share anonymous and signed data as a sign of trust.
**4789**

### API Access Control [⇧](#contents)

`tools/api-access.js` checks whether API features may be used. The script reads
the operator level and confirmation flags from `app/user_state.yaml` and grants
access only when the specified OP level is met and the user has confirmed
ethical intent.

### OP Function Bundles [⇧](#contents)

`tools/op-functions.js` exposes small helper functions that only
run when the necessary operator level and ethical confirmation are
present. Each function is associated with a minimum OP level and the
module checks permission via `api-access.js` before returning it.
Available helpers include `info`, `analyze`, `optimize` and `log` – the
last one prints the recent Git commit history.

### Currency Synchronization [⇧](#contents)

Run `node tools/currency-sync.js` to download current exchange rates. The
script saves them in `references/exchange-rates.json` so comparisons remain
consistent even offline.


## Roadmap [⇧](#contents)

The roadmap keeps development transparent according to Signature 4789.

1. **v1.1 – Anonymous Ethics Tier**
   - Replace the pass/ID system with an optional anonymous level.
   - Merge modules that belong together but are not yet unified.
2. **v1.2 – Source Consolidation**
   - Align evaluated sources with the anonymous tier.
   - Standardize transfer protocols for cross-module use.
3. **v2.0 – Global Rollout**
   - Publish multi-language guides for all operator levels.
   - Finalize open training data licensing.
4. **v2.1 – Language Expansion**
   - Extend UI translations to all practical ISO 639-1 languages.
   - Provide an automated translation workflow with manual review.

### Local Deployment [⇧](#contents)

Serve the Ethicom interface locally with:

```bash
node tools/serve-interface.js
```

Then open `http://localhost:8080/ethicom.html` in your browser.
Opening the HTML file directly (e.g. via `file://`) bypasses the local server and
causes the language list to remain empty. Always access the interface through
the provided `localhost` address so that translation files load correctly.

### Running Tests [⇧](#contents)

Ensure Node.js 18 or later is installed, then run:

```bash
node --test
```


### Contributing [⇧](#contents)

To suggest improvements or translations, read `CONTRIBUTING.md`. All changes must follow the Open-Ethics License and be made with intention.
