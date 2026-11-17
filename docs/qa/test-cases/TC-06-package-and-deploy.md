# TC-06 — Package and deploy validation

**Area:** Build / App Catalog  
**Related:** [`docs/DEPLOYMENT_VALIDATION.md`](../../DEPLOYMENT_VALIDATION.md) (authoritative checklist)

## Steps

Follow the deployment validation doc end to end:

1. Node 22.14+ (or 18.17.x). `npm ci` then `npm run build`.
2. Confirm `sharepoint/solution/advanced-page-properties.sppkg` is produced (gitignored).
3. Deploy to the tenant App Catalog; package shows version **1.1.0.0** and **Deployed**.
4. Add or upgrade the app on a site (tenant-wide vs per-site).
5. Run the in-place upgrade table in DEPLOYMENT_VALIDATION.md (taxonomy, thumbnail, URL, Boolean, capsules, iframe, theme, edit vs read).
6. If URL Page Properties is missing, follow the troubleshooting order in that doc (search Other → reinstall site app → enable feature).

## Expected

Every row in the DEPLOYMENT_VALIDATION.md tables matches. Do not commit tenant hostnames in the run log.
