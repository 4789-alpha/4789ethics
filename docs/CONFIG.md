# Configuration Overview

The optional `config.json` in the project root bundles default paths and
server settings used by the local tooling.  Values can be overridden by
environment variables where applicable.

| Field | Default | Description |
|------|---------|-------------|
| `port` | `8080` | Local port used by `tools/serve-interface.js`. Can be overridden via `PORT` env variable. |
| `baseUrl` | `http://localhost:8080` | Base URL for OAuth callbacks and links. Overridden via `BASE_URL` env variable. |
| `paths.users` | `app/users.json` | Storage for created user accounts. |
| `paths.evaluations` | `app/evaluations.json` | Storage for submitted evaluations. |
| `paths.connections` | `app/connections.json` | Storage for connection requests. |
| `paths.oauthConfig` | `app/oauth_config.yaml` | OAuth client configuration file. |
| `paths.gatekeeperConfig` | `app/gatekeeper_config.yaml` | Gatekeeper policy configuration. |
| `paths.gatekeeperDevices` | `app/gatekeeper_devices.json` | Persistence for recognized devices and tokens. |
| `paths.gatekeeperLog` | `app/gatekeeper_log.json` | History of gatekeeper events. |
| `paths.demotionLog` | `app/demotion_log.json` | Records automatic OP-level demotions. |
