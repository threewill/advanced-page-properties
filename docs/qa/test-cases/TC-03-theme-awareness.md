# TC-03 — Theme awareness

**Area:** Both web parts  
**Related:** `supportsThemeVariants: true`, `ThemeProvider`

## Steps

1. Place Advanced Page Properties and URL Page Properties on a page.
2. Put the section in a **light** theme variant and a **dark** (or strong) variant.
3. Confirm capsules, body text, tile borders/backgrounds, and embed header links remain readable.

## Expected

- Colors follow section semantic tokens (accent capsules, body text, tile background/border, embed "Open in new tab" link).
- No hardcoded white-on-white or black-on-black in either variant.
- URL tiles and embeds honor the same theme variant as the original web part.
