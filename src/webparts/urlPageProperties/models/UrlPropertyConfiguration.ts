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
 * Configuration for a single URL property
 */
export interface UrlPropertyConfiguration {
  fieldName: string;
  displayName: string;
  iconName: string;
  customImageUrl?: string;
}
