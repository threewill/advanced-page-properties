# Deployment validation checklist

Use this checklist after uploading `sharepoint/solution/advanced-page-properties.sppkg` to your tenant App Catalog (upgrade existing package — same solution GUID).

## Prerequisites

- Node.js **22.14+** (see `.nvmrc`)
- Production build: `npm run build`
- Package output: `sharepoint/solution/advanced-page-properties.sppkg`

## In-place upgrade tests

Test on a **Site Page that already had v1.0.5.x web parts configured**:

| Test | Expected |
|------|----------|
| Web part renders without re-adding | Existing instance loads new bundle |
| Property pane configs preserved | `propertyConfigurations` / `urlProperties` intact |
| Legacy `selectedProperties` migration | Capsule fields still display |
| Taxonomy single-select | Term labels resolve correctly |
| Taxonomy multi-select | All terms display |
| Thumbnail field | Image renders |
| URL field | Link / description correct |
| Boolean field | Yes/No / True/False / checkmark formats |
| Capsule search links | `capsuleLinkUrl` and query-string field behavior |
| URL web part iframe mode | `embedHeight`, `hideEmbedChrome` |
| Theme variants | Light/dark section themes |
| Edit vs read mode | Property pane opens; values refresh |

## Troubleshooting: URL Page Properties missing from web part picker

The solution ships **two separate Web-scoped features** (one per web part). If a site installed the app **before v1.0.5** (when URL Page Properties was added), or the site app was never upgraded after a catalog upload, only **Advanced Page Properties** may be active.

### Quick fixes (try in order)

1. **Search correctly** — In the web part picker, search `URL Page Properties` or browse the **Other** category (both web parts use that group).

2. **Reinstall the app on the site**
   - Site contents → **Advanced Page Properties** → **Remove** (existing page instances keep working until removed)
   - **Add an app** → add **Advanced Page Properties** again from the catalog

3. **Enable the URL feature manually** (PnP PowerShell):

```powershell
Connect-PnPOnline -Url "https://{tenant}.sharepoint.com/sites/{site}" -Interactive
Enable-PnPFeature -Identity "a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c" -Scope Web
```

4. **Verify the web part is registered on the site**

```powershell
Get-PnPAvailableClientSideComponents -PageComponentType WebPart |
  Where-Object { $_.Name -like "*URL Page*" }
```

Or open: `https://{site}/_api/web/GetClientSideWebParts` and search for `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c`.

### Catalog deployment reminder

After uploading a new `.sppkg`, confirm in the tenant App Catalog that the package shows version **1.1.0.0** and is **Deployed**. Tenant-wide deployment ("Enable this app and add it to all sites") makes web parts visible without per-site install; per-site installs require the reinstall or feature activation steps above when new features are added.

## Preserved identifiers (do not change between releases)

- Solution: `daae06a2-8599-445c-93c0-3bd739305f56`
- Advanced Page Properties: `bdbcb04e-9c90-4adb-b0f0-d025e4eb6cb5`
- URL Page Properties: `a7f3c8d2-4e5b-4a9f-8c1d-3e6b9a2f4d7c`
