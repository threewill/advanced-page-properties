# Development Team Non-Negotiables

Living taxonomy of defaults we expect AI agents and humans to uphold across solutions.

**How to read this doc**

- Must-haves are **default expectations with documented exceptions**.
- If a solution cannot satisfy a must-have, record why and the alternate safeguard.
- Prefer enforcing via Cursor rules, skills, checklists, and automation (see [Enforcement map](#enforcement-map)).

---

## Must-Haves For All Solutions

Standards that apply regardless of stack, client, or solution type.

### Ownership and purpose

- Solution has a clear purpose, owner, and operating context (who runs it, who supports it).
- README (or equivalent) states what the solution does, how to run it locally, and how to deploy or promote it.

### Security by default

- Secrets never committed; use environment config, Key Vault, or equivalent.
- Identity and authorization are explicit for every protected surface.
- Inputs are validated; outputs do not leak sensitive data in errors or logs.
- Least privilege for app identities, service principals, and API permissions.

### Observability: errors and usage

- Track both **errors** and **usage/telemetry**.
- **Azure Application Insights** is the default platform when the stack and hosting model support it.
- Document the alternate telemetry approach when App Insights is not appropriate.
- Logs include enough context to diagnose issues without exposing secrets or PII.

### Error handling

- No swallowed exceptions.
- Predictable error boundaries at process/API/UI edges.
- User-facing messages are safe and actionable; diagnostics go to logs/telemetry.
- Failures are correlated (operation id / correlation id) where the stack allows.

### Testability

- Unit tests are the default for application logic.
- Document an exception when tooling cost or maturity makes unit tests impractical (for example some SPFx surfaces), and name the alternate verification (integration tests, manual test plan, smoke checklist).
- Tests are runnable in CI when CI exists for the solution.

### Documentation freshness

- Update docs when features, capabilities, setup, deployment, or operational behavior change.
- Keep a current list of features/capabilities (README section, FEATURES.md, or product docs).
- Agents and developers treat “docs out of date after a behavior change” as incomplete work.

### Deployment readiness

- Repeatable local setup and environment separation (dev / test / prod or equivalent).
- Configuration is explicit and not hardcoded for a single environment.
- **Automatic versioning on builds** so releases are traceable without manual version edits.
- Rollback or recovery approach is known (even if simple: redeploy previous artifact).

### AI-assisted delivery hygiene

- Inspect existing patterns before inventing new ones.
- Do not overwrite unrelated user work.
- Verify changes (build, tests, lint, or smoke) before claiming done.
- Surface uncertainty instead of guessing on security, data, or production impact.

---

## Must-Haves By Solution Type

### Enterprise / client-delivered solutions

- **CI/CD in-repo from day one**: pipeline definitions live in the repository (YAML or equivalent), not only portal-configured or ad hoc scripts.
- Pipeline covers build, tests where applicable, and a defined path to deploy or promote across environments.
- Secrets for pipelines use the platform secret store (variable groups, GitHub Actions secrets, etc.), never files in git.
- Branch protection / PR checks aligned with the pipeline when the hosting platform supports them.

### SPFx

- Use the `threewill-engineering-standards` submodule at `.cursor/rules/` where applicable.
- Prefer shared reusable components and the established look-and-feel (see style guide and `spfx-threewill-ui` rule).
- Follow provisioning and demo-data patterns from engineering standards when those apply.
- Unit testing: apply the all-solution default where practical; otherwise document the exception and alternate verification.
- Package versioning should be automatic or CI-driven, not hand-edited per release without a defined scheme.

### Web apps and APIs

- AuthN/AuthZ on every non-public endpoint.
- Health/readiness endpoint or equivalent for hosted services.
- Structured logging + App Insights (or documented alternate).
- Automated tests for critical domain logic and API contracts as risk warrants.

### AI agents and automations

- Tool/MCP usage is scoped and documented; no unbounded privileged actions without human gates for destructive work.
- Observability for runs: success/failure, latency, and meaningful error taxonomy.
- Prompts, model choice, and evaluation notes are versioned or documented enough to reproduce behavior.
- Secrets and tenant credentials never embedded in prompts or committed artifacts.

### Microsoft 365 / Power Platform

- Environment strategy documented (dev/test/prod or ALM equivalent).
- Solution packaging / ALM path defined for anything beyond a one-off prototype.
- Connection references and secrets handled via environment variables or approved secret stores.
- Telemetry and error surfacing planned (App Insights, Dataverse logging, or documented alternate).

### Cloudflare Workers / edge

- Secrets via Wrangler/secrets store, never in source.
- Observability via Workers analytics/logs or App Insights bridge where used; document the choice.
- Deploy path scripted or CI-defined for anything beyond a personal experiment.

---

## Nice-To-Haves / Always Consider

Practices AI should routinely raise or evaluate. Do not block progress unless project context makes them mandatory.

| Item | Why consider it |
| --- | --- |
| Dependency update cadence | Reduces security and break risk |
| Accessibility baseline (WCAG-oriented) | Especially UI and SPFx |
| Performance budgets / Core Web Vitals | User-facing web |
| Feature flags / progressive rollout | Higher-risk enterprise releases |
| Runbooks / on-call notes | Supportability after handoff |
| Architecture decision records (ADRs) | Non-obvious tradeoffs |
| Contract tests / API specs | Multi-team or multi-service |
| Chaos or failure-injection for critical paths | High availability targets |
| Cost and quota monitoring | Cloud and AI usage |
| Localization readiness | Multi-region or multi-language clients |
| Data retention and privacy review | Anything storing personal or client data |
| SBOM or dependency inventory | Enterprise security questionnaires |

---

## Exception protocol

When skipping a must-have:

1. Name the must-have.
2. State why it does not apply or cannot be met yet.
3. Name the alternate safeguard or verification.
4. Record it in README, AGENTS.md, or a short `EXCEPTIONS.md` in the repo.
5. Revisit when the solution type, risk, or audience changes.

---

## Enforcement map

How AI and tooling should help keep each area in place.

| Area | Primary enforcement | Suggested artifact |
| --- | --- | --- |
| App Insights / telemetry defaults | Rule + checklist | Cursor rule: default App Insights; review skill: observability readiness |
| Error handling | Rule (file-scoped) + review skill | Patterns for catch/log/rethrow; no empty catches |
| Unit testing default + exceptions | Rule + checklist | “Tests or documented exception” gate in PR/review skill |
| Documentation freshness | Rule + checklist | “Update docs with behavior change” always-apply nudge |
| Automatic versioning | Automation + checklist | CI versioning template; new-repo skill |
| Enterprise CI/CD in-repo | Skill + automation + checklist | `init-product-repo` / scaffold skill; YAML templates under `templates/` |
| SPFx + engineering standards | Existing rules + submodule | `spfx-threewill-ui`, provisioning, demo-data; submodule required |
| Security by default | Review skill + checklist | Security review skill; secret scanning in CI |
| AI delivery hygiene | Always-apply rules | Existing agent rules; verify-before-done checklist |
| Nice-to-haves | Checklist only | “Always consider” section in review skill |

### Candidate Cursor rules (backlog)

1. `team-non-negotiables.mdc` — always-apply pointer to this doc; require exception notes when skipping must-haves.
2. `telemetry-app-insights.mdc` — default App Insights for error + usage when stack supports it.
3. `docs-freshness.mdc` — update docs/features when behavior changes.
4. `error-handling.mdc` — glob-scoped language patterns as needed.
5. `enterprise-cicd.mdc` — in-repo pipelines required for enterprise/client-delivered repos.

### Candidate skills (backlog)

1. `solution-readiness-review` — walk must-haves + type-specific + always-consider; output gaps and exceptions.
2. `new-enterprise-repo` — scaffold README, CI YAML, versioning, App Insights wiring checklist.
3. `spfx-standards-check` — verify submodule, UI patterns, provisioning/demo-data alignment.
4. `observability-setup` — App Insights (or alternate) for errors and usage.

### Automation candidates

- CI: build + test + lint on PR.
- CI: fail if version is still placeholder / not produced by pipeline.
- Secret scanning on push/PR.
- Optional: docstring or README section linter for “Features” / “Telemetry” / “Pipeline” headings on enterprise repos.

---

## Solution-type index (first set)

Active sections in this taxonomy:

1. All solutions (baseline)
2. Enterprise / client-delivered
3. SPFx
4. Web apps and APIs
5. AI agents and automations
6. Microsoft 365 / Power Platform
7. Cloudflare Workers / edge

Add a new type section when two or more projects share a recurring must-have that does not belong in the all-solution baseline.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-07-18 | Initial living taxonomy from team non-negotiables planning conversation. |
