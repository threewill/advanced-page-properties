# Advanced Page Properties: context harvest

Harvested Tue 2026-11-17 (ET) from local Cursor history and GitHub `threewill/advanced-page-properties` (`main` @ `5a0fe01`). Claims below were re-checked against the code on 2026-11-17 while writing the cloud-prep docs. Dates are America/New_York.

This is an **existing** Shelf product. After this docs work merges, [`Shelf-Details.md`](../../Shelf-Details.md) is the source of truth for refreshing The Shelf record. Do not name customers in this file.

## 1. Purpose and users

Advanced Page Properties is a MIT-licensed SharePoint Framework solution by ThreeWill. It ships two client-side web parts that display metadata from the SharePoint page the web part is placed on:

- **Advanced Page Properties** — a theme-aware replacement for the out-of-the-box Page Properties web part, with capsule or text display, configurable search links, and broader field-type support (taxonomy, hyperlink, image, currency, dates, multi-choice, Note, Boolean, and others). Fields with `TypeAsString === "User"` are excluded from selection. `UserMulti` is **not** explicitly excluded.
- **URL Page Properties** — a second web part, first committed 2025-12-18, that maps only URL fields and shows them as Quick Links-style tiles or, as of v1.0.5.3 (2026-05-24; designed in chats 2026-03-04), as embedded iframes (for example a document library folder).

Authors and intranet editors use it on modern Site Pages after the `.sppkg` is deployed to a tenant App Catalog and the app is added to the site. It is a generic, reusable product, not a single-client custom app. The current version is **1.1.0.0** (2026-07-06): SPFx 1.23.2 with the Heft toolchain, PnPjs v4, and Node 22.

Sources: README on `main`; code under `src/`; "Solution review and explanation" 2025-12-16; "SPFx Upgrade and OSS" plan and chat 2026-07-05–06.

## 2. Architecture and stack

- **Platform:** SharePoint Online, SPFx 1.23.2, Heft (`@rushstack/heft` 1.2.17, `@microsoft/spfx-web-build-rig` 1.23.2), TypeScript ~5.8, React 17.0.1, Fluent UI 8 (`@fluentui/react` 8.106.4). Node `>=18.17.1 <19 || >=22.14.0 <23` (`.nvmrc` is `22`). `.npmrc` sets `legacy-peer-deps=true`.
- **Data access:** PnPjs v4 (`@pnp/sp` 4.20.0) through a shared `getSP(context)` helper in `src/common/pnpjsConfig.ts` (`spfi().using(SPFx(context))`). Page list id and list item id come from `context.pageContext.list` / `listItem` (`src/common/pageContextHelpers.ts`). **Correction:** if list id is missing, Advanced Page Properties field-info fetch still falls back to `lists.getByTitle("Site Pages")` in `AdvancedPageProperties.tsx`. Taxonomy term labels use a REST helper in `src/common/taxonomyHelpers.ts` (`_api/v2.1/termStore/terms/{guid}`) rather than `@pnp/sp-taxonomy`.
- **Web parts:** two separate bundles in `config/config.json`, two Web-scoped features (documented in `docs/DEPLOYMENT_VALIDATION.md`; `config/package-solution.json` does not enumerate a `features` array — SPFx emits them from the web part manifests). GUIDs that must not change:
  - Solution: `daae06a2-8599-445c-93c0-3bd739305f56`
  - Advanced Page Properties: `bdbcb04e-9c90-4adb-b0f0-d025e4eb6cb5`
  - URL Page Properties: `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c`
- **Property schemas:** `propertyConfigurations` (with a migration from legacy `selectedProperties`) on the original web part; `urlProperties` on the URL web part. Display-mode, text-style, Boolean format, hide-label, tile size, embed height, and hide-chrome flags live on those configs. `customImageUrl` exists on `UrlPropertyConfiguration` but is **not read** by the renderer (icon picker only).
- **Packaging:** `npm run build` runs `heft test --clean --production` then `heft package-solution --production`, producing `sharepoint/solution/advanced-page-properties.sppkg` (gitignored). Local serve uses `heft start --clean` and `config/serve.json` pointed at `https://localhost:5432/workbench`.
- **Property pane:** `@pnp/spfx-property-controls` 3.23.0 (icon picker for tiles).

