# New SPFx solution (ThreeWill baseline)

This is the developer-facing “happy path” for starting a new SPFx solution with ThreeWill standards.

## 1) Create the repo + add standards submodule

From inside your new repo root:

If **`.cursor/rules` does not exist yet**:

```bash
git submodule add https://github.com/threewill/threewill-engineering-standards.git .cursor/rules
git submodule update --init --recursive
```

If **`git submodule add` fails** because `.cursor/rules` already exists (Cursor created it with local rules), **rename it first**, then run the commands above:

```powershell
Rename-Item -Path .cursor/rules -NewName rules.pre-threewill-backup
```

Or use `tools/init-product-repo.ps1` with **`-BackupExistingRules`** from this standards repo.

## 1b) Add product-specific context (`AGENTS.md`)

The submodule at `.cursor/rules/` is **only** for shared ThreeWill standards. Add a root **`AGENTS.md`** in your product repo for domain-specific instructions (inventory, naming, environments, etc.). Copy or adapt [`templates/AGENTS.product.snippet.md`](../templates/AGENTS.product.snippet.md).

## 2) Tell the agent you’re bootstrapping a new SPFx solution

In Cursor, open the repo and say:

> I am starting a new SPFx solution (blank web part, latest SPFx).

The agent should then follow the Bootstrap sequence in:

- `.cursor/rules/spfx-threewill-ui.mdc`

## 2a) Set Node.js yourself before scaffold / npm install

Cursor agents often **cannot** run `nvm use` / `nvm install` reliably (dialogs, PATH, or shell profile issues). **You** should switch Node in **your own** terminal (or IDE terminal that loads nvm) so it matches the SPFx matrix—for SPFx **1.22.x**, use **Node v22**.

After switching, run `node -v` and tell the agent the version (or let it run `node -v` if that works). The agent should **not** drive nvm for you.

## 3) Use the baseline stack

Baseline expectations for new SPFx solutions (see Microsoft compatibility matrix for the authoritative source):

- SPFx: latest (today: 1.22.2)
- Node: v22 (LTS)
- React: 17.0.1 (exact)
- Fluent UI: `@fluentui/react` (v8)

Unless you say otherwise, plan **SharePoint lists and schema** as **PnP Provisioning Engine** templates in source control, applied by **deployment automation**. See `.cursor/rules/spfx-provisioning.mdc`.

## 4) Start with a dashboard? Use the golden reference

If the solution starts with a dashboard web part, match the canonical KPI dashboard:

- `DDS-Referrals/src/webparts/kpiDashboard/components/KpiDashboard.tsx`
- `DDS-Referrals/src/webparts/kpiDashboard/components/KpiDashboard.module.scss`
