# Vendored ThreeWill engineering standards

This folder is a **verbatim copy** of [threewill/threewill-engineering-standards](https://github.com/threewill/threewill-engineering-standards), not a git submodule.

| Field | Value |
| --- | --- |
| Source | https://github.com/threewill/threewill-engineering-standards |
| Branch | `master` |
| Commit SHA | `5baefffbf49d3d9dae2ae996f2d2be6687f53439` |
| Copy date | 2026-11-17 (America/New_York) |

**Do not edit this folder by hand.** Update it only through copy-and-sync PRs that replace the tree from a newer upstream commit.

This product uses **copy-and-sync**, not a submodule. The upstream README (saved as [`README.upstream.md`](README.upstream.md)) describes mounting this repo as a submodule at `.cursor/rules/`. This product does **not** use that layout.

- Cursor loads **thin pointers** from [`.cursor/rules/*.mdc`](../../../.cursor/rules/).
- Product overrides live in root [`AGENTS.md`](../../../AGENTS.md) and [`docs/agent/`](../).
- Paths in vendored `*.mdc` files that say `.cursor/rules/` mean **`docs/agent/standards/`** in this repository.
