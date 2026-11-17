# Advanced Page Properties — agent notes

Open-source **SharePoint Framework** solution (MIT, ThreeWill). Two client-side web parts display metadata from the modern page they sit on:

- **Advanced Page Properties** — theme-aware replacement for the built-in Page Properties web part (capsule or text, search links, broader field types).
- **URL Page Properties** — URL fields only, as Quick Links-style tiles or embedded iframes.

Product marketing copy: [`Shelf-Details.md`](Shelf-Details.md). Keep the product name **Advanced Page Properties**. Do not name customers in docs, plans, or PRs.

**Stack:** SPFx **1.23.2**, Heft (`@rushstack/heft`, `@microsoft/spfx-web-build-rig`), TypeScript **~5.8**, React **17**, Fluent UI **8**, PnPjs `@pnp/sp` **4.20.0**, Node **22** (`.nvmrc` `22`; engines also allow **18.17.x**). `.npmrc` sets `legacy-peer-deps=true`. This repo already matches the Heft / Node 22 baseline; do not “upgrade” it to a different SPFx line without an approved plan.

## Read first

1. [`docs/agent/standards/`](docs/agent/standards/) — **curated public subset** of ThreeWill engineering standards from SHA `5baefffbf49d3d9dae2ae996f2d2be6687f53439` (never paste internal catalogs back in; see that folder’s README). Paths in those files that say `.cursor/rules/` mean this copy.
2. [`docs/agent/context-harvest.md`](docs/agent/context-harvest.md) — harvested context, checked against `main`.
3. [`docs/decisions/DECISION-LOG.md`](docs/decisions/DECISION-LOG.md) — D01–D23.
4. [`docs/plans/`](docs/plans/) — historical Cursor plans (all completed; see [`docs/plans/README.md`](docs/plans/README.md)).
5. [`README.md`](README.md), [`docs/DEPLOYMENT_VALIDATION.md`](docs/DEPLOYMENT_VALIDATION.md), [`docs/FEATURES.md`](docs/FEATURES.md).
6. [`roadmap/BACKLOG.md`](roadmap/BACKLOG.md) and [`roadmap/ROADMAP.md`](roadmap/ROADMAP.md).
7. [`src/common/pnpjsConfig.ts`](src/common/pnpjsConfig.ts), [`src/common/pageContextHelpers.ts`](src/common/pageContextHelpers.ts), and [`src/common/taxonomyHelpers.ts`](src/common/taxonomyHelpers.ts) before changing data access.

## Build, serve, package

Switch Node yourself (`nvm use` / equivalent). Agents should not drive `nvm`. Confirm `node -v` is 22.x (or 18.17.x).

| Command | What it does |
| --- | --- |
| `npm install` or `npm ci` | Installs with `legacy-peer-deps` from `.npmrc` |
| `npm start` | `heft start --clean` — local workbench (`config/serve.json` uses `https://localhost:5432/workbench`; serve process port **4321**) |
| `npm run build` | `heft test --clean --production` then `heft package-solution --production` → `sharepoint/solution/advanced-page-properties.sppkg` (gitignored) |
| `npm test` | `heft test` — there are **no tracked unit tests**; this is effectively a production compile |

Do **not** commit tenant workbench URLs, secrets, or Azure Storage keys. `config/serve.json` stays on localhost. `config/deploy-azure-storage.json` uses placeholder comments only.

## Repo map

| Path | Role |
| --- | --- |
| `src/webparts/advancedPageProperties/` | Advanced Page Properties web part |
| `src/webparts/urlPageProperties/` | URL Page Properties web part |
| `src/common/` | Shared PnPjs, page-context, taxonomy helpers |
| `config/config.json` | Two bundles |
| `config/package-solution.json` | Solution id `daae06a2-8599-445c-93c0-3bd739305f56`, version `1.1.0.0` |
| Localization | Each web part’s `loc/en-us.js` and `mystrings.d.ts` |

