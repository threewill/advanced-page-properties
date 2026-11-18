## Summary

<!-- What does this PR change and why? -->

## Test plan

- [ ] `npm ci` and `npm run build` succeed on Node 22 **or** `No build needed: <reason>` (docs-only PRs still trigger today's `ci.yml` — see TD-01)
- [ ] Tested in SharePoint workbench or tenant (describe scenario) **or** `No workbench test: <reason>`

## Same-PR docs (features, architecture, regression)

For each item, check the box **or** include the matching `No … impact:` line in the PR body.

- [ ] Features / capabilities updated (`docs/FEATURES.md`, README, and `Shelf-Details.md` if marketing copy changed)  
  `No feature impact: <reason>`
- [ ] Architecture notes updated (`docs/agent/context-harvest.md`, `docs/decisions/DECISION-LOG.md`, `AGENTS.md` as needed)  
  `No architecture impact: <reason>`
- [ ] Regression playbook / test cases updated (`docs/qa/`)  
  `No regression impact: <reason>`

## Notes

- Preserve solution and web part GUIDs unless intentionally creating a new App Catalog identity.
- Do not commit tenant URLs, secrets, or customer names.
- Do not merge from `cfpb-specific` into `main`.
- Mike Homol reviews and merges; do not merge your own PR.
