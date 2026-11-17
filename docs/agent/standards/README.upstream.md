## threewill-engineering-standards

This repository is the canonical source of ThreeWill engineering standards for reusable products (starting with SPFx solutions).

### What lives here

- **Cursor rules (`*.mdc`)**: keep rule files at the **root of this repository**. Product repos mount this repo as `<product>/.cursor/rules/`, and Cursor loads `*.mdc` from that folder. Do **not** add new rules only under `.cursor/rules/` inside this repo (nested path is easy to miss and may not load in the IDE). Current always-on / shared rules include plan mode first (`plan-mode-first.mdc` → [docs/plan-mode-first.md](docs/plan-mode-first.md)), CI minutes budget (`ci-minutes-budget.mdc` → [docs/ci-minutes-budget.md](docs/ci-minutes-budget.md)), team non-negotiables (`team-non-negotiables.mdc` → [docs/team-non-negotiables.md](docs/team-non-negotiables.md)), UI (`spfx-threewill-ui.mdc`), demo data (`spfx-demo-data.mdc`), provisioning (`spfx-provisioning.mdc`), MCP routing (`mcp-*.mdc`, including Microsoft Learn grounding via `mcp-microsoft-learn.mdc`), image workflow (`generated-image-preview.mdc`, `replicate-image-handling.mdc`), and optional Link bridge (`link-memory-bridge.mdc`).
- `docs/`: canonical prerequisites, [style guide](docs/style-guide.md), [plan mode first](docs/plan-mode-first.md), [CI minutes budget](docs/ci-minutes-budget.md), [team non-negotiables](docs/team-non-negotiables.md), and guidance text
- `templates/`: copyable snippets and templates (README blocks, PR templates, CI snippets, `spfx-asset-modules.d.ts` for image imports)
- `tools/`: bootstrap scripts to wire standards into product repos
- `docs/mcp/`: MCP onboarding and domain catalogs (Dataverse, Work IQ, Microsoft Learn)

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

If a repo uses MCP tools (Work IQ, Dataverse, etc.), add a repo-root `AGENTS.md` section that links to the relevant shared docs inside the standards submodule checkout (e.g. `.cursor/rules/docs/mcp/dataverse-managed-services.md`). Template: [`templates/AGENTS.mcp-managed-services.snippet.md`](templates/AGENTS.mcp-managed-services.snippet.md)

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

**Automation:** run `tools/init-product-repo.ps1` with **`-BackupExistingRules`** to rename a non-empty `.cursor/rules` to a timestamped `.cursor/rules.pre-threewill-backup-*` and then add the submodule (see script help).

### Cursor note (rules paths)

Cursor project rules are intended to live under **`.cursor/rules/`**. Because that path is the standards submodule here, **`.mdc` files that belong only to one product** should not be dropped next to the submodule checkout. Use **`AGENTS.md`** at the repo root for product-specific instructions unless you adopt a different layout (for example moving the submodule to another path—then document that team-wide).

### Getting started (local development)

Use `tools/init-product-repo.ps1` to initialize standards in a product repo (submodule + README block). Use **`-BackupExistingRules`** if `.cursor/rules` already exists and is not yet the submodule.
