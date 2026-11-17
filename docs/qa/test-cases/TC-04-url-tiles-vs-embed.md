# TC-04 — URL tiles vs iframe embed

**Area:** URL Page Properties  
**Related:** `UrlDisplayMode`, `embedHeight`, `hideEmbedChrome`, tile sizes

## Steps

1. Configure two URL fields (or the same field twice): one **Tile**, one **Embedded**.
2. Cycle tile sizes Extra Small → Extra Large (64 / 96 / 128 / 160 / 192).
3. Pick a non-default icon.
4. Set embed height to 200, 400, and 1200.
5. Enable **minimal embed** (hide chrome).
6. Open a URL that SharePoint or the target site frames, and one that sends `X-Frame-Options` / CSP to deny framing.

## Expected

- Tiles are a clickable grid; size matches the setting; icon and display name follow pane → Description → filename fallback.
- Embeds render in an iframe at the chosen height.
- Minimal chrome: no border/title/"Open in new tab" wrapper; iframe still shows.
- Denied framing fails visibly; this is known, not a product defect. Document the URL in the run notes without storing secrets.
