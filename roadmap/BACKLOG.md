# Backlog

Horizons: **Proposed** / **Now** / **Next** / **Later** / **Parked**. IDs: `FEAT-nn`, `BUG-nn`, `TD-nn`, `UX-nn`. Bugs include a severity. Each item records source and date (America/New_York).

Publishable Now/Next/Later view: [`ROADMAP.md`](ROADMAP.md).

## Now

| ID | Type | Area | Driver | Item | Source | Date |
| --- | --- | --- | --- | --- | --- | --- |
| TD-00 | Tech debt | Docs / agents | Cloud agents | Land cloud-prep docs (this PR): AGENTS.md, harvest, decision log, vendored standards, Shelf-Details, features, roadmap, PR/regression/env stubs. | Mike Homol, cloud-prep | 2026-11-17 |
| TD-01 | Tech debt | CI | Minutes budget | `.github/workflows/ci.yml` does not meet the CI minutes-budget standard. **Do not change it in a docs PR.** Fixes: (1) `paths-ignore` for `docs/**`, `*.md`, `**/*.md`, `roadmap/**`; (2) `concurrency` + `cancel-in-progress`; (3) PR-only product build (no duplicate `push` + `pull_request` of the same work); (4) `timeout-minutes` on the job; (5) skip drafts and include `ready_for_review`. Historical successful runs billed **~2 minutes each** (91–109s, rounded up). A path-filtered PR-only build would be ~2 min per docs-skipped feature PR instead of **4–6 min** when feature-branch push + PR + merge push all fire. This docs PR will still run the full SPFx production build. | Harvest vs `docs/ci-minutes-budget.md`; workflow last changed 2026-07-06 | 2026-11-17 |
| TD-03 | Tech debt | GitHub settings | PUBLIC_RELEASE leftovers | Repo **description** and **topics** are still empty (`docs/PUBLIC_RELEASE.md` has suggested text). The `v1.1.0.0` GitHub Release has **no `.sppkg` asset** (optional on the checklist; package is gitignored). Repo settings — not a code change. | `docs/PUBLIC_RELEASE.md`; GitHub API 2026-11-17 | 2026-11-17 |

## Next

| ID | Type | Area | Driver | Item | Source | Date |
| --- | --- | --- | --- | --- | --- | --- |
| TD-02 | Tech debt | QA | Testability | No tracked automated tests. CI `heft test` is compile-only. Manual playbook exists under `docs/qa/`. Consider a minutes-safe test job if/when tests exist. | `git ls-files`; CI | 2026-11-17 |
| FEAT-01 | Feature | Advanced Page Properties | Field coverage | Allow User fields to be selected and displayed (currently `TypeAsString === "User"` is excluded). Confirm whether `UserMulti` should be included. | README "Supported Field Types"; code | 2026-11-17 |
| FEAT-02 | Feature | URL Page Properties | Tiles | Custom image thumbnails for tiles (`customImageUrl` reserved; UI uses the icon picker only). | URL web part plan, 2025-12-18 | 2025-12-18 |
| TD-08 | Tech debt | Shelf | Product copy | Refresh The Shelf record from root `Shelf-Details.md` after this docs PR merges (description, value proposition, elevator, features). Classification TW software vs Open source is a product-owner decision. | Shelf harvest; Mike Homol | 2026-11-17 |

## Later

| ID | Type | Area | Driver | Item | Source | Date |
| --- | --- | --- | --- | --- | --- | --- |
| TD-05 | Tech debt | Git | Housekeeping | Delete or archive leftover remotes `origin/feature/open-source-release` and `origin/feature/spfx-1.23-migration` (PRs #4 and #5 merged). | GitHub branches, 2026-11-17 | 2026-11-17 |
| TD-06 | Tech debt | Git | Product line | Decide the future of `cfpb-specific` (keep, archive, or delete). It has hard-coded field names and is not on `main`. Do not merge it. Do not name the client in product docs. | Harvest; Mike Homol D19 | 2026-11-17 |
| TD-07 | Tech debt | Process | Standards sync | Add this repo to the Monday standards sync (Shelf product, not a CSM repo, so it is not in that check today). | Mike Homol, cloud-prep | 2026-11-17 |
| UX-01 | UX | URL Page Properties | Operators | Recurring: URL web part missing on sites that installed the app before v1.0.5. Already documented in `docs/DEPLOYMENT_VALIDATION.md`. | 2026-07-06 tenant test | 2026-07-06 |
| FEAT-03 | Feature | Advanced Page Properties | Capsules | Optional non-linking capsules (deferred; capsule is linked, text is not). Revisit only if editors ask. | Chat 2025-12-16 12:59 PM EST | 2025-12-16 |

## Proposed

None beyond the items already placed on a horizon. No open product bugs were named after the 2026-07-06 in-place upgrade tests (reported as passing).

## Parked

| ID | Type | Area | Driver | Item | Source | Date |
| --- | --- | --- | --- | --- | --- | --- |
| FEAT-04 | Feature | URL / embed | Scope | A third, embed-only web part. Rejected in favor of option A (embed mode on URL Page Properties). | D07, 2026-03-04 | 2026-03-04 |
| FEAT-05 | Feature | Advanced Page Properties | Capsules | Boolean fields in capsule mode. Deliberately text-only (D05). | D05 | 2026-01-08 |
| FEAT-06 | Feature | Advanced Page Properties | Capsules | Note fields in capsule mode. Deliberately text-only (D04). | D04 | 2025-12-16 |
