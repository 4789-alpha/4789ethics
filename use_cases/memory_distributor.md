# Memory Distributor

`tools/memory-distributor.js` assigns memory units to all active users. The oldest active gatekeeper triggers the distribution.

Run the script with:

```bash
node tools/memory-distributor.js
```

The configuration lives in `app/memory_config.json` and updates after each run.
