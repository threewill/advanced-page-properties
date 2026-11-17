# Managed Services Dataverse (Dataverse MCP)

This guide is for the **Managed Services** Power Platform environment accessed via the MCP server named **`dataverse-managed-services`**.

## Purpose

Provide consistent, shared context so agents:

- Use the right tables and relationships (no guessing)
- Ask for schema when needed (`describe_table` before complex `read_query`)
- Default to **read-first** and avoid writes unless explicitly requested

## Golden tables (high signal)

### `account`

- **Meaning**: ThreeWill clients/customers.
- **Key qualifiers**:
  - `tw_ismanagedservicecustomer`: true means the account is/was managed in the dashboard
  - `tw_managedservicesize`: client type / special conditions (Project-Based, Closed, etc.)
  - `tw_alias`: acronym alias used internally (e.g., Center for Human Development → `CHD`)

### `tw_application`

- **Meaning**: Solutions/products managed for a client (can also represent a general topic).

### `tw_sprint`

- **Meaning**: Managed services work is organized into (usually) **monthly** sprints per client.
- **Practice**: sprints are typically month/year labeled; tied to an `account`.

### `tw_resource`

- **Meaning**: ThreeWill employees/contractors performing managed services work (often “CSMs”).
- **Key qualifier**: only treat rows with `tw_isassignable = true` as assignable resources.

### `tw_customerboard`

- **Meaning**: Primary work items (“Customer Board”).
- **Work item ID**: `tw_workitemid` is a **Dataverse autonumber** (e.g. `DK`, `TW-105251`, and short codes like `V` / `CA`). **Never include it** in `create_record` or `update_record` payloads — not even as `null`/`""`. Model forms may show the column as Required; the table schema does **not** mark it `NOT NULL`, and insert **without** the field is correct so the platform assigns the next number. Use `tw_customerboardid` (GUID) for `update_record`, `tw_resourceagenda.tw_workitem`, and SQL joins. If Work Item appears “manual” in the UI after an agent create, the most likely cause is that a value was sent in the create payload — treat that as a process bug and harden the omit rule.
- **Key fields**:
  - Sprint: `tw_sprint`
  - Application: `tw_application`
  - Assigned resource: `tw_assignedto`
  - Progress: `tw_progress`
  - Classifiers: `tw_category`, `tw_businessimpact`, `tw_severity`, `tw_effort`, `tw_complexity` (if present)
  - Value: `tw_valuerealtime` (function column returning \$ value based on classifiers)

### `tw_resourceagenda`

- **Meaning**: Personal agenda for resources to order/manage work across clients/apps.
- **Notes**: relates back to a work item; used to answer “what is Mike’s agenda right now?”

### `tw_contract`

- **Meaning**: Signed SOW / contract (also think: “project”).

### `tw_postedactivity`

- **Meaning**: Hours logged to a contract/project (when Ruddr sync is functioning).
- **Limitations**: typically at contract level, not per application.

### `tw_recurringvalueitem`

- **Meaning**: Template rows describing recurring value delivered for an application (hours saved + dollar value).
- **Automation**: month-end workflow uses these to generate recurring-value work items in `tw_customerboard`.

### `tw_valuereportrequest`

- **Meaning**: Month-end value report compilation; CSM collects context and a PDF is generated in `tw_pdffile`.

### `tw_shelfitem`

- **Meaning**: Reusable “Shelf Items” (solutions/processes) that can be generalized across clients/verticals.

### `tw_shelfitemapps`

- **Meaning**: Mapping table indicating where shelf items are used per client/application.

## Relationship map (join anchors)

Use these as the default join paths. Prefer `describe_table` first if the exact column names differ.

- `account.accountid` → `tw_application.tw_account`
- `account.accountid` → `tw_contract.tw_account`
- `account.accountid` → `tw_sprint.tw_account`
- `account.accountid` → `tw_valuereportrequest.tw_account`

- `tw_application.tw_applicationid` → `tw_customerboard.tw_application`
- `tw_application.tw_applicationid` → `tw_shelfitemapps.tw_application`
- `tw_application.tw_applicationid` → `tw_recurringvalueitem.tw_application`

- `tw_resource.tw_resourceid` → `tw_customerboard.tw_assignedto`
- `tw_resource.tw_resourceid` → `tw_resourceagenda.tw_resource`

- `tw_resourceagenda.tw_workitem` → `tw_customerboard.tw_customerboardid`
- `tw_sprint.tw_sprintid` → `tw_customerboard.tw_sprint`

- `tw_contract.tw_contractid` → `tw_postedactivity.tw_contract`
- `tw_shelfitem.tw_shelfitemid` → `tw_shelfitemapps.tw_shelfitem`

- `tw_valuereportrequest.tw_valuereportrequestid` → `tw_valuereportrequestrelationship.tw_valuereportrequest`
- `tw_sprint.tw_sprintid` → `tw_valuereportrequestrelationship.tw_sprint`

## Operating rules (shared defaults)

- **Read-first**: prefer `list_tables` → `describe_table` → `read_query`.
- **Writes**: do not use `create_record`, `update_record`, or deletes unless the user explicitly requests a persistent change and understands impact.
- **Client filtering**: when talking about “managed services clients”, default to `account.tw_ismanagedservicecustomer = true` unless asked otherwise.
- **Acronyms**: when a user references an account by acronym (e.g. “AAA”), interpret it as `account.tw_alias = 'AAA'`.

### `tw_customerboard` create checklist

1. **Never include `tw_workitemid`** in `create_record` or `update_record` — autonumber only. Omit the key completely (UI Required does not mean send a value). Reference new rows by returned **`tw_customerboardid`** (GUID). Short IDs assigned after insert (e.g. `V`, `KX`, `CA`) are platform-generated, not agent-chosen. Pre-flight: strip `tw_workitemid` from the JSON before every create.
2. **Classifier defaults** when the user does not specify:

| Field | Medium label | GUID |
|---|---|---|
| `tw_businessimpact` | M | `53c369f5-54d6-ee11-9079-000d3a5789bf` |
| `tw_effort` (effort/complexity; lookup `tw_workitemsize`) | M - Medium | `3bf14a12-3fd6-ee11-9079-0022482eab8d` |
| `tw_severity` | Medium | `3a54e614-3fd6-ee11-9079-00224825b557` |

3. **Completed / Pending signoff**: set **`tw_datecompleted`** in the same write as the progress change.

See also `docs/runbooks/dataverse-managed-services.md` § Creating work items.

## Canonical questions (examples)

These are the “north star” queries this environment should answer. Agents should derive the exact SQL by describing the needed tables first.

1. **Hours saved per client last month**
   - Likely sources: `tw_recurringvalueitem` (hours saved), sprints/month boundaries, and/or value report relationships.

2. **Active work assigned to Caroline**
   - Use `tw_customerboard` joined to `tw_resource`, filter progress ≠ completed/removed/on hold.

3. **Mike’s agenda right now**
   - Use `tw_resourceagenda` joined to `tw_resource` + `tw_customerboard`.

4. **What’s planned for the next 2 months for AAA**
   - Use `account.tw_alias = 'AAA'`, find future `tw_sprint` rows, then `tw_customerboard` work items.

5. **Human Services (HCBS) shelf items with working demos**
   - Use `tw_shelfitem` metadata (vertical/category tags) plus “has working demo” indicator column(s).

## Quick prompting tips (works well with agents)

- Start prompts with: “Use `dataverse-managed-services`.”
- Ask for a **2-step** approach: “First identify tables/columns with `describe_table`, then query.”
- If a query fails due to unsupported SQL, adjust to a simpler `read_query` and iterate.