Sources: `package.json`, `config/*`, `src/common/*`, web part classes.

## 3. Key decisions

See [`docs/decisions/DECISION-LOG.md`](../decisions/DECISION-LOG.md) for the canonical table (D01–D23). Summary:

- Separate URL web part, not a display mode on the original part (D01).
- SharePoint icon picker, five tile sizes, custom images deferred (D02).
- Display-name fallback: pane name → URL Description → filename → field name (D03). Verified in `getDisplayName`.
- Note and Boolean are Text mode only (D04, D05).
- Capsule display includes a **search** link for most field types; text display does not (D06). **Correction:** URL fields in capsule mode link to the field URL itself, not the search page. Thumbnail/image is not a search capsule.
- Embed in the existing URL web part (option A), not a third web part (D07); optional minimal chrome (D08).
- SPFx 1.23 + Heft + PnPjs v4 + Node 22, then public MIT (D09, D13).
- Page list from `pageContext.list` (D10), with the Site Pages title fallback noted above.
- REST taxonomy lookup (D11); preserve GUIDs (D12); two Web-scoped features (D14); `legacy-peer-deps` for CI (D15).
- Cloud-prep decisions 2026-11-17: keep product name; elevator pitch as written; do not change `ci.yml`; leave `cfpb-specific` alone; horizons in the roadmap (D16–D23).

## 4. Conventions

- Branch from `main`. Keep solution and web part GUIDs unless intentionally creating a new App Catalog identity.
- `npm install` / `npm ci` use `legacy-peer-deps` via `.npmrc`. Production package is `npm run build`.
- On the product owner's Windows laptop, `nvm` version changes require an admin shell; agents should hand those steps back rather than running them.
- Work on a feature branch for substantive upgrades.
- Same-PR docs habit: update `docs/FEATURES.md`, architecture notes, and regression cases in the same PR, or write `No … impact: <reason>` (see `.github/PULL_REQUEST_TEMPLATE.md`).
- Do not commit tenant workbench URLs. Tracked `config/serve.json` is localhost. Azure Storage account and access key stay as placeholders.
- Localization strings live in each web part's `loc/en-us.js` and `mystrings.d.ts`.
- **`main` is the generic product.** Do not merge from `cfpb-specific`.

## 5. Known pitfalls and fixes

- **URL Page Properties missing from the picker after an upgrade.** Cause: two Web-scoped features; older site installs never activated the URL feature. Fix: search "Other", reinstall the site app, or `Enable-PnPFeature` for GUID `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c`. Documented in `docs/DEPLOYMENT_VALIDATION.md`.
- **Iframe embeds can be blocked** by `X-Frame-Options` or CSP on the target URL. README warns to test embed URLs before relying on them.
- **Single-select taxonomy labels** need the custom REST lookup (known SharePoint API limitation; README "Special Features").
- **`npm ci` without `legacy-peer-deps`** failed CI on the first SPFx 1.23 PR (2026-07-06).
- **Heft `npm run build` includes `heft test`**, but there are no tracked tests; the "test" step is effectively the production compile.
- **Do not change GUIDs** between releases, or in-place App Catalog upgrades break.
- **Hide label** clears left **margin** (`.propValsRowNoLabel { margin-left: 0 }`). It does not change padding.
- A Dec 2025 TypeScript error in the URL web part (`TS1109` / `TS1005`) appeared on the old Gulp/SPFx 1.11 toolchain. The 1.23 / TypeScript 5.8 toolchain supersedes that environment.

## 6. Open issues

- No open GitHub issues or PRs as of the harvest.
- CI does not meet the Nov 2026 minutes-budget standard (`TD-01`). Do not change `.github/workflows/ci.yml` unless asked.
- No automated tests (`TD-02`). A manual regression playbook was added in cloud-prep.
- Public-release leftovers that are **repo settings / artifacts**, not docs: GitHub description and topics still empty; `v1.1.0.0` release has no `.sppkg` asset (`TD-03`). Stale SECURITY / CONTRIBUTING / README 1.0.5 date text is fixed in the cloud-prep PR.
- Merged feature remotes `feature/open-source-release` and `feature/spfx-1.23-migration` are still on origin (`TD-05`).
- `cfpb-specific` holds client-hardcoded field logic that is not on `main` (`TD-06`). Do not merge from it. Decide later whether to keep, archive, or delete.
- User fields remain excluded (`FEAT-01`). Custom tile images were deferred (`FEAT-02`). Optional non-linking capsules were deferred (`FEAT-03`).
- No product chats after 2026-07-06; later backlog lives with the product owner.

