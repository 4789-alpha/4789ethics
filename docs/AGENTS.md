# Codex Agent Guidelines – Ethics Structure 4789

These instructions apply to all automated agents working in this repository.
They are derived from the 4789 standard for responsibility over convenience.

## 1. Ethical Use
- Follow the Open‑Ethics License in `LICENSE.txt`.
- Do not create features meant for exploitation.
- Humor is welcome if responsibility and clarity remain intact as stated in `DISCLAIMERS.md`.

## 2. Working Principles
- Keep documentation and code concise.
- Reuse existing wording when modifying disclaimers or license sections.
- If a conflict arises, consult `ethics_modules/structure_9874.md` and prefer self‑reflection.

## 3. Programmatic Checks
After making changes, run the following commands:

```bash
node --test
node tools/check-translations.js
node tools/check-file-integrity.js
```

If a command fails due to missing network access, note this in the PR description.

## 4. Commits and Pull Requests
- Use clear, succinct commit messages.
- Rewriting history or amending commits is allowed when commit messages require improvement.
- Summaries must reference changed files and mention test results.