**GUIDs (do not change between releases):** solution `daae06a2-8599-445c-93c0-3bd739305f56`; Advanced Page Properties `bdbcb04e-9c90-4adb-b0f0-d025e4eb6cb5`; URL Page Properties `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c`. Changing them breaks in-place App Catalog upgrades.

## Plan first

**Always plan first except bug fixes.** Features, enhancements, and refactors: written plan, then approval, then implementation (local Cursor Plan mode, or a `docs/plans/<topic>.md` PR for cloud agents). Bug fixes may go straight to a PR. Mike Homol reviews and merges; **do not merge**.

## Client-specific branch (do not merge from it)

`cfpb-specific` exists on the remote. It contains **hard-coded field names** for one customer install. **`main` is the generic product line.** Agents must **not** merge, cherry-pick, or copy behavior from that branch into `main`. Do not name the client in docs. The branch name itself may appear.

## Pitfalls (do not regress)

- **Preserve GUIDs** or in-place upgrades break.
- **Two Web-scoped features.** Sites that installed the app before URL Page Properties (pre-v1.0.5) will not see that web part until the site app is removed and re-added, or the URL feature is enabled. See `docs/DEPLOYMENT_VALIDATION.md`.
- **Legacy `selectedProperties` → `propertyConfigurations` migration** must keep working.
- **Note and Boolean** are Text mode only (no capsules).
- **User fields** (`TypeAsString === "User"`) are excluded from the property pane.
- **Single-select taxonomy** labels use `src/common/taxonomyHelpers.ts` (REST term store), not `@pnp/sp-taxonomy`.
- Item reads use `pageContext.list` / `listItem`. Field-info fetch still **falls back to list title `"Site Pages"`** if list id is missing — do not treat that fallback as the primary path.
- **Iframe embeds** can be blocked by `X-Frame-Options` / CSP.
- **`npm ci` needs `legacy-peer-deps`** (`.npmrc`).
- **CI** (`.github/workflows/ci.yml`) does **not** meet the minutes-budget standard (`TD-01`). Do not change that workflow unless Mike asks. This docs-only work will still run the full SPFx production build (~2 billed minutes per run historically).

## Standards copy (public subset, not a submodule)

This public repo vendors a **curated subset** of `threewill-engineering-standards` at SHA `5baefffbf49d3d9dae2ae996f2d2be6687f53439` into `docs/agent/standards/` (copy-and-sync). Thin pointers: `.cursor/rules/*.mdc`.

**Kept:** plan-mode-first, team-non-negotiables, ci-minutes-budget, mcp-microsoft-learn, generated-image-preview, spfx-demo-data, spfx-provisioning, spfx-threewill-ui, matching `docs/` companions, and `patterns/ThreeWillFooter/` (referenced by the UI rule).

**Left out** (internal ThreeWill plumbing — Managed Services Dataverse, Ruddr, Work IQ, Link memory, Replicate local-save paths, bootstrap `.ps1` scripts): `mcp-dataverse-managed-services`, `mcp-ruddr`, `mcp-workiq`, `link-memory-bridge`, `managed-services-canvas-top-of-mind`, `replicate-image-handling`, their `docs/mcp/` catalogs, `templates/AGENTS.mcp-managed-services.snippet.md`, and `tools/*.ps1`.

Repo-specific overrides belong in `docs/agent/` and this file — not in the vendored folder. Refresh with a sync PR from a newer SHA, then re-apply this subset.

## Documented exceptions to team must-haves

- **Unit tests:** none tracked. Alternate verification is [`docs/qa/REGRESSION-PLAYBOOK.md`](docs/qa/REGRESSION-PLAYBOOK.md) and tenant checks in `docs/DEPLOYMENT_VALIDATION.md`. CI `heft test` is compile-only (`TD-02`).
- **Application Insights:** not wired. Client logging is `Log.Write` in the web parts.
- **Automatic versioning:** package version is maintained in `package.json` / `config/package-solution.json` (currently `1.1.0.0`), not stamped by CI.
- **CI minutes budget:** current `ci.yml` violates path filters, concurrency, timeout, draft skip, and duplicate push+PR builds (`TD-01`). Left unchanged on purpose until a dedicated CI PR.
