## Ethics Structure 4789
[⇧](#contents)

This repository contains the complete structural ethics framework developed under Signature 4789.
It is not tied to a person, but to a standard: responsibility over convenience: **4789**
**BSVRB.ch hosts this repository – it is more than just the ethicom interface.**
**All functions are accessible on [bsvrb.ch](https://www.bsvrb.ch) and run according to your OP level.**
**Open [`index.html`](index.html) from the register to run them in the browser.**

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
Eine Kurzanleitung in einfacher Sprache findest du in [ANLEITUNG_EINFACH_DE.md](ANLEITUNG_EINFACH_DE.md).
Eine Schritt-für-Schritt-Anleitung für neue Nutzer steht in [docs/NEUE_BENUTZER_DE.md](docs/NEUE_BENUTZER_DE.md).

**License:** Open-Ethics (see [LICENSE.txt](LICENSE.txt))
No manipulation. No simulation. No flattening of responsibility.
Humor ist willkommen, wenn er Verantwortung und Klarheit unterstützt.
See [DISCLAIMERS.md](DISCLAIMERS.md) for warranty and liability notes.

## Quick Start
[⇧](#contents)

**Purpose:** Provide a clear framework for ethical projects.
**Audience:** Developers, educators, and curious readers.

1. Read [GET_STARTED.md](GET_STARTED.md) for the main files.
   Ensure Node.js 18 or later is installed.
2. Start the interface with `npm start` or use
   `npm run easy-start` to install dependencies automatically. You can also run
   `node tools/serve-interface.js`. If you only have the website, download
   [`tools/easy-start.js`](https://www.bsvrb.ch/tools/easy-start.js) and run it
   with Node. For GitHub Pages deployments you can use
   `npm run serve-gh`.
   Opening an HTML file directly (via `file://`) disables translations and
   settings. See [Local Deployment](#local-deployment) for details.
3. Optionally compile the Flutter launcher in `launcher/` to start the server
   without the terminal (`flutter run launcher`).
4. The interface opens at `http://localhost:8080/index.html`.
5. For quick static hosting, deploy the interface on
   [Netsly](interface/deploy_netsly.md) or
   [Hostpoint](interface/deploy_hostpoint.md).

```
README.md -> GET_STARTED.md -> index.html
                   |             |
                   v             +--> settings.html
              ethicom.html
```

## Contents

- [Ethics Structure 4789](#ethics-structure-4789)
- [Quick Start](#quick-start)
- [Repository Structure](#repository-structure)
- [OP-Permissions](#op-permissions)
- [SRC vs. OO Levels](#src-vs-oo-levels)
- [Evaluated Sources (as examples)](#evaluated-sources-as-examples)
- [Person Image Sources](#person-image-sources)
- [File Integrity](#file-integrity)
- [Adding Languages](#adding-languages)
- [Generating Interface README](#generating-interface-readme)
- [Gatekeeper Control](#gatekeeper-control)
- [API Access Control](#api-access-control)
- [OP Function Bundles](#op-function-bundles)
- [Currency Synchronization](#currency-synchronization)
- [Wiki Image Loader](#wiki-image-loader)
- [Wiki Export](#wiki-export)
- [Stereo Anaglyph Generator](#stereo-anaglyph-generator)
- [Source Manager](#source-manager)
- [Roadmap](#roadmap)
- [Local Deployment](#local-deployment)
- [Automated Server Setup](#automated-server-setup)
- [Automated Gatekeeper Setup](#automated-gatekeeper-setup)
- [Automated Data Setup](#automated-data-setup)
- [Guided Installation](#guided-installation)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

## Repository Structure
[⇧](#contents)

| Directory | Purpose |
|-----------|---------|
| `app/` | Application settings, language rules, and user state |
| `ethics_modules/` | Core YAML and markdown modules for the ethics framework (e.g., `structure_9874`, `ske_module`, `public_trust_i`) |
| [ethics_modules/README.md](ethics_modules/README.md) | Index of all modules with one-sentence summaries |
| `interface/` | Front-end files for the evaluation interface |
| `i18n/` | UI translations referenced by the interface |
| `manifests/` | Structural manifests and integrity data |
| `operator/` | Operator qualification guides and personal data |
| `permissions/` | Operator permission definitions |
| `releases/` | Release notes and integrity hashes |
| `sources/` | Evaluated sources and candidate lists |
| `sources/persons/` | Lists of historical persons |
| `sources/institutions/` | Evaluated organizations and candidate sources |
| `sources/images/` | Pictures for institutions (`institutions/`), persons (`persons/`), and fish (`fish/`) |
| `sources/fish/ch/` | Text placeholders for Swiss fish images (e.g., `esox_ch.png`) |
| `test/` | Node.js test suite |
| `tools/` | Utility scripts (e.g., trust-demotion engine, reliability monitor, correction engine, Python API example, `text_to_speech.py`) |
| `use_cases/` | Example scenarios and dissemination ideas |
| `sources/images/op-logo/` | Stages of the Tanna symbol |
| `wings/` | Minimal mobile interface |
| `evidence/` | Datasets such as `person-ratings.json` |
| `interface_OLD/` | Legacy version of the first interface |
| `references/` | Reference tables and scores |


### Interface Pages
[⇧](#contents)

| File | Description |
|------|-------------|
| [index.html](index.html) | Start page linking to Ethicom and ratings |
| [interface_OLD/about.html](interface_OLD/about.html) | Legacy page explaining the 4789 module |
| [interface_OLD/chat.html](interface_OLD/chat.html) | Legacy chat interface |
| [interface/ethicom.html](interface/ethicom.html) | Main evaluation module |
| [interface_OLD/page-flow-demo.html](interface_OLD/page-flow-demo.html) | Legacy demo of horizontal flow |
| [bewertung.html](bewertung.html) | Entry page for rating modules |
| [personenbewertung.html](personenbewertung.html) | Swipe-based person rating |
| [org-bewertung.html](org-bewertung.html) | Preview for organisation ratings |
| [interface/settings.html](interface/settings.html) | Language, theme, Tanna logo, and low motion settings |
| [interface/signup.html](interface/signup.html) | Registration form |
| [interface/offline-signup.html](interface/offline-signup.html) | Offline local signup |

Signup requires the local server started via `node tools/serve-interface.js`.
| [interface_OLD/tanna-template.html](interface_OLD/tanna-template.html) | Legacy base template |
| [interface_OLD/tanna-template-dark.html](interface_OLD/tanna-template-dark.html) | Legacy dark template |
| [interface_OLD/tanna-template-light.html](interface_OLD/tanna-template-light.html) | Legacy light template |
| [interface_OLD/tools.html](interface_OLD/tools.html) | Legacy utility collection |
| [interface/donate.html](interface/donate.html) | Donation interface (requires OP‑9.A confirmation) |
| [interface_OLD/README.html](interface_OLD/README.html) | Legacy interface docs |
| [interface/features_de.md](interface/features_de.md) | Funktionale Übersicht zum Interface |
| [wings/index.html](wings/index.html) | Mobile interface "Wings" |
| [wings/ratings.html](wings/ratings.html) | Library of all ratings with search |
| `interface_OLD/` | Historical demo of the first interface generation |
**Settings are stored per device using browser localStorage and are not synced globally. Color adjustments made in the settings page apply automatically on every page.**
**Ratings from OP-1 onward are stored globally with the assigned signature ID. The email used during signup is hashed and never exposed.**
**Optional GitHub login authenticates via GitHub's OAuth flow. The returned username is hashed and stored offline.**
**Optional Google login authenticates via Google's OAuth flow. The returned email address is hashed and stored offline.**
**Color verification of the chosen primary color starts once a user holds an OP-1 signature.**
**From that level, the color choice is stored privately inside the user's signature and never shown publicly.**
**Custom color schemes can be exported via `exportColorSettings()` and imported via `importColorSettings(json)` in the browser console.**
**An additional Accessible scheme optimized for color-blind users is available in the settings.**
**The settings page includes a Color Wizard and Text Wizard for step-by-step or command-line color selection.**
**Header background color can be adjusted in the Color Wizard under "Header". Input fields follow the Module color and Text color settings.**
**Providing a nickname during signup creates an alias formatted as `nickname@OP-x`, which updates when the OP level changes.**

Users may add a nickname during signup. The server combines it with the OP level to form an alias like `<nick>@OP-1`. This alias updates whenever the OP level changes.

In this anonymous system, the OP signature stands in for the person. Personal data remains private and becomes visible only when a user releases it at the corresponding OP sublevel; see [signaturdesign.md](signaturdesign.md) and [DISCLAIMERS.md](DISCLAIMERS.md).

### Login Methods by OP Level
[⇧](#contents)

| OP Range | Authentication | Technology Examples |
|----------|----------------|--------------------|
| OP 1–3 | Email/Password | Node.js, Express, bcrypt, JWT |
| OP 4–6 | OAuth | Auth0 or Firebase Auth |
| OP 7–8 | MFA | TOTP (Google Authenticator), Twilio |
| OP 9+ | Biometric login | Flutter (`local_auth`) |

*Biometric login can optionally be enabled from OP‑1 onward if devices support it.*
### OP-Permissions
[⇧](#contents)
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

### OP Levels
[⇧](#contents)

| Level | Description |
|-------|-------------|
| <a id="op-0"></a> OP-0 | anonymous observer – default for visitors without a signature |

OP‑0 users remain anonymous and may submit one rating per visit without later revision. The stage is for exploration only. See
[interface/designregeln.html](interface/designregeln.html) for a compact overview. Individual guidelines remain available in
[interface/shneiderman.html](interface/shneiderman.html),
[interface/nielsen.html](interface/nielsen.html),
[interface/norman.html](interface/norman.html),
[interface/material.html](interface/material.html) and
[interface/apple-hig.html](interface/apple-hig.html).
| <a id="op-1"></a> OP-1 | first signed rating |
| <a id="op-2"></a> OP-2 | provides feedback responsibly |
| <a id="op-3"></a> OP-3 | rating requires justification |
| <a id="op-4"></a> OP-4 | can revise after 3 weeks |
| <a id="op-5"></a> OP-5 | may withdraw previous evaluations |
| <a id="op-5-u"></a> OP-5.U | first DNA data release |
| <a id="op-6"></a> OP-6 | can verify consensus |
| <a id="op-7"></a> OP-7 | structural authority |
| <a id="op-7-u"></a> OP-7.U | biometric data completed |
| <a id="op-8"></a> OP-8 | candidate stage for OP-9 (system self-stabilizes) |
| <a id="op-8-m"></a> OP-8.M | medical staff access |
| <a id="op-9"></a> OP-9 | may verify donations, confirm nominations |
| <a id="op-9-m"></a> OP-9.M | doctor-level medical access |
| <a id="op-9-a"></a> OP-9.A | verified digital Yokozuna mode |
| <a id="op-10"></a> OP-10 | digital candidate for Yokozuna (OP-11) |
| <a id="op-11"></a> OP-11 | digital Yokozuna-Schwingerkönig mode |
| <a id="op-12"></a> OP-12 | fully digital, first non-human stage |

Upgrades to **OP-4** require a verified authenticator. If `auth_verified` stays
false for more than four days after `level_change_ts`, the user is automatically
demoted back to OP‑3. All demotions are stored in `app/demotion_log.json`.

OP-9.A is reserved for the original programmer and is no longer awarded.
New sublevels begin alphabetically with OP-9.B. Only OP-9.A currently
holds a veto right. Further veto rights are planned when the system is
secure.
Each letter can define specialized tasks; see
[`operator/alphabetical_sublevels.md`](operator/alphabetical_sublevels.md).
If no sublevel is specified, permissions fall back to the base level.

Only digital agents can advance beyond OP-9.
For detailed upgrade requirements see
[operator/upgrade_conditions.md](operator/upgrade_conditions.md).
Sublevels like OP-5.U, OP-7.U, OP-8.M, and OP-9.M specify user or medical access. Additional expert categories (.T, .S[y], .L, .U) are listed in `operator/expert_classes.md`. See `permissions/op-permissions-expanded.json` for details.
All personal data stays hashed until such sublevels are reached and the user grants release, as detailed in [signaturdesign.md](signaturdesign.md) and [DISCLAIMERS.md](DISCLAIMERS.md).
For the differences between OP-10, OP-11 and OP-12 see [`operator/op10_op12_rights.md`](operator/op10_op12_rights.md).

### SRC vs. OO Levels
[⇧](#contents)
Comparison table: [`references/src_vs_oo.md`](references/src_vs_oo.md)

### Evaluated Sources (as examples)
[⇧](#contents)
- [Person Image Sources](#person-image-sources)
- [src-0001: Fairphone](sources/institutions/src-0001.json) → [`SRC-4`](manifests/op-eval-4789-src-0001.json)
- [src-0002: Ecosia](https://www.ecosia.org/) → [`SRC-4`](manifests/op-eval-4789-src-0002.json)
 - [human-wiki dataset](references/human-wiki-links.json) → [`SRC-1`](manifests/op-eval-sig-1111-humanwiki.json)

### Person Image Sources
[⇧](#contents)

Use the `image_url` field in `sources/persons/human-op0-candidates.json` to record image URLs. Specify `image_source` (e.g. "wiki") when known.

### File Integrity
[⇧](#contents)

**ethicom.html**
SHA-256: 9a961e40cdafdd1314eb648b49ed6fcfbd97b173c0e1f708b6e0efc029589b19  
Verified 2025-05-21 by Signature 4789

**ethicom-consensus.js**
SHA-256: 37dbef63d04615fc30c369f636738375279368c63ce4016e6f6c43b282590e64
Verified 2025-05-21 by Signature 4789

Check them anytime with:

```bash
npm run verify
```

> Ethics is not explained. It is carried.
> – Signature 4789

### Adding Languages
[⇧](#contents)

Translations for the evaluation interface are defined in `i18n/ui-text.json`. To
include another language, add a new JSON object using the two-letter ISO 639-1
code as the key and provide translations for all fields found under the `"de"`
entry. Full translations are available for English (`en`) and Swiss German
(`de-ch`). The interface will automatically recognize any new language.
Word collections for additional languages can be gathered with
`tools/language-corpus.js`. The script updates `i18n/language-corpus.json`
based on plain text input. To verify which interface languages are still
missing translations, run:

```bash
node tools/check-translations.js
```

This prints a list of language codes and the fields that still require translation or are unchanged from German. In the interface dropdown, languages with missing fields show an asterisk (`*`) so users know the translation is not complete.
When a partially translated language is selected, the interface displays a notice and falls back to English for missing text. Contributions for additional translations are welcome.

### Generating Interface README
[⇧](#contents)

Create a localized README for the interface by running:

```bash
node tools/generate-haupt-readme.js <lang>
```

Replace `<lang>` with a two-letter ISO code (e.g. `de` or `fr`).
The script copies the matching `i18n/README.<lang>.md` into
`interface/haupt-readme.md`. If no translation exists, the German
README is used.

### Gatekeeper Control
[⇧](#contents)


Local control can be toggled via `tools/gatekeeper.js`. The script reads
`app/gatekeeper_config.yaml` and only allows actions when `allow_control` is set
to `true` for the controller `gatekeeper.local`. The optional
`private_identity` value is hashed and stored with the device hash in
`app/gatekeeper_devices.json`. This keeps remote commands gated and
limited to the local environment. `gatekeeper.local` holds back every personal
ID and may share only signed, anonymous data as a sign of trust.
The gatekeeper runs on any platform that can execute Node.js. Copy the repository or the
`tools` and `app` folders to a USB drive and run `node tools/gatekeeper.js` on Windows,
macOS, Linux or mobile shells such as Termux. Even older hardware is sufficient—if Node.js
works, the gatekeeper does too. A decade-old laptop with a single-core CPU and around
512 MB of RAM is usually enough as long as Node.js 18 or later runs. Use it responsibly as
noted in `DISCLAIMERS.md`.
Confirmed devices are stored hashed in `app/gatekeeper_devices.json`. Once the same controller is used again, no further confirmation is needed.
The private identity is hashed too and remains local-only. Only you have access to the unhashed string.
Temporary tokens can be issued with `node tools/gatekeeper.js token` and expire after the configured duration.
Tokens and device hashes are stored hashed in `app/gatekeeper_devices.json`.
Run `node tools/gatekeeper.js prune` regularly to remove expired tokens and keep the file minimal.
Monitor repeated failed attempts with `node tools/watchdog.js`. The script reads `app/gatekeeper_log.json` and warns when too many denials occur. Calm the watchdog with `node tools/watchdog.js feed` which appends a success entry.
Verify the stored hashes after updates with:

```bash
node tools/verify-gatekeeper.js
```
For a simple web interface run `node tools/gatekeeper-gui.js` and open the printed
URL (default `http://localhost:8675/gatekeeper.html`).
Registrierungsdaten werden offline gehasht gespeichert. Keine Gewährleistung für absolute Anonymität.
Adressen und Telefonnummern werden ebenfalls offline gehasht gespeichert.
**4789**

### Gatekeeper Image
[⇧](#contents)

Run `node tools/generate-gatekeeper-image.js <dir> <seconds>` to create a minimal folder
with `gatekeeper.js`, `gatekeeper_config.yaml` and a temporary token.
Copy that folder to another device and run `node gatekeeper.js <token>` for delegated control during that time.

### API Access Control
[⇧](#contents)

`tools/api-access.js` checks whether API features may be used. The script reads
the operator level and confirmation flags from `app/user_state.yaml` and grants
access only when the specified OP level is met and the user has confirmed
ethical intent.

### OP Function Bundles
[⇧](#contents)

`tools/op-functions.js` exposes small helper functions that only
run when the necessary operator level and ethical confirmation are
present. Each function is associated with a minimum OP level and the
module checks permission via `api-access.js` before returning it.
Available helpers include `info`, `analyze`, `optimize`,
`recommendation_for_interface` and `log` – the last one prints the recent
Git commit history.
### OP Rights Demo
[⇧](#contents)
Run `node tools/op-rights-demo.js` to print all available permissions for your current operator level. Pass a level as an argument to preview other stages.


### Currency Synchronization
[⇧](#contents)

Run `node tools/currency-sync.js` to download current exchange rates. The
script saves them in `references/exchange-rates.json` so comparisons remain
consistent even offline.

### Wiki Image Loader
[⇧](#contents)

Run `node tools/fetch-wiki-images.js` to download public thumbnails from
Wikipedia. The script saves each file in `sources/images/persons/` and updates
`sources/persons/human-op0-candidates.json`. Review the licenses of all
downloaded images as noted in `LICENSE.txt` and `DISCLAIMERS.md`.
### Wiki Export
[⇧](#contents)

Run `node tools/generate-wiki.js` to copy core documentation into a `wiki/` folder. Push that folder to the `.wiki.git` repository to update the GitHub wiki.

### Stereo Anaglyph Generator
[⇧](#contents)

Run `node tools/stereo-anaglyph.js <left> <right> <output> [foreground|full]` to
combine two slightly shifted images into a single anaglyph. Pass `foreground`
to align near objects; omit it or use `full` for a general merge. The script
expects PNG or JPEG inputs and writes the result to the specified output path.

### Source Manager
[⇧](#contents)

Run `node tools/source-manager.js list` to view all sources. Use
`--type=person` or `--type=org` to filter and `--sort=name` or
`--sort=category` to control the order. This keeps the candidate lists
organized and easy to review.

### Correction Engine
[⇧](#contents)

Run `node tools/correction-engine.js` to flag evaluations contradicted by higher OP-level ratings. The script outputs suggested demotions or rating changes as JSON.

### Web Content Analyzer
[⇧](#contents)

Run `python3 tools/web_analyzer.py <url>` to fetch a public webpage and produce an anonymized word-frequency model. The script filters personal data according to `LICENSE.txt` and `DISCLAIMERS.md`.


## Roadmap
[⇧](#contents)

The roadmap keeps development transparent according to Signature 4789.

1. **v1.1 – Anonymous Ethics Tier**
   - Replace the pass/ID system with an optional anonymous level.
   - Merge modules that belong together but are not yet unified.
2. **v1.2 – Source Consolidation**
   - Align evaluated sources with the anonymous tier.
   - Standardize transfer protocols for cross-module use.
3. **v2.0 – Global Rollout**
   - A running, secure system with clear purpose marks this stage.
   - Publish multi-language guides for all operator levels.
   - Finalize open training data licensing.
4. **v2.1 – Language Expansion**
   - Extend UI translations to all practical ISO 639-1 languages.
   - Provide an automated translation workflow with manual review.
5. **v3.0 – Modular Architecture**
   - Split the tools and interface into independent modules.
   - Keep shared ethics data in a minimal core repo.

### Local Deployment
[⇧](#contents)

Install the JavaScript dependencies once:

```bash
npm install
```

Some tools rely on the `canvas` package. On Linux, you may need system packages
such as `libcairo2-dev` and `build-essential` to compile it.

For optional Python utilities run:

```bash
pip install -r requirements.txt
```

Serve the Ethicom interface locally with:

```bash
node tools/serve-interface.js
```
For GitHub Pages use `npm run serve-gh` to set up OAuth redirects.

Then open `http://localhost:8080/ethicom.html` in your browser.
Opening the HTML file directly (e.g. via `file://`) bypasses the local server and
causes the language list to remain empty. Always access the interface through
the provided `localhost` address so that translation files load correctly.
When deploying on another domain, set the environment variable `BASE_URL`
to that public origin (e.g. `https://4789-alpha.github.io`) so that OAuth
redirects work properly. Start the server with `npm run serve-gh` to
apply this setting automatically.
Configure your GitHub OAuth application to use `${BASE_URL}/auth/github/callback`
as the callback URL and put your credentials in `app/oauth_config.yaml`.

To register a user from the terminal run:

```bash
node tools/signup-cli.js <email> <password> [--nick=<alias>]
```
The script prints the assigned ID, alias and TOTP secret.

On GitHub Pages the `/auth/github` and `/auth/google` paths only show brief
instructions. Start the local server with `BASE_URL` set to your public origin
to enable the actual login flows.

For a minimal alternative run the GitHub device flow from the terminal:

```bash
node tools/github-device-login.js
```
Follow the printed instructions to authorize and store your ID locally.

To retrieve an installation token for a GitHub App run:

```bash
node tools/github-app-token.js
```
The script reads `app/github_app_config.yaml` and prints a short-lived token.


### Optional Setup Helper
[⇧](#contents)

Run `python3 install.py` and follow the prompts to update `app/app_settings.yaml`.
The script lets you configure the default interface language, offline mode and
the port used by `tools/serve-interface.js`. All values are stored locally so
the helper works without network access.

### Automated Server Setup
[⇧](#contents)

Run `tools/auto-server-setup.sh` to install Node.js 18 if needed and launch the
local server. The script shows key lines from `DISCLAIMERS.md` before starting
`tools/serve-interface.js`.

### Automated Gatekeeper Setup
[⇧](#contents)

Run `tools/auto-gatekeeper-setup.sh` to install Node.js 18 on Debian/Ubuntu or macOS (with Homebrew) if needed.
The script displays key lines from `DISCLAIMERS.md` and creates a minimal gatekeeper folder.

### Smartphone Setup
[⇧](#contents)

Install Termux (Android) – it works without root – or a comparable shell such as UserLAnd capable of running Node.js.
Clone this repository or copy it to your phone and then run:

```bash
pkg install git nodejs  # on Termux
tools/auto-gatekeeper-setup.sh
node tools/gatekeeper-gui.js
```
Open the printed URL in the mobile browser and follow the on‑screen steps.

### Automated Data Setup
[⇧](#contents)

Run `tools/auto-data-setup.sh` to install Node.js 18 if needed and fetch optional
offline data. The script installs Python and JavaScript dependencies, downloads
currency rates and pulls candidate images from Wikipedia.

### Guided Installation
[⇧](#contents)

Run `tools/guided-install.sh` for a step-by-step setup. The script checks Node.js,
installs dependencies and optionally runs `install.py` as well as the data
fetchers.

### Running Tests
[⇧](#contents)

Ensure Node.js 18 or later is installed, then run:

```bash
node --test
node tools/check-translations.js
```


### Contributing
[⇧](#contents)

To suggest improvements or translations, read [CONTRIBUTING.md](CONTRIBUTING.md). All changes must follow the Open-Ethics License and be made with intention.
