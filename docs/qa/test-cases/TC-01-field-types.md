# TC-01 — Property display per field type

**Area:** Advanced Page Properties  
**Related:** `docs/FEATURES.md`, `src/webparts/advancedPageProperties/`

## Setup

A modern Site Page with sample values for each type below. Add the Advanced Page Properties web part and select those fields.

## Steps and expected

| Field | Mode | Expected |
| --- | --- | --- |
| Taxonomy (single-select) | Capsule | Term **label** (not GUID) in a capsule; search link. REST lookup may fill a blank API label. |
| Taxonomy (multi-select) | Capsule | Each term as its own capsule. |
| Hyperlink / URL | Capsule | Description text linking to the field URL (not the search page). |
| Thumbnail / image | either | Image renders. |
| Currency | Capsule or text | USD formatted; grouping follows field settings. |
| Number | Capsule or text | Percent or grouped number per field settings. |
| Date/time | Capsule or text | Format follows the field's DateFormat (US / ISO8601 / day of week / month spelled). |
| Choice / multi-choice / text | Capsule | Values as capsules. |
| Note | Text only | Line breaks preserved. Capsule option disabled in the pane. |
| Boolean | Text only | Yes/No, True/False, or ✅/❌ per pane setting. Capsule disabled. Values `true`/`false`, `1`/`0`, `"true"`/`"false"` all format. |
| User | — | Field does **not** appear in the property dropdown. |

## Pass

Every configured type matches the table; Note and Boolean cannot be switched to Capsule.
