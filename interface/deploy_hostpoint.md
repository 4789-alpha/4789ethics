# Deploying the Interface on Hostpoint

Hostpoint can serve the static files from this repository without extra build steps.
Upload `index.html` and the `interface/` directory to your web root and set that directory as the publish path.
The interface is pre-built, so no build command is needed.

The gatekeeper server should run on your own device (for example a Raspberry Pi, laptop or phone) as explained in `README.md`.
Only start it on Hostpoint if the host supports Node.js 18 or later and you explicitly allow remote control in `app/gatekeeper_config.yaml`.
