# Prerequisites (ThreeWill reusable products)

## Required

- Git installed
- Node.js LTS (match the product repo’s `.nvmrc` / documentation when present)
- Cursor installed

## For SPFx solutions

- Follow Microsoft’s SPFx toolchain compatibility matrix and use the matching Node.js LTS version for the chosen SPFx version.
- **Switch Node yourself** (`nvm`, nvm-windows, `fnm`, Volta, or installer) before scaffold, `npm install`, or build. Do not expect a Cursor agent to run `nvm` successfully; rules treat Node switching as a **developer prerequisite**.
- Ensure you can build SPFx locally (Yeoman/SPFx prerequisites as required by the specific solution).
- If the solution uses build-time env vars (example: `CLIENT_CAMPAIGN`), confirm how to set them for `gulp bundle` / CI.

### Baseline (new SPFx solutions)

- SPFx: use **latest** (today: **1.22.2**)
- Toolchain: **Heft** (SPFx v1.22.0+)
- Node.js (LTS): **v22**
- React: **17.0.1** (`--save-exact`)
- Fluent UI: use `@fluentui/react` (v8) as scaffolded by SPFx

## Standards integration (required for reusable SPFx products)

This repo is intended to be included in each reusable SPFx product repository as a **git submodule** at:

- `.cursor/rules/`

If **`git submodule add` fails** because `.cursor/rules` already exists as a normal folder, **back it up** (rename under `.cursor/`, e.g. to `rules.pre-threewill-backup`), then run `submodule add` again. See [README.md](../README.md#troubleshooting-cursorrules-already-exists).

**Product-only** Cursor guidance (vocabulary, domain rules) lives in the **product** repo’s root **`AGENTS.md`**, not inside the submodule. See [README.md](../README.md#product-specific-rules-where-to-put-them).

After cloning a product repo, run:

- `git submodule update --init --recursive`

If you pull new commits and the standards submodule pointer changed, run:

- `git submodule update --init --recursive`

## Cursor usage

Open the product repo root in Cursor. Rules from the standards submodule at `.cursor/rules/` apply to agents; product-specific context should be in root **`AGENTS.md`** (see README).
