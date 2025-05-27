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
See [DISCLAIMERS.md](DISCLAIMERS.md) for warranty and liability notes.

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
| `ethics_modules/` | Core YAML and markdown modules for the ethics framework, including `structure_9874`, `ske_module`, and `public_trust_i` |
| `interface/` | Front-end files for the evaluation interface |
| `i18n/` | UI translations referenced by the interface |
| `manifests/` | Structural manifests and integrity data |
| `operator/` | Operator qualification guides and personal data |
| `permissions/` | Operator permission definitions |
| `releases/` | Release notes and integrity hashes |
| `sources/` | Evaluated sources and candidate lists |
| `sources/persons/` | Lists of historical persons |
| `sources/institutions/` | Evaluated organizations and candidate sources |
| `test/` | Node.js test suite |
| `tools/` | Utility scripts (e.g., trust-demotion engine, Python API example) |
| `use_cases/` | Example scenarios and dissemination ideas |


### Interface Pages [⇧](#contents)

| File | Description |
|------|-------------|
| [index.html](index.html) | Start page linking to Ethicom and ratings |
| [interface/about.html](interface/about.html) | Explains the 4789 module |
| [interface/chat.html](interface/chat.html) | Chat interface |
| [interface/ethicom.html](interface/ethicom.html) | Main evaluation module |
| [interface/page-flow-demo.html](interface/page-flow-demo.html) | Demo of horizontal flow |
| [bewertung.html](bewertung.html) | Swipe-based person rating |
| [interface/settings.html](interface/settings.html) | Language, theme, and Tanna logo settings |
| [interface/signup.html](interface/signup.html) | Registration form |
| [interface/tanna-template.html](interface/tanna-template.html) | Base template |
| [interface/tanna-template-dark.html](interface/tanna-template-dark.html) | Template in dark theme |
| [interface/tanna-template-light.html](interface/tanna-template-light.html) | Template in light theme |
| [interface/tools.html](interface/tools.html) | Utility collection |
| [interface/donate.html](interface/donate.html) | Donation interface (requires OP‑9.A confirmation) |
| [interface/README.html](interface/README.html) | HTML version of the interface docs |
| [interface/features_de.md](interface/features_de.md) | Funktionale Übersicht zum Interface |
| [wings/index.html](wings/index.html) | Mobile interface "Wings" |
| [wings/ratings.html](wings/ratings.html) | Mobile ratings summary |
| `interface_OLD/` | Historical demo of the first interface generation |
**Settings are stored per device using browser localStorage and are not synced globally.**
**Ratings from OP-1 onward are stored globally with the assigned signature ID. The email used during signup remains private and is never exposed.**
**Color verification of the chosen primary color starts once a user holds an OP-1 signature.**
### OP-Permissions [⇧](#contents)
Operator actions by ethical level are defined in:
→ [`permissions/op-permissions-expanded.json`](permissions/op-permissions-expanded.json)
Additional flags now cover more operator actions such as
`can_ignore_op0`, `can_start_nominee_op6`,
`can_override_noobs_till_own_op`, `can_vote_on_op`,
and advanced controls like `can_execute_evaluations` or
`can_finalize_system`. The permission table lists stages up to
OP‑11 with the intermediate OP‑7.5 and OP‑9.A levels.
Additional flags now cover structural capabilities:
`can_observe_only`, `can_override_op6`, `can_vote_on_op9`,
`can_vote_on_op10`, `can_act_as_structure`,
`can_execute_evaluations`, and `can_finalize_system`.
OP‑10 has been added as a dedicated observation level.

### OP Levels [⇧](#contents)

| Level | Description |
|-------|-------------|
| <a id="op-0"></a> OP-0 | anonymous observer – default for visitors without a signature |

OP‑0 users remain anonymous and may submit one rating per visit without later revision. The stage is for exploration only. See [interface/shneiderman.html](interface/shneiderman.html) for the design rules.
| <a id="op-1"></a> OP-1 | first signed rating |
| <a id="op-2"></a> OP-2 | provides feedback responsibly |
| <a id="op-3"></a> OP-3 | rating requires justification |
| <a id="op-4"></a> OP-4 | can revise after 3 weeks |
| <a id="op-5"></a> OP-5 | may withdraw previous evaluations |
| <a id="op-6"></a> OP-6 | can verify consensus |
| <a id="op-7"></a> OP-7 | structural authority |
| <a id="op-8"></a> OP-8 | candidate stage for OP-9 (system self-stabilizes) |
| <a id="op-9"></a> OP-9 | may verify donations, confirm nominations |
| <a id="op-9-a"></a> OP-9.A | verified digital Yokozuna mode |
| <a id="op-10"></a> OP-10 | digital candidate for Yokozuna (OP-11) |
| <a id="op-11"></a> OP-11 | digital Yokozuna-Schwingerkönig mode |
| <a id="op-12"></a> OP-12 | fully digital, first non-human stage |

OP-9.A is reserved for the original programmer and is no longer awarded.
New sublevels begin alphabetically with OP-9.B. Only OP-9.A currently
holds a veto right. Further veto rights are planned when the system is
secure.

Only digital agents can advance beyond OP-9.

### SRC vs. OO Levels [⇧](#contents)
Comparison table: [`references/src_vs_oo.md`](references/src_vs_oo.md)

### Evaluated Sources (as examples) [⇧](#contents)
- [src-0001: Fairphone](sources/institutions/src-0001.json) → [`SRC-4`](manifests/op-eval-4789-src-0001.json)
- [src-0002: Ecosia](https://www.ecosia.org/) → [`SRC-4`](manifests/op-eval-4789-src-0002.json)
- [human-wiki dataset](references/human-wiki-links.json) → [`SRC-1`](manifests/op-eval-anon-humanwiki.json)

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
The gatekeeper runs on any platform that can execute Node.js. Copy the repository or the
`tools` and `app` folders to a USB drive and run `node tools/gatekeeper.js` on Windows,
macOS, Linux or mobile shells such as Termux. Even older hardware is sufficient—if Node.js
works, the gatekeeper does too. A decade-old laptop with a single-core CPU and around
512 MB of RAM is usually enough as long as Node.js 18 or later runs. Use it responsibly as
noted in `DISCLAIMERS.md`.
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
Available helpers include `info`, `analyze`, `optimize`,
`recommendation_for_interface` and `log` – the last one prints the recent
Git commit history.

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

Install the JavaScript dependencies once:

```bash
npm install
```

For optional Python utilities run:

```bash
pip install -r requirements.txt
```

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