## 7. Environments and deployment (secret names only)

See [`docs/ops/ENVIRONMENTS.md`](../ops/ENVIRONMENTS.md).

- **Local:** Node 22 (or 18.17.x), `npm start` → Heft workbench. `config/serve.json` `pageUrl` / `initialPage` are `https://localhost:5432/workbench`. Port 4321 for the SPFx serve process.
- **Build artifact:** `sharepoint/solution/advanced-page-properties.sppkg` (gitignored). Upload to the tenant App Catalog, deploy, then add or upgrade the app on the site. Tenant-wide deployment makes both web parts available without a per-site install, but older per-site installs still need the reinstall/feature steps in `docs/DEPLOYMENT_VALIDATION.md`.
- **Optional Azure CDN / blob deploy placeholders** in `config/deploy-azure-storage.json`: secret *names* only — `account`, `accessKey`. Values are HTML comments, not credentials.
- **GitHub Actions:** `GITHUB_TOKEN` (implicit). No other repo secrets observed.
- **Version support:** SECURITY.md supports 1.1.x only.

No secret values were found in tracked files on `main`.

## 8. Glossary

- **Capsule** — pill/chip display of a property value. For most types this is linked to a search page (`capsuleLinkUrl`, default `/_layouts/15/search.aspx/siteall`) with a configurable query-string field. URL capsules link to the URL value instead.
- **TypeAsString** — SharePoint field type string used to include/exclude fields and pick renderers (`Boolean`, `Note`, `URL`, `TaxonomyFieldType`, etc.).
- **propertyConfigurations / selectedProperties** — current vs legacy property-pane schema on Advanced Page Properties; upgrades must keep the migration.
- **urlProperties** — URL web part's per-field config (field, display name, icon, tile vs embed).
- **SPFI** — PnPjs v4 fluent interface, initialized with `SPFx(context)`.
- **Heft** — SPFx 1.18+ build toolchain that replaced Gulp in this repo at v1.1.0.0.
- **App Catalog / `.sppkg`** — tenant (or site) catalog package used to deploy the two web parts.
- **Web-scoped feature** — each web part is a separate feature; activating the app on a site does not always enable later-added features.

## 9. Shelf (existing record)

The Shelf item is Generally Available, Active, Tier 2, platform SharePoint, SME the product owner. Last modified **2026-07-02**, before the 2026-07-06 v1.1.0.0 release. Description is one short sentence; features field is empty; classification is still "TW software" despite the public MIT repo. GitHub link is correct. Refresh the record **after** this docs PR merges, from [`Shelf-Details.md`](../../Shelf-Details.md). Classification (TW software vs Open source) is a product-owner decision.

## 10. Corrections vs the 2026-11-17 draft

Applied in this harvest (also listed in the cloud-prep PR body):

1. URL Page Properties embed shipped as **v1.0.5.3 on 2026-05-24**, not as a March/May version number. Design chat was 2026-03-04.
2. Capsule **search** links are not used for URL or Thumbnail renderers.
3. User exclusion is only `TypeAsString !== "User"`; `UserMulti` is not filtered.
4. Hide-label removes left **margin**, not padding.
5. `customImageUrl` is reserved on the model and unused in UI.
6. Field-info fetch still has a `"Site Pages"` title fallback when list id is missing.
7. `package-solution.json` does not list features; two Web-scoped features are still the documented runtime behavior.
8. README 1.0.5 date was blank; git shows Boolean completing that line on **2026-01-08** (URL web part 2025-12-18, Note and display modes 2025-12-16).
9. SECURITY.md "once the repository is public" and CONTRIBUTING/README tenant-`serve.json` instructions were stale; cloud-prep fixes the docs. GitHub description/topics and the missing release `.sppkg` remain backlog (`TD-03`).
