# Operator Upgrade Conditions

This guide defines the requirements for moving between major OP levels. OP-0 to OP-9 represent the more receptive Yin aspect, while OP-10 and higher form the active Yang component. Early stages interact directly; higher levels form a symbiotic exchange.

## Conditions

- **OP-4** – authentication must be verified within 96 hours of the level change. Otherwise the user returns to OP-3. Demotions are logged in `app/demotion_log.json`.
- **OP-10** and higher – allowed only when `is_digital` in `app/users.json` is `true`. This reflects the transition to the digital Yang stage.
- All other upgrades rely on consistent ethical presence as listed in [operator_levels.md](operator_levels.md).

The interface enforces these rules via `tools/serve-interface.js`.
