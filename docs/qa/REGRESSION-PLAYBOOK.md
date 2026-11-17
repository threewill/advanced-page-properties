# Regression playbook

Manual cases for Advanced Page Properties. There is **no automated test suite** (`TD-02`). CI `npm run build` compiles and packages; it does not exercise these cases.

Record a run under [`runs/`](runs/) (copy a case file and note date, environment, result). Do not put tenant URLs or secrets in committed run notes.

Starter cases live in [`test-cases/`](test-cases/). After a feature change, add or update cases in the same PR (or write `No regression impact: <reason>`).

## When to run

| Trigger | What to run |
| --- | --- |
| Docs-only / no `src/` change | Nothing required beyond stating `No regression impact`. |
| Field rendering or property pane | Field-type cases + capsule links + theme. |
| URL web part | Tiles vs embed + theme. |
| Toolchain, GUIDs, package version, PnP helpers | Package/deploy validation + in-place upgrade. |

## Case index

| ID | File | Area |
| --- | --- | --- |
| TC-01 | [TC-01-field-types.md](test-cases/TC-01-field-types.md) | Property display per field type (taxonomy, Boolean, Note, others) |
| TC-02 | [TC-02-capsule-search-links.md](test-cases/TC-02-capsule-search-links.md) | Capsule search links |
| TC-03 | [TC-03-theme-awareness.md](test-cases/TC-03-theme-awareness.md) | Theme variants |
| TC-04 | [TC-04-url-tiles-vs-embed.md](test-cases/TC-04-url-tiles-vs-embed.md) | URL tiles vs iframe embed |
| TC-05 | [TC-05-upgrade-in-place.md](test-cases/TC-05-upgrade-in-place.md) | Upgrade in place from an earlier version |
| TC-06 | [TC-06-package-and-deploy.md](test-cases/TC-06-package-and-deploy.md) | Package and deploy (ties to `docs/DEPLOYMENT_VALIDATION.md`) |

## Environments

Use [`docs/ops/ENVIRONMENTS.md`](../ops/ENVIRONMENTS.md). Workbench is enough for layout smoke tests; field values and upgrade checks need a Site Page in a tenant App Catalog deployment.
