---
name: URL Page Properties Web Part
overview: Create a new separate web part called "URL Page Properties" that displays URL fields as tiles in a grid layout, similar to Quick Links. The web part will support thumbnail selection (using SharePoint icon picker), name overrides, and configurable tile sizes.
todos:
  - id: "1"
    content: "Create models: UrlPropertyConfiguration interface and TileSize enum"
    status: completed
  - id: "2"
    content: Create web part manifest with unique ID and configuration
    status: completed
  - id: "3"
    content: Create localization files (en-us.js and mystrings.d.ts)
    status: completed
  - id: "4"
    content: Create React component (UrlPageProperties.tsx) with tile rendering logic
    status: completed
  - id: "5"
    content: Create SCSS module with grid layout and tile size styles
    status: completed
  - id: "6"
    content: Create web part class with property pane (icon picker integration)
    status: completed
  - id: "7"
    content: Update config.json to register new web part bundle
    status: completed
  - id: "8"
    content: Test build and verify both web parts work in solution
    status: completed
---

# URL Page Properties Web Part Implementation Plan

## Overview

Create a new web part that displays URL page properties as tiles in a grid layout, similar to SharePoint Quick Links. This web part will be separate from the existing Advanced Page Properties web part and will be packaged in the same solution.

## Architecture

### File Structure

```
src/webparts/
  urlPageProperties/
    UrlPagePropertiesWebPart.ts
    UrlPagePropertiesWebPart.manifest.json
    components/
      UrlPageProperties.tsx
      UrlPageProperties.module.scss
      IUrlPagePropertiesProps.ts
    loc/
      en-us.js
      mystrings.d.ts
    models/
      index.ts
      UrlPropertyConfiguration.ts
    utilities/
      (reuse Log.ts from advancedPageProperties)
```

### Data Models

**UrlPropertyConfiguration** (`src/webparts/urlPageProperties/models/UrlPropertyConfiguration.ts`):

