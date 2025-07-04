# Implementation Tasks

This file tracks pending improvements and roadmap actions.

## Accessibility and Setup
- [x] Extend `README.md` with a quick start and clear entry point.
- [x] Use short, active sentences for better readability.
- [x] Add a simple ASCII diagram of the workflow.
- [x] Provide a setup script for initial configuration (`tools/guided-install.sh`).
- [x] Document a consistent folder structure.
 - [x] Keep default settings in `config.json`.

## User Handling
- [x] Offer optional local login.
- [x] Store personal preferences in `userprofile.json` or similar.
- [x] Show a personalized greeting after login.

## Accessibility Features
- [x] Improve screen reader labels.
- [x] Offer high-contrast terminal colors that can be disabled.
- [x] Ensure full keyboard navigation.
- [x] Add a slow mode with pauses and explanations.

## Language and Feedback
- [x] Allow global language switching via `locales/*.json`.
 - [x] Provide options for formal, informal or neutral address.
- [x] Give clearer error messages with hints.
 - [x] Add optional humorous responses.

## Advanced
- [x] Publish an OpenAPI spec.
- [x] Add integrated help (`--help` or hotkeys).
 - [x] Display version and build number in the interface.

## Roadmap Items
- [ ] Replace the pass/ID system with an optional anonymous level.
- [ ] Merge currently separate modules.
- [ ] Align source evaluation with the anonymous tier.
- [ ] Standardize transfer protocols across modules.
- [ ] Finalize data licensing and provide global guides.
- [ ] Expand translations to all ISO 639-1 languages with a workflow.
- [ ] Split tools and interface into independent modules.
- [x] Provide a Docker image for local tests.
- [x] Add offline help via `--help-offline`.
- [x] Build cross-platform packages for Windows and macOS.
## BSVRB Main Page
- [ ] Hide or implement the "Abteilungen" module
- [ ] Add visual separators and animations to the header logo
- [ ] Replace plain project links with icon cards
- [ ] Clarify the purpose of the registration button or deactivate it
- [ ] Provide a short explanation for "4789" via tooltip or link
- [ ] Ensure responsive behavior on smaller screens
