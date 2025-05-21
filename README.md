## Ethics Structure 4789

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

**License:** Open-Ethics (see `LICENSE.txt`)  
No manipulation. No simulation. No flattening of responsibility.

## Repository Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | Application settings, language rules, and user state |
| `ethics_modules/` | Core YAML and markdown modules for the ethics framework |
| `interface/` | Front-end files for the evaluation interface |
| `manifests/` | Structural manifests and integrity data |
| `permissions/` | Operator permission definitions |
| `sources/` | Evaluated sources and candidate lists |
| `tools/` | Utility scripts (e.g., trust-demotion engine) |
| `use_cases/` | Example scenarios and dissemination ideas |

### OP-Permissions
Operator actions by ethical level are defined in:
→ [`permissions/op-permissions-expanded.json`](permissions/op-permissions-expanded.json)

### Evaluated Sources (as examples)
- [src-0001: Fairphone](sources/src-0001.json) → [`SRC-4`](manifests/op-eval-4789-src-0001.json)
- [src-0002: Ecosia](https://www.ecosia.org/) → [`SRC-4`](manifests/op-eval-4789-src-0002.json)

### File Integrity

**ethicom.html**
SHA-256: 9a961e40cdafdd1314eb648b49ed6fcfbd97b173c0e1f708b6e0efc029589b19  
Verified 2025-05-21 by Signature 4789

**ethicom-consensus.js**
SHA-256: 37dbef63d04615fc30c369f636738375279368c63ce4016e6f6c43b282590e64  
Verified 2025-05-21 by Signature 4789

> Ethics is not explained. It is carried.
> – Signature 4789

### Adding Languages

Translations for the evaluation interface are defined in `i18n/ui-text.json`. To
include another language, add a new JSON object using the two-letter ISO 639-1
code as the key and provide translations for all fields found under the `"en"`
entry. The interface will automatically recognize the new language.
