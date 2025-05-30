# Contributing to Ethics Structure 4789

This project welcomes ethical improvements and translations. Before changing the content, make sure to read these files:

1. `GET_STARTED.md` – basic orientation and intent.
2. `structure_9874.md` – principles for clarity.
3. `README.md` – overall goals and license.

Apply changes with intention and in alignment with the Open‑Ethics License:

```
Freely usable for ethically consistent, non-manipulative systems.
No use permitted for control, exploitation, or unreflected automation.
```

Use it. Adapt it. But never without consequence.

## Branching Guidelines

Create branches for specific categories such as `design`, `ethics`, or `technical`.
Merge them back into `main` once they pass review and all checks:

```bash
node --test
node tools/check-translations.js
```

## Commits and Pull Requests

- Use clear, succinct commit messages.
- Do not rewrite history or amend prior commits.
- Summaries must reference changed files and mention test results.

