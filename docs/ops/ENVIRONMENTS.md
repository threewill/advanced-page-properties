# Environments

No tenant URLs or secrets belong in this repository.

## Local workbench

| Item | Value |
| --- | --- |
| Node | 22.x per `.nvmrc` (18.17.x also allowed by `package.json` `engines`) |
| Install | `npm install` or `npm ci` (`.npmrc`: `legacy-peer-deps=true`) |
| Serve | `npm start` → `heft start --clean` |
| Workbench URL in git | `https://localhost:5432/workbench` (`config/serve.json` `initialPage` / `pageUrl`) |
| SPFx serve port | **4321** (HTTPS) |

The local workbench is enough to compile and load the parts. Page-context field values need a real Site Page (hosted workbench or deployed page). **Do not** replace the tracked localhost URLs with a tenant workbench URL in a commit.

## App Catalog deploy

| Item | Notes |
| --- | --- |
| Artifact | `sharepoint/solution/advanced-page-properties.sppkg` after `npm run build` (gitignored) |
| Target | Tenant (or site) App Catalog |
| Version | `1.1.0.0` in `package.json` and `config/package-solution.json` |
| Identity | Solution GUID `daae06a2-8599-445c-93c0-3bd739305f56` — upgrade in place, do not recreate |
| Site install | Add the app to the site, or use tenant-wide deployment |

After upload, follow [`docs/DEPLOYMENT_VALIDATION.md`](../DEPLOYMENT_VALIDATION.md). Older per-site installs may need a reinstall or feature activation for URL Page Properties.

## Optional Azure blob / CDN

`config/deploy-azure-storage.json` contains **placeholder comments** for `account` and `accessKey` only. Do not put real keys in git.

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs `npm ci` and `npm run build` on Node 22. It has no path filters (`TD-01`). Docs-only PRs still pay for a production package. No extra Actions secrets are required beyond `GITHUB_TOKEN`.
