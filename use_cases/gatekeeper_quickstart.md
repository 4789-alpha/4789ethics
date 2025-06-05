# Gatekeeper Quickstart

This guide shows the minimal steps to start the gatekeeper.

1. Check `app/gatekeeper_config.yaml`. Leave the defaults or set your `controller` and `private_identity`.
2. Run `node tools/gatekeeper.js token` to create a temporary token. The token duration is defined in the config.
3. Start the gatekeeper with the printed token:

```bash
node tools/gatekeeper.js <token>
```

You can also start a small web interface:

```bash
node tools/gatekeeper-gui.js
```

and open the shown URL (default `http://localhost:8675/gatekeeper.html`).

All device and identity information is stored hashed as noted in `DISCLAIMERS.md`.
The gatekeeper neither performs DNA analysis nor checks your geolocation. Only
the hashed strings from `gatekeeper_config.yaml` are used for confirmation.
