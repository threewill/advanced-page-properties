# Advanced Page Properties

## Product Description

Advanced Page Properties is an open-source SharePoint Framework solution that improves how metadata is shown on modern SharePoint pages. It is installed from a `.sppkg` in the tenant App Catalog and runs in the page as one or both of two web parts. Data is read from the current page's fields through the SharePoint REST API (PnPjs), using the page context to find the list and item.

The original Advanced Page Properties web part is a theme-aware alternative to SharePoint's built-in Page Properties part. Editors pick which page fields to show, then choose capsule or text display, text style, whether to hide the label, and — for Boolean fields — Yes/No, True/False, or checkmark formatting. Capsule values can link to a search page with a configurable query string.

The solution also includes URL Page Properties, a companion web part for URL fields only. It presents those links as a Quick Links-style tile grid or as an embedded iframe (for example a document library folder), with configurable tile sizes, icons, embed height, and optional minimal chrome. The current release is version 1.1.0.0 on SharePoint Framework 1.23 and can be upgraded in place over earlier catalog packages that share the same solution ID.

---

## A Value Proposition

SharePoint's out-of-the-box Page Properties web part has limited formatting, weak support for several common field types, and no good way to present URL fields as tiles or inline views. Teams that rely on page metadata therefore fall back to static text, separate Quick Links parts, or custom work.

This product gives editors a single, theme-aware way to surface the page's own metadata — including taxonomy, images, currency, dates, Boolean values, and URLs — with search-friendly capsules or richer tile and embed layouts. The result is pages that look consistent with the site and stay accurate as the underlying properties change, without a tenant-specific rewrite.

---

## An Elevator Pitch

Advanced Page Properties is an open-source SharePoint Framework solution that upgrades the built-in Page Properties experience. It displays modern page metadata with capsule search links and richer field formatting, and it includes a second web part that turns URL fields into Quick Links-style tiles or embedded views. It is theme-aware, MIT-licensed, and can be upgraded in place from earlier versions.

---

## The Key Features

### Advanced Page Properties web part

- Theme-aware metadata display that follows the section's light or dark theme.
- Capsule or text mode per property, with H2, H3, H4, or Body text styles and an option to hide the property label.
- Configurable capsule search links (custom base URL and query-string field).
- Legacy configuration migration from `selectedProperties` so existing instances keep working after an upgrade.

### URL Page Properties web part

- Tile grid for URL fields, similar to Quick Links, with five sizes from Extra Small (64px) to Extra Large (192px).
- SharePoint icon picker for tiles.
- Smart display names: pane override, then URL description, then filename.
- Embedded iframe mode per URL, height 200–1200 px (default 400), optional minimal chrome.

### Field type support

- Taxonomy (single- and multi-select) as clickable capsules, including a REST term-label lookup for single-select fields.
- Hyperlink, thumbnail/image, currency, number, date/time, choice, and text with type-specific formatting.
- Note (multi-line) and Boolean fields in Text mode (Yes/No, True/False, or checkmark for Boolean).
- User fields are not selectable in the property pane.

### Platform and administration

- SharePoint Framework 1.23 (Heft, PnPjs v4, Fluent UI 8, Node 22).
- In-place App Catalog upgrades that preserve solution and web part IDs.
- MIT license and a public GitHub repository.

---

## Platform

SharePoint Online (SharePoint Framework).

## License and availability

Open source, **MIT**. Generally Available. Current package version **1.1.0.0**.

## Links

- Source: https://github.com/threewill/advanced-page-properties
- Showcase: https://threewill.sharepoint.com/sites/threewill-showcase/SitePages/Advanced-Page-Properties.aspx
- Release: https://github.com/threewill/advanced-page-properties/releases/tag/v1.1.0.0
- Deployment validation: https://github.com/threewill/advanced-page-properties/blob/main/docs/DEPLOYMENT_VALIDATION.md
