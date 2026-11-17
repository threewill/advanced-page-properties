> **This public product vendors a subset.** File is the upstream README from `5baefff`. Omitted internal catalogs and scripts are listed in [`README.md`](README.md). Do not follow links below that are not in this folder.

## threewill-engineering-standards

This repository is the canonical source of ThreeWill engineering standards for reusable products (starting with SPFx solutions).

### What lives here

- **Cursor rules (`*.mdc`)**: keep rule files at the **root of this repository**. Product repos mount this repo as `<product>/.cursor/rules/`, and Cursor loads `*.mdc` from that folder. Do **not** add new rules only under `.cursor/rules/` inside this repo (nested path is easy to miss and may not load in the IDE). This public subset keeps plan mode first (`plan-mode-first.mdc` → [docs/plan-mode-first.md](docs/plan-mode-first.md)), CI minutes budget (`ci-minutes-budget.mdc` → [docs/ci-minutes-budget.md](docs/ci-minutes-budget.md)), team non-negotiables (`team-non-negotiables.mdc` → [docs/team-non-negotiables.md](docs/team-non-negotiables.md)), UI (`spfx-threewill-ui.mdc`), demo data (`spfx-demo-data.mdc`), provisioning (`spfx-provisioning.mdc`), Microsoft Learn grounding (`mcp-microsoft-learn.mdc`), and generated-image preview (`generated-image-preview.mdc`).
- `docs/`: canonical prerequisites, [style guide](docs/style-guide.md), [plan mode first](docs/plan-mode-first.md), [CI minutes budget](docs/ci-minutes-budget.md), [team non-negotiables](docs/team-non-negotiables.md), and guidance text
- `templates/`: copyable snippets and templates (README blocks, `spfx-asset-modules.d.ts` for image imports)
- `docs/mcp/`: Microsoft Learn onboarding in this subset ([microsoft-learn.md](docs/mcp/microsoft-learn.md))

### Recommended adoption (SPFx)

For each SPFx product repository, add this repo as a git submodule at:

- `<product-repo>/.cursor/rules/`

That makes Cursor rules available automatically whenever the product repo is opened in Cursor.

#### Example: add/update the submodule

From inside a product repo:

```bash
git submodule add https://github.com/threewill/threewill-engineering-standards.git .cursor/rules
git submodule update --init --recursive
```

To update later (after the product repo points at a newer standards commit):

```bash
git submodule update --init --recursive
```

### Product-specific rules (where to put them)

The submodule is mounted at **`.cursor/rules/`**, which is the **entire** `threewill-engineering-standards` checkout. You **cannot** add normal product-repo files inside that path and commit them to the **product** repo—Git treats that directory as the submodule. Product-only guidance should **not** be edited inside the submodule unless it belongs in engineering standards for **all** products.

**Team convention:** keep product-only context in **`AGENTS.md` at the product repository root** (same level as `README.md`). Cursor loads `AGENTS.md` as project context. Start from [`templates/AGENTS.product.snippet.md`](templates/AGENTS.product.snippet.md) if you want a short template.

Optional: add more detail under `docs/` and link to it from `AGENTS.md`.

### MCP guidance (opt-in per repo)

For **Microsoft product and platform** questions, the shared rule **`mcp-microsoft-learn.mdc`** requires agents to use the **Microsoft Learn MCP when it is configured** and to merge those results with other guidance. Engineering standards **recommend** enabling that MCP locally or in cloud agents; they do **not** install or enforce MCP configuration from the git repo (see [`docs/mcp/microsoft-learn.md`](docs/mcp/microsoft-learn.md)). Optional `AGENTS.md` snippet: [`templates/AGENTS.microsoft-learn.snippet.md`](templates/AGENTS.microsoft-learn.snippet.md).

### Troubleshooting: `.cursor/rules` already exists

If `git submodule add … .cursor/rules` fails with:

`fatal: '.cursor/rules' already exists and is not a valid git repo`

then Cursor or your team already created **`.cursor/rules`** as a normal folder (local `.mdc` files). Git requires that path to be missing or empty before `submodule add`.

**Fix:**

1. Inspect what is in `.cursor/rules` (anything to keep).
2. Rename the folder (backup), then add the submodule:

```powershell
Rename-Item -Path .cursor/rules -NewName rules.pre-threewill-backup
```

```bash
git submodule add https://github.com/threewill/threewill-engineering-standards.git .cursor/rules
git submodule update --init --recursive
```

- Merge any valuable **local** rules into root **`AGENTS.md`** (or open a PR to **threewill-engineering-standards** if the rule should be global).
- Remove or archive `.cursor/rules.pre-threewill-backup` when you are done.

If `.cursor/rules` already exists, rename it first (see the PowerShell snippet above), then add the submodule. This public product uses copy-and-sync under `docs/agent/standards/` instead.

### Cursor note (rules paths)

Cursor project rules are intended to live under **`.cursor/rules/`**. Because that path is the standards submodule here, **`.mdc` files that belong only to one product** should not be dropped next to the submodule checkout. Use **`AGENTS.md`** at the repo root for product-specific instructions unless you adopt a different layout (for example moving the submodule to another path—then document that team-wide).

### Getting started (local development)

Private product repos typically add this standards repo as a submodule at `.cursor/rules/`. This public product copies a curated subset into `docs/agent/standards/` — see [`README.md`](README.md).
