# Backend Server

This minimal Express server serves as a starting point for integrating the Ethics modules and evaluation system.

## Usage

Install dependencies from the repository root and run:

```bash
node backend/server.js
```

The server exposes three routes:

- `GET /status` – health check returning `{status: 'ok'}`.
- `POST /echo` – echoes back a JSON body `{message}`.
- `GET /ethics` – protected route requiring OP-3 level via `api-access.js`.

Further modules can be added incrementally as outlined in the project roadmap.
