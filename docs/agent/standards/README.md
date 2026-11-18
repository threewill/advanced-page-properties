# ThreeWill engineering standards (public subset)

This folder is a **curated public subset** of [threewill/threewill-engineering-standards](https://github.com/threewill/threewill-engineering-standards), not a git submodule and not a verbatim copy of the private repo.

| Field | Value |
| --- | --- |
| Source | https://github.com/threewill/threewill-engineering-standards |
| Branch | `master` |
| Upstream commit SHA | `5baefffbf49d3d9dae2ae996f2d2be6687f53439` |
| Copy date | 2026-11-17 (America/New_York) |

This product repo is **public**. Only standards that are safe to ship in an open-source tree are vendored here. Refresh with a copy-and-sync PR from the same SHA (or a newer `master`), then re-apply this subset — do not drop internal catalogs back in.

[`README.upstream.md`](README.upstream.md) is the upstream README from that SHA, annotated so it does not point at files omitted from this subset. Prefer **this** file as the source of truth for what is actually in the tree.

This product uses **copy-and-sync**, not a submodule. Cursor loads **thin pointers** from [`.cursor/rules/*.mdc`](../../../.cursor/rules/). Product overrides live in root [`AGENTS.md`](../../../AGENTS.md) and [`docs/agent/`](../). Paths in vendored `*.mdc` files that say `.cursor/rules/` mean **`docs/agent/standards/`**.

## Kept in this subset

Rules (and matching `.cursor/rules` pointers): `plan-mode-first`, `team-non-negotiables`, `ci-minutes-budget`, `mcp-microsoft-learn`, `generated-image-preview`, `spfx-demo-data`, `spfx-provisioning`, `spfx-threewill-ui`.

Docs companions: `docs/plan-mode-first.md`, `docs/team-non-negotiables.md`, `docs/ci-minutes-budget.md`, `docs/mcp/microsoft-learn.md`, `docs/spfx-new-solution.md`, `docs/style-guide.md`, `docs/prerequisites.md`.

Also kept: `patterns/ThreeWillFooter/` (referenced by the kept UI rule and style guide), `templates/` snippets that are not Managed Services–specific, and these README files.

## Left out (and why)

Omitted because they are **internal ThreeWill plumbing** (Managed Services Dataverse catalogs, PSA, Work IQ, Link personal memory, Replicate download paths, bootstrap scripts that assume a private submodule):

- `mcp-dataverse-managed-services`, `mcp-ruddr`, `mcp-workiq`, `link-memory-bridge`, `managed-services-canvas-top-of-mind`, `replicate-image-handling`
- `docs/mcp/dataverse-managed-services.md`, `docs/mcp/ruddr.md`, `docs/mcp/workiq.md`
- `templates/AGENTS.mcp-managed-services.snippet.md`
- `tools/*.ps1` (`init-product-repo`, `new-spfx-solution`, `sync-spfx-patterns`)