- `fieldName: string` - Internal name of the URL field
- `displayName: string` - Override name (defaults to field's Description)
- `iconName: string` - Selected icon name from SharePoint icon picker
- `customImageUrl?: string` - Optional custom image URL (for future use)

**TileSize enum** (`src/webparts/urlPageProperties/models/UrlPropertyConfiguration.ts`):

- ExtraSmall = "extraSmall" (64px)
- Small = "small" (96px)
- Medium = "medium" (128px)
- Large = "large" (160px)
- ExtraLarge = "extraLarge" (192px)

**IUrlPagePropertiesWebPartProps**:

- `title: string` - Web part title
- `tileSize: TileSize` - Selected tile size
- `urlProperties: UrlPropertyConfiguration[]` - Array of configured URL properties

## Implementation Steps

### 1. Create Models and Interfaces

**Create** `src/webparts/urlPageProperties/models/UrlPropertyConfiguration.ts`:

- Define `TileSize` enum with 5 size options
- Define `UrlPropertyConfiguration` interface
- Export from `models/index.ts`

### 2. Create Web Part Manifest

**Create** `src/webparts/urlPageProperties/UrlPagePropertiesWebPart.manifest.json`:

- Generate new unique ID (GUID)
- Set alias: "UrlPagePropertiesWebPart"
- Set title: "URL Page Properties"
- Set description for tile-based URL display
- Configure preconfigured entry with default properties
- Enable theme variants support

### 3. Create Localization Files

**Create** `src/webparts/urlPageProperties/loc/en-us.js`:

- TitleFieldLabel
- TileSizeLabel
- TileSizeExtraSmallLabel
- TileSizeSmallLabel
- TileSizeMediumLabel
- TileSizeLargeLabel
- TileSizeExtraLargeLabel
- UrlPropertyFieldLabel
- DisplayNameLabel
- IconPickerLabel
- AddButtonText
- DeleteButtonText

**Create** `src/webparts/urlPageProperties/loc/mystrings.d.ts`:

- TypeScript interface matching the localization strings

### 4. Create React Component

**Create** `src/webparts/urlPageProperties/components/UrlPageProperties.tsx`:

- Ensure it's a Function component, just like the existing AdvancedPageProperties component
- Fetch URL field values from Site Pages list item
- For each configured URL property:
        - Get field value (contains `Url` and `Description`)
        - Use `displayName` override or default to `Description`
        - Use `iconName` for icon display (Office UI Fabric icon)
        - Render as tile with icon, name, and link
- Implement grid layout using CSS Grid
- Support theme variants for colors
- Handle empty/null values gracefully

**Key rendering logic**:

- Map over `urlProperties` configuration
- For each, fetch the actual URL value from list item
- Render tile: icon (from iconName) + displayName + clickable link
- Apply tile size classes based on `tileSize` prop

### 5. Create SCSS Styles

**Create** `src/webparts/urlPageProperties/components/UrlPageProperties.module.scss`:

- Container styles with theme variant support
- Grid layout (CSS Grid) that adapts to tile sizes
- Tile styles for each size:
        - `.tileExtraSmall` (64px × 64px)
        - `.tileSmall` (96px × 96px)
        - `.tileMedium` (128px × 128px)
        - `.tileLarge` (160px × 160px)
        - `.tileExtraLarge` (192px × 192px)
- Tile hover effects
- Icon sizing within tiles
- Text styling for display names
- Responsive behavior (tiles wrap on smaller screens)

### 6. Create Web Part Class

**Create** `src/webparts/urlPageProperties/UrlPagePropertiesWebPart.ts`:

- Extend `BaseClientSideWebPart`
- Filter available properties to only URL fields (`TypeAsString === "URL"`)
- Property pane configuration:
        - Title text field
        - Tile size dropdown (5 options)
        - Dynamic list of URL property configurations:
                - Field selection dropdown (URL fields only)
                - Display name text field (seeded with field Description)
                - Icon picker using `PropertyFieldIconPicker` from @pnp/spfx-property-controls
                - Delete button for each property
        - Add button to add new URL property
- Theme provider integration (reuse pattern from AdvancedPageProperties)
- Data fetching: Get URL field values from current page's list item

**Property pane structure**:

```
- Title (TextField)
- Tile Size (Dropdown: Extra Small, Small, Medium, Large, Extra Large)
- [Horizontal Rule]
- For each urlProperty:
  - Property Field (Dropdown - URL fields only)
  - Display Name (TextField - seeded with Description)
  - Icon Picker (PropertyFieldIconPicker)
  - Delete Button
  - [Horizontal Rule]
- Add Button
```

### 7. Update Configuration Files

**Update** `config/config.json`:

- Add new bundle entry: `"url-page-properties-web-part"`
- Add component entrypoint and manifest
- Add localization resource for new web part strings

**Update** `config/package-solution.json`:

- Update solution name to reflect both web parts (or keep current name)
- Ensure both web parts are included in the package

### 8. Update Index Export (if needed)

**Check** `src/index.ts` - ensure it's set up correctly (currently just a placeholder)

### 9. Reuse Utilities

**Reuse** `src/webparts/advancedPageProperties/utilities/Log.ts`:

- Import Log utility in the new web part for consistent logging
- Or create shared utilities folder if preferred

## Technical Details

### Icon Picker Integration

- Use `PropertyFieldIconPicker` from `@pnp/spfx-property-controls`
- Store icon name as string (e.g., "Link", "Globe", "Share")
- Render icons using Office UI Fabric React's `Icon` component
- Icon size scales with tile size

### Tile Size Specifications

- **Extra Small**: 64px × 64px (icon: 24px, text: 10px)
- **Small**: 96px × 96px (icon: 32px, text: 12px)
- **Medium**: 128px × 128px (icon: 48px, text: 14px)
- **Large**: 160px × 160px (icon: 64px, text: 16px)
- **Extra Large**: 192px × 192px (icon: 80px, text: 18px)

### Data Flow

1. User configures URL properties in property pane
2. Component fetches current page's list item
3. For each configured URL property, retrieves field value
4. Renders tiles with icon, display name, and link
5. Tiles arranged in responsive grid layout

### Theme Integration

- Use `IReadonlyTheme` from `@microsoft/sp-component-base`
- Apply semantic colors for tile backgrounds, borders, text
- Support light/dark theme variants

## Dependencies

- All required packages already in `package.json`
- `@pnp/spfx-property-controls` already installed (v3.0.0)
- `@fluentui/react` for Icon component
- Existing PnP JS libraries for data fetching

## Testing Considerations

- Test with pages that have multiple URL fields
- Test with URL fields that have/do not have thumbnails
- Test all tile sizes
- Test theme variants
- Test responsive behavior
- Test icon picker functionality
- Test display name override (seeding and editing)

## Future Enhancements (Not in Scope)

- Custom image URL support (beyond icon picker)
- Thumbnail extraction from URL field metadata
- Drag-and-drop reordering of tiles
- Custom tile colors/styling per tile