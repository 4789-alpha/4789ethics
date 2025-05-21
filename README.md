## Ethics Structure 4789 [⇧](#contents)

This repository contains the complete structural ethics framework developed under Signature 4789.  
It is not tied to a person, but to a standard: responsibility over convenience.

**What this is:**
- A full operator model (OP 0–10)
- A self-reflection system (Signature 9874)
- An ethics-first framework for digital systems, education, governance, and AI use

**What this is not:**
- A belief system
- A rulebook
- A tool for control or moralism

This structure must be carried – not quoted.
Use it only if you reflect, respond, and act with consequence.

For a brief tour of the main files, see [GET_STARTED.md](GET_STARTED.md).

**License:** Open-Ethics (see `LICENSE.txt`)
No manipulation. No simulation. No flattening of responsibility.

## Contents

- [Ethics Structure 4789](#ethics-structure-4789)
- [Repository Structure](#repository-structure)
- [OP-Permissions](#op-permissions)
- [Evaluated Sources (as examples)](#evaluated-sources-as-examples)
- [File Integrity](#file-integrity)
- [Adding Languages](#adding-languages)
- [Generating Interface README](#generating-interface-readme)
- [Gatekeeper Control](#gatekeeper-control)
- [Currency Synchronization](#currency-synchronization)
- [Roadmap](#roadmap)
- [Local Deployment](#local-deployment)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

## Repository Structure [⇧](#contents)

| Directory | Purpose |
|-----------|---------|
| `app/` | Application settings, language rules, and user state |
| `ethics_modules/` | Core YAML and markdown modules for the ethics framework |
| `interface/` | Front-end files for the evaluation interface |
| `i18n/` | UI translations referenced by the interface |
| `manifests/` | Structural manifests and integrity data |
| `operator/` | Operator qualification guides and personal data |
| `permissions/` | Operator permission definitions |
| `releases/` | Release notes and integrity hashes |
| `sources/` | Evaluated sources and candidate lists |
| `test/` | Node.js test suite |
| `tools/` | Utility scripts (e.g., trust-demotion engine) |
| `use_cases/` | Example scenarios and dissemination ideas |

### OP-Permissions [⇧](#contents)
Operator actions by ethical level are defined in:
→ [`permissions/op-permissions-expanded.json`](permissions/op-permissions-expanded.json)

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
code as the key and provide translations for all fields found under the `"en"`
entry. The interface will automatically recognize the new language.
Word collections for additional languages can be gathered with
`tools/language-corpus.js`. The script updates `i18n/language-corpus.json`
based on plain text input.

### Generating Interface README [⇧](#contents)

Create a localized README for the interface by running:

```bash
node tools/generate-haupt-readme.js <lang>
```

Replace `<lang>` with a two-letter ISO code (e.g. `de` or `fr`).
The script copies the matching `i18n/README.<lang>.md` into
`interface/haupt-readme.md`. If no translation exists, the English
README is used.

### Gatekeeper Control [⇧](#contents)


Local control can be toggled via `tools/gatekeeper.js`. The script reads
`app/gatekeeper_config.yaml` and only allows actions when `allow_control` is set
to `true` for the controller `RL@RLpi`. This keeps remote commands gated and
limited to the local environment.

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

### Local Deployment [⇧](#contents)

Serve the Ethicom interface locally with:

```bash
node tools/serve-interface.js
```

Then open `http://localhost:8080/ethicom.html` in your browser.

### Running Tests [⇧](#contents)

Ensure Node.js 18 or later is installed, then run:

```bash
node --test
```


### Contributing [⇧](#contents)

To suggest improvements or translations, read `CONTRIBUTING.md`. All changes must follow the Open-Ethics License and be made with intention.
