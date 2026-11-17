# MCP (Model Context Protocol) standards

This folder contains **team-shared guidance** for using MCP tools safely and consistently.

## What belongs here

- **How to use tools** (workflow, safety, prompts that work well)
- **Domain catalogs** (golden tables, relationships, definitions, example questions)
- **Onboarding notes** (what to configure locally, what not to commit)

## What does *not* belong here

- Your local `%USERPROFILE%\.cursor\mcp.json`
- OAuth tokens, client secrets, or any credential values

## Index

- **Managed Services Dataverse**: [`dataverse-managed-services.md`](dataverse-managed-services.md)
- **Work IQ (Agent365)**: [`workiq.md`](workiq.md)
- **Ruddr (PSA)**: [`ruddr.md`](ruddr.md)
- **Microsoft Learn (official docs grounding)**: [`microsoft-learn.md`](microsoft-learn.md)

## Adoption (project opt-in)

For repos that should use this guidance, add a root `AGENTS.md` (in the product repo) and link to the relevant doc(s) inside the standards submodule path:

- `.cursor/rules/docs/mcp/dataverse-managed-services.md`
- `.cursor/rules/docs/mcp/workiq.md`
- `.cursor/rules/docs/mcp/microsoft-learn.md` (Microsoft product/platform questions; **recommended** MCP, see doc for rationale)

Start from the template: [`../../templates/AGENTS.mcp-managed-services.snippet.md`](../../templates/AGENTS.mcp-managed-services.snippet.md)

Microsoft Learn–specific optional snippet: [`../../templates/AGENTS.microsoft-learn.snippet.md`](../../templates/AGENTS.microsoft-learn.snippet.md)

