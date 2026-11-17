# TC-02 — Capsule search links

**Area:** Advanced Page Properties  
**Related:** `capsuleLinkUrl`, `useFieldNameForCapsuleLinkQSFieldName`, `capsuleLinkQSFieldNameVal`

## Steps

1. Set capsule link URL to the default (`/_layouts/15/search.aspx/siteall`) or a custom site-relative search URL.
2. Display a text or taxonomy value in **Capsule** mode. Click the capsule.
3. Toggle "use field internal name as query-string key" vs a custom key (default `q`).
4. Switch the same property to **Text** mode.

## Expected

- Capsule click opens the configured search URL with the value in the query string (URL-encoded).
- Query-string key matches the toggle / custom name.
- Text mode shows the value **without** a search `<a>` (plain styled text).
- URL-type capsules still navigate to the **field URL**, not search (see TC-01).
