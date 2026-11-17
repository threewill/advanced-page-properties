---
name: Embedded URL Doc Library
overview: Add support for embedding a document library (or folder) file-explorer view via an iframe when the URL page property points to a folder. The plan compares extending the existing URL Page Properties web part versus introducing a third, embed-dedicated web part, and outlines the iframe implementation and SharePoint framing constraints.
todos: []
isProject: false
---

# Embedded Document Library via URL Page Property

## Goal

Allow a URL page property that points to a **folder in a document library** to be displayed as an **embedded iframe** (file-explorer style), similar to the Document Library web part on a SharePoint page, instead of only as a clickable tile.

## Option A: Extend the existing URL Page Properties web part

**Idea:** Add a per-URL-property display mode: **Link (tile)** vs **Embedded (iframe)**. When "Embedded" is chosen, that property is rendered as an iframe instead of a tile.

**Pros:**

- Single web part for all URL property display; one configuration surface.
- Reuses existing data flow (same property pane, same PnP fetch of URL fields from Site Pages).

**Cons:**

- Mixed layout: a grid of tiles plus one or more iframes with different sizing (iframes need explicit height) can look inconsistent.
- Property pane grows (per-URL: display mode, and for embed: height, maybe “open in new tab” link).
- The web part’s purpose broadens to “tiles and/or embeds,” which may confuse users who only want tiles.

**Implementation sketch:**

- In [UrlPropertyConfiguration](src/webparts/urlPageProperties/models/UrlPropertyConfiguration.ts): add `displayMode: 'tile' | 'embed'` and optionally `embedHeight?: number` (px).
- In [UrlPageProperties.tsx](src/webparts/urlPageProperties/components/UrlPageProperties.tsx): in the render loop, branch on `displayMode`: render `<a>` tile vs `<iframe src={url} style={{ height }} />`. Use a single shared height for all embeds (e.g. 400px default) or per-URL if you add `embedHeight`.
- In [UrlPagePropertiesWebPart.ts](src/webparts/urlPageProperties/UrlPagePropertiesWebPart.ts): add a dropdown (and optional number field for height) per URL in the property pane.
- Same-origin: the iframe `src` is the URL from the page property (e.g. folder link); no URL transformation needed unless you want to force a specific view (e.g. `AllItems.aspx`).

---

## Option B: Add a third web part — “Embedded URL Page Properties”

**Idea:** New web part whose **only** job is to take one (or more) URL page properties and render each in an iframe, with embed-specific settings (height, title, link to open in new tab).

**Pros:**

- Clear separation: **URL Page Properties** = tiles/links; **Embedded URL Page Properties** = iframe embeds.
- Embed web part can be tuned for doc-library use (height, aspect, “open in new tab” link) without touching the tile UX.
- Users who want both: add one instance for tiles and one for the embedded library.

**Cons:**

- Two web parts that both read URL page properties; a bit more to maintain and document.

**Implementation sketch:**

- New folder: `src/webparts/embeddedUrlPageProperties/` with manifest, web part class, and React component (mirror structure of [urlPageProperties](src/webparts/urlPageProperties/)).
- Reuse the same data pattern: get URL field(s) from Site Pages via PnP (same as [UrlPageProperties.tsx](src/webparts/urlPageProperties/components/UrlPageProperties.tsx) lines 74–114). Config: which URL property (single or multiple), optional title, default iframe height (e.g. 400px), optional “Open in new tab” link above/below iframe.
- Component: for each configured URL property value, render `<iframe src={url} title="..." style={{ height }} />` and optionally a link `<a href={url} target="_blank">Open in new tab</a>`.
- Register the new web part in the solution (new manifest; SPFx will pick it up from the build).

---

## Recommendation

- **Prefer Option B (third web part)** if you want a clear mental model (“tiles vs embeds”) and a dedicated place for height and “open in new tab” without cluttering the tile web part.
- **Prefer Option A (extend existing)** if you want a single web part that can do both tiles and embeds on the same instance (e.g. two tiles + one embedded library in one part).

---

## Iframe implementation details (apply to either option)

1. **URL source:** Use the URL from the page property as-is (user stores the folder or library view link). No change needed unless you want to normalize to a specific view (e.g. ensure `.../Forms/AllItems.aspx` for a library).
2. **Height:** Iframes need an explicit height. Use a property-pane setting (e.g. “Embed height (px)”) with a sensible default (e.g. 400–500). Optional: per-URL height if you support multiple embeds.
3. **Security / framing:** SharePoint often allows same-origin framing (page and iframe on same tenant/site). If the URL is same site collection, it usually works. If users see “refused to display in a frame,” the site may have strict `Content-Security-Policy: frame-ancestors` or `X-Frame-Options`. Document that the embed works when the page and the library/folder URL are same site; cross-site embedding may be blocked by SharePoint and would require tenant/admin changes.
4. **Accessibility:** Use a meaningful `title` on the iframe (e.g. display name of the property or “Document library: [name]”).
5. **Optional:** Add a small “Open in new tab” link so users can open the full library in a new window when the iframe is too constrained.

---

## Summary


| Approach                                   | Best when                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Extend URL Page Properties (A)**         | You want one web part that can show both tiles and embedded iframe(s) in the same instance.                                      |
| **New “Embedded URL Page Properties” (B)** | You want a dedicated embed experience and to keep the tile web part simple; users can still use both web parts on the same page. |


Both are feasible; the main tradeoff is **single multi-purpose web part** vs **focused second web part**. Iframe behavior and SharePoint framing constraints are the same either way.