# Ruddr MCP (`ruddr`) — ThreeWill standards

This document defines **team-shared defaults** for using the Ruddr MCP server in Cursor.

## Global default: ThreeWill US only

Unless the user explicitly asks otherwise, interpret **any Ruddr question** as scoped to **ThreeWill US**.

In practice, Ruddr does not always allow server-side filtering by Business Unit on list endpoints. When filtering is not supported by the API, the agent must:

- Fetch the relevant list (projects, invoices, etc.)
- **Filter results client-side** to Business Unit = **ThreeWill US**
- Clearly state when a response is filtered vs unfiltered

## How to identify the ThreeWill US Business Unit

Use the Ruddr API data that includes a `businessUnit` object (commonly on `project`, `invoice`, etc.) and capture the canonical identifier used in your workspace.

If you can’t find a `businessUnit` field on the objects returned by a tool:

- Treat that endpoint as **not filterable** and call out the limitation.
- Ask for a different scoping mechanism (e.g. project tags, naming conventions) only if necessary.

## Safety defaults

- Prefer **read-only** operations.
- If/when write tools are added (Phase 3), require explicit confirmation from the user before calling them.

## Suggested workflow patterns

- **Projects / time**: start with `ruddr_list_projects` filtered by status/name, then drill into project members/tasks/time entries.
- **Planned capacity / RCP**: use **`ruddr_list_allocations`** (`GET /allocations`) with `memberId` and date filters overlapping the timesheet window; pair with **`ruddr_list_time_entries`** for planned vs actual.
- **Holidays**: use `ruddr_list_holidays`, then filter to ThreeWill US if your workspace encodes that via Business Unit or a US-only holiday schedule.
- **CSM weekly draft + Ruddr posting**: follow the repo runbook [`docs/runbooks/ruddr.md`](../../../../docs/runbooks/ruddr.md) for read-only draft packs (Dataverse + M365 + Ruddr), **RCP backdrop (capacity is recorded in Ruddr; Tuesday is review cadence)**, and gated upserts.
- **Cursor activity summaries**: “What did I do in Cursor?” and draft-pack **signal 8** must use transcripts from **all** `%USERPROFILE%\.cursor\projects\*\agent-transcripts\` workspaces, not only the open repo—see runbook **Cursor agent transcripts — all workspaces (aggregation)**.

