# Roadmap

Publishable Now / Next / Later view. Full IDs, drivers, and parked items: [`BACKLOG.md`](BACKLOG.md). Horizons set 2026-11-17 (ET).

## Now

- Finish **cloud-prep docs** (this work): agent context, decision log, vendored standards, Shelf-Details, features, backlog, PR and regression stubs.
- Keep **TD-01** as a flagged CI minutes-budget gap. Do not change `.github/workflows/ci.yml` until a dedicated PR. Expected billed minutes today: **~2 per run**; a feature-branch push + PR + merge can bill **4–6 minutes** for the same work.
- Remaining **PUBLIC_RELEASE leftovers** that are GitHub settings/artifacts: repository description and topics; optional `.sppkg` on the `v1.1.0.0` release. Stale SECURITY / CONTRIBUTING / README text is fixed in the docs PR.

## Next

- Regression playbook follow-through and **automated tests** (none today; CI compile is not a suite).
- **User field** support (`FEAT-01`).
- **Custom tile images** (`FEAT-02`).
- **Shelf record refresh** from `Shelf-Details.md` after the docs PR merges.

## Later

- Clean up merged remote feature branches (`TD-05`).
- Decide the future of the **client-specific branch** `cfpb-specific` (`TD-06`). Do not merge it into `main`.
- Add this repository to the **Monday standards sync** (`TD-07`).

## Parked (not scheduled)

- Third embed-only web part.
- Boolean or Note capsules.
