# CI minutes budget

**Decided by:** Mike Homol, Director of Innovation (2026-11-17)  
**Applies to:** every ThreeWill developer and every AI agent (Cursor locally, Cursor cloud agents, Grok Bot bots) working in a repository with GitHub Actions.

Cursor rule: [`ci-minutes-budget.mdc`](../ci-minutes-budget.mdc) (`alwaysApply: true`).

## Why

The ThreeWill GitHub org has a **2,000 minute/month** free Actions tier and a paid cap of **$30/month**. In November 2026 the org used 1,935 of those 2,000 minutes (Human-Services-Scorecard 1,412; empower-patient-tracker 523). Waste came from five workflows on each PR that also re-ran on push to the default branch, Docs checks on every PR and push, and agents pushing many small follow-up commits that each started full CI.

Keep Actions minutes low by default. Any PR that adds or changes a workflow must estimate minutes per run.

## Rules

### Path filters

Docs-only changes must never trigger product builds. Ignore at least `docs/**`, `*.md`, `roadmap/**`, and `knowledge/**` (also use `**/*.md` so nested Markdown is skipped). In a monorepo, a product job runs only when that app, or a shared package it depends on, changed.

### Concurrency

Every workflow sets `concurrency` with a group of the workflow name plus the PR number or ref, and `cancel-in-progress: true`, so a newer push cancels superseded runs.

### Do not double-run PR and push builds

Do not run the same full build on both `pull_request` and `push` to the default branch when the merged code was already built on the PR. Use `push` or tag builds for release artifacts only.

### Skip heavy jobs on draft PRs

Heavy jobs use `if: github.event.pull_request.draft == false`. Include `ready_for_review` in the `pull_request` `types` list (`opened`, `synchronize`, `reopened`, `ready_for_review`) so the heavy work starts when a PR leaves draft.

### Caching and timeouts

Cache dependencies (`actions/setup-node` `cache`, or `actions/cache`) and build outputs where it is safe. Set `timeout-minutes` on every job.

### Combine small checks

Fold labelers, status checks, and docs checks into one lightweight job rather than many workflows. Prefer cheap runners (typically `ubuntu-latest`) and cheap steps.

### Releases

Release jobs run on a tag or `workflow_dispatch`, never on every push.

### Agents and schedules

Batch commits and push once per review round rather than after every small change. Do not re-run CI just to retry; inspect the failure first. Do not add scheduled or cron workflows without Mike's OK.

## Example

```yaml
name: CI

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    paths-ignore:
      - 'docs/**'
      - '*.md'
      - '**/*.md'
      - 'roadmap/**'
      - 'knowledge/**'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  build:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npm test
```

This example is a PR-only product build. Add a separate tag or `workflow_dispatch` workflow for release artifacts.
