# Public release checklist

Use this after the open-source prep PR is merged to `main`.

## Pre-flight (done in repo)

- [x] MIT `LICENSE` (ThreeWill copyright)
- [x] `SECURITY.md` for vulnerability reporting
- [x] `CONTRIBUTING.md`
- [x] CI workflow (`.github/workflows/ci.yml`)
- [x] No tenant URLs or secrets in tracked config (verify `config/serve.json` uses localhost)
- [x] `package.json` — `private: false`, repository, homepage, bugs URL

## GitHub repository settings

1. **Make the repository public** (org admin):
   ```bash
   gh repo edit threewill/advanced-page-properties --visibility public
   ```
   Or: GitHub → Settings → Danger Zone → Change visibility.

2. **Description** (suggested):
   > SPFx web parts for enhanced SharePoint page property display — capsules, taxonomy, URL tiles, and iframe embeds.

3. **Topics** (suggested):
   `spfx`, `sharepoint-framework`, `sharepoint-online`, `microsoft-365`, `webpart`, `pnpjs`, `fluent-ui`

4. **Enable Issues** if not already on.

5. **Tag the release** after merge:
   ```bash
   git checkout main && git pull
   git tag -a v1.1.0.0 -m "SPFx 1.23 migration release"
   git push origin v1.1.0.0
   ```
   Optionally create a GitHub Release from the tag with `advanced-page-properties.sppkg` attached (build locally with `npm run build`).

## App Catalog package

The `.sppkg` is gitignored. Consumers build from source or download from GitHub Releases if you publish the package there.

## Post-release

- Announce internally / on ThreeWill channels as appropriate
- Monitor Issues and Dependabot (if enabled)
