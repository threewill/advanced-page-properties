# TC-05 — Upgrade in place from an earlier version

**Area:** Packaging / App Catalog  
**Related:** [`docs/DEPLOYMENT_VALIDATION.md`](../../DEPLOYMENT_VALIDATION.md)

## Setup

A Site Page that **already** had v1.0.5.x (or earlier) web parts configured. Same solution GUID.

## Steps

1. Build v1.1.0.0 (`npm run build`).
2. Upload `sharepoint/solution/advanced-page-properties.sppkg` to the App Catalog as an **upgrade** (do not change solution ID).
3. Open the existing page without re-adding web parts.
4. Open both property panes.

## Expected

- Existing instances load the new bundle without re-adding.
- `propertyConfigurations` / `urlProperties` intact.
- Legacy `selectedProperties` instances still show capsules.
- GUIDs unchanged: solution `daae06a2-8599-445c-93c0-3bd739305f56`; web parts `bdbcb04e-9c90-4adb-b0f0-d025e4eb6cb5` and `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c`.
- If the site installed the app **before** URL Page Properties existed, the URL web part may be missing until reinstall or `Enable-PnPFeature` for `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c` (`UX-01`).
