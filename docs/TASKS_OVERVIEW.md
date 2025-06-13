# Implementation Tasks

This file tracks pending improvements and roadmap actions.

## Accessibility and Setup
- [x] Extend `README.md` with a quick start and clear entry point.
- [x] Use short, active sentences for better readability.
- [x] Add a simple ASCII diagram of the workflow.
- [x] Provide a setup script for initial configuration (`tools/guided-install.sh`).
- [x] Document a consistent folder structure.
- [ ] Keep default settings in `config.json`.

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
- [ ] Provide options for formal, informal or neutral address.
- [x] Give clearer error messages with hints.
- [ ] Add optional humorous responses.

## Advanced
- [x] Publish an OpenAPI spec.
- [x] Add integrated help (`--help` or hotkeys).
- [ ] Display version and build number in the interface.

## Roadmap Items
- [ ] Replace the pass/ID system with an optional anonymous level.
- [ ] Merge currently separate modules.
- [ ] Align source evaluation with the anonymous tier.
- [ ] Standardize transfer protocols across modules.
- [ ] Finalize data licensing and provide global guides.
- [ ] Expand translations to all ISO 639-1 languages with a workflow.
- [ ] Split tools and interface into independent modules.
