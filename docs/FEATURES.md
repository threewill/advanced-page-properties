# Features

Shipped capabilities for Advanced Page Properties **v1.1.0.0**. Keep this file in the same PR as behavior changes (or write `No feature impact: <reason>` on the PR).

For marketing-length copy, see [`Shelf-Details.md`](../Shelf-Details.md) (Key Features section sized for The Shelf field).

## Advanced Page Properties web part

- Theme variants (`supportsThemeVariants`; Fluent semantic colors).
- Per-property **capsule** or **text** display.
- Text styles: H2, H3, H4, Body (text mode).
- Hide label (drops left margin on the values row).
- Configurable capsule search URL (default `/_layouts/15/search.aspx/siteall`) and query-string field (field internal name or custom, default `q`).
- Legacy **`selectedProperties` → `propertyConfigurations`** migration on render.

### Field types

| TypeAsString | Display | Notes |
| --- | --- | --- |
| TaxonomyFieldType / TaxonomyFieldTypeMulti | Capsule (search link) or text | Single-select labels via REST term store |
| URL | Capsule links to the URL value; text shows Description | Not a search capsule |
| Thumbnail | Inline image | |
| Currency | Capsule or text | USD formatting; optional comma grouping from field settings |
| Number | Capsule or text | Percentage / comma options from field settings |
| DateTime | Capsule or text | Standard US, ISO8601, day of week, month spelled out |
| MultiChoice / Choice / text (default) | Capsule or text | |
| Note | Text only | `white-space: pre-wrap` |
| Boolean | Text only | Yes/No, True/False, ✅/❌; normalized from boolean / 1/0 / strings |
| User | Not selectable | Filter is `TypeAsString !== "User"` only |

## URL Page Properties web part

- URL fields only (`TypeAsString === "URL"`).
- **Tile** grid (Quick Links-style) with five sizes: 64 / 96 / 128 (default) / 160 / 192 px.
- Fluent **icon picker** (`@pnp/spfx-property-controls`). `customImageUrl` is reserved, unused.
- Display name: pane override → URL Description → filename → field name.
- **Embed** mode: iframe, height 200–1200 px (default 400), optional minimal chrome (no wrapper, title, or “Open in new tab”).
- Theme variant support on tiles and chrome.
- Empty state when no URL properties are configured.

## Platform

- SPFx 1.23.2, Heft, PnPjs v4, Node 22 (18.17.x also in `engines`).
- Two bundles, two Web-scoped features, stable GUIDs for in-place upgrades.
- MIT license; public GitHub repository.

## Changelog

From the README version table and git history through v1.1.0.0.

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2021-03-30 | Initial Advanced Page Properties web part. |
| 1.0.2 | 2024-08-29 | Configurable capsule search links (PRs #1–#2). |
| 1.0.2.4 | 2024-09-14 | Configurable query-string field for capsule links. |
| 1.0.3 | 2024-09-20 | Single-select taxonomy support. |
| 1.0.5 | 2026-01-08 | Display modes and text styles (2025-12-16); Note fields (2025-12-16); URL Page Properties web part (2025-12-18); Boolean formats (2026-01-08). README previously left this date blank. |
| 1.0.5.3 | 2026-05-24 | URL Page Properties: embedded iframe mode, height, and minimal chrome. |
| 1.1.0.0 | 2026-07-06 | SPFx 1.23 / Heft / PnPjs v4 / Node 22; page list from page context; public MIT release. |
