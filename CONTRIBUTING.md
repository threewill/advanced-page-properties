# Contributing

Thank you for your interest in contributing to Advanced Page Properties.

## Development setup

1. Install Node.js **22.14+** (see `.nvmrc`)
2. `npm install`
3. `npm start` for local development (update `config/serve.json` with your tenant workbench URL)
4. `npm run build` for a production `.sppkg`

## Pull requests

1. Branch from `main`
2. Keep changes focused
3. Verify `npm run build` succeeds before opening a PR
4. Preserve existing solution and web part GUIDs unless intentionally creating a new App Catalog identity

## Reporting issues

Open a GitHub issue with reproduction steps, field types involved, and SPFx/Node versions.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.
