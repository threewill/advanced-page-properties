# ThreeWill engineering standards — developer style guide

This document is for **people** (you and your team). Cursor agents primarily read the **rule files** listed below, which should stay aligned with this guide.

## Where agents get their instructions

| What | Path in this repo | Purpose |
|------|-------------------|---------|
| Plan mode first | [`plan-mode-first.mdc`](../plan-mode-first.mdc) → [docs/plan-mode-first.md](plan-mode-first.md) | Always-on: plan and get approval before coding non-trivial work |
| CI minutes budget | [`ci-minutes-budget.mdc`](../ci-minutes-budget.mdc) → [docs/ci-minutes-budget.md](ci-minutes-budget.md) | Always-on: keep GitHub Actions minutes low |
| SPFx UI + footer + dashboards/tiles | [`spfx-threewill-ui.mdc`](../spfx-threewill-ui.mdc) | Cursor project rules (also under [`.cursor/rules/spfx-threewill-ui.mdc`](../.cursor/rules/spfx-threewill-ui.mdc)) |
| Demo data patterns | [`spfx-demo-data.mdc`](../spfx-demo-data.mdc) | Seed / refresh expectations |
| List / schema provisioning | [`spfx-provisioning.mdc`](../spfx-provisioning.mdc) | PnP templates + deployment automation (also under [`.cursor/rules/spfx-provisioning.mdc`](../.cursor/rules/spfx-provisioning.mdc)) |
| Prerequisites | [`docs/prerequisites.md`](prerequisites.md) | Clone, submodules, SPFx setup |
| New SPFx solution bootstrap | [`docs/spfx-new-solution.md`](spfx-new-solution.md) | How to start a new SPFx repo with standards |
| Product-only Cursor context | Root `AGENTS.md` in each **product** repo | Not in the standards submodule; start from [`templates/AGENTS.product.snippet.md`](../templates/AGENTS.product.snippet.md) |
| Submodule path collision | [README.md](../README.md#troubleshooting-cursorrules-already-exists) | When `.cursor/rules` already exists before `git submodule add` |
| ThreeWill footer (canonical code) | [`patterns/ThreeWillFooter/`](../patterns/ThreeWillFooter/) | Copy the TSX, SCSS, and PNG together into the product |

Product repos mount this repository as a **submodule** at `.cursor/rules/`, so opening the product folder in Cursor loads the same rules. **Product-only** instructions belong in the product repo’s root **`AGENTS.md`** (not inside the submodule). If `submodule add` fails because `.cursor/rules` already exists, see [README.md](../README.md#troubleshooting-cursorrules-already-exists).

## ThreeWill footer logo

The ThreeWill mark is a **bundled static asset** (`ThreeWill-headerLogo-onWhite.png`), not a URL you type into SharePoint. Keep **TSX, SCSS, and PNG co-located** under `src/components/threewill/` and commit all three. Copy them from [`patterns/ThreeWillFooter/`](../patterns/ThreeWillFooter/) and, when needed, add [`templates/spfx-asset-modules.d.ts`](../templates/spfx-asset-modules.d.ts) so `import … from '*.png'` type-checks. Full agent checklist: **ThreeWillFooter logo** in [`spfx-threewill-ui.mdc`](../spfx-threewill-ui.mdc).

## Golden reference: dashboards and tiles

The **canonical dashboard + tile layout** for reusable ThreeWill SPFx work is the **KPI Dashboard** in **DDS-Referrals**:

- React: `DDS-Referrals/src/webparts/kpiDashboard/components/KpiDashboard.tsx`
- Styles: `DDS-Referrals/src/webparts/kpiDashboard/components/KpiDashboard.module.scss`

When building or refactoring a dashboard web part, **match that structure and tokens** unless there is a strong product reason not to. The rule file [`spfx-threewill-ui.mdc`](../spfx-threewill-ui.mdc) summarizes the same expectations in agent-oriented form.

### At a glance (KPI Dashboard)

- **Page shell**: `root` padding; **header row** with title (20px, semibold, `#323130`) and **Refresh** on the right.
- **Tile grid**: CSS grid, **3 columns** / **16px** gap; responsive **2** then **1** column at 900px / 560px.
- **Each tile**: outer **`tileLink`** (real `<a>` when navigable) with **`tileInner`** → **`tileHeader`** (Fluent **`Icon`** in a 32×32 rounded square on `#edebe9`) + **`tileTitle`** → **`metrics`** rows (**label** left, **value** right).
- **Metric typography**: labels `#605e5c` / 13px / semibold; values `#323130` / 18px / bold; **warn** `#b8860b`; **danger** `#a80000`.
- **Optional footnote** under metrics: **`demoHint`** (11px, italic, muted) for definitions or caveats.
- **Progress / summary band**: **`progressWrap`** (card with border, radius 12, light shadow) for things like `ProgressIndicator`, with title + meta row above.
- **Errors**: **`errorBanner`** at bottom (destructive styling), not only inline `MessageBar` (either is acceptable if styled consistently; prefer the KPI banner pattern for dashboard chrome).

## Keeping products in sync

1. Update patterns or rules in **threewill-engineering-standards** and push.
2. In this public product: refresh the curated copy under `docs/agent/standards/` (do not reintroduce omitted internal catalogs).
3. Copy [`patterns/ThreeWillFooter/`](../patterns/ThreeWillFooter/) into the product when adopting the footer.

## Contributing new patterns

When you settle on a repeated UI pattern (new tile type, table density, panel chrome):

1. Implement it once in a **reference web part** (often DDS-Referrals).
2. Add a short section to this file and expand [`spfx-threewill-ui.mdc`](../spfx-threewill-ui.mdc).
3. Optionally add a folder under `patterns/` in the standards repo and document the copy steps.

That keeps **humans**, **Cursor**, and **code** pointed at the same source of truth.
