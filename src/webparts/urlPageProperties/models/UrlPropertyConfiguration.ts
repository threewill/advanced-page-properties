/**
 * Tile size options for URL property tiles
 */
export enum TileSize {
  ExtraSmall = "extraSmall",
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extraLarge"
}

/**
 * Display mode for a URL property: tile (link) or embedded iframe
 */
export enum UrlDisplayMode {
  Tile = "tile",
  Embed = "embed"
}

/**
 * Configuration for a single URL property
 */
export interface UrlPropertyConfiguration {
  fieldName: string;
  displayName: string;
  iconName: string;
  customImageUrl?: string;
  /** How to display: as a tile link or as an embedded iframe (e.g. doc library) */
  displayMode?: UrlDisplayMode;
}
