# Contributing to Ethics Structure 4789

This project welcomes ethical improvements and translations. Before changing the content, make sure to read these files:

1. `GET_STARTED.md` – basic orientation and intent.
2. `structure_9874.md` – principles for clarity.
3. `README.md` – overall goals and license.

Apply changes with intention and in alignment with the Open‑Ethics License:

```
Freely usable for ethically consistent systems.
```

Use it. Adapt it. But never without consequence.

## Branching Guidelines

Create branches for specific categories such as `design`, `ethics`, or `technical`.
Merge them back into `main` once they pass review and all checks:

```bash
node --test
node tools/check-translations.js
node tools/check-file-integrity.js
```

### Jekyll Branches

New users (except **OP-9.A**) should work in personal branches prefixed with
`jekyll-`. A Jekyll branch is a regular Git branch for proposing changes to the
static site generated with Jekyll. Name it after your user, for example
`jekyll-op7b`. OP-9.A remains the owner of `main` and approves all merges.

## Commits and Pull Requests

- Use clear, succinct commit messages.
- Do not rewrite history or amend prior commits.
- Summaries must reference changed files and mention test results.

