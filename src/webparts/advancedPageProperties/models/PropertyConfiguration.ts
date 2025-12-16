/**
 * Display style options for property values
 */
export enum TextStyle {
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  Body = "body"
}

/**
 * Display mode for property values
 */
export enum DisplayMode {
  Capsule = "capsule",
  Text = "text"
}

/**
 * Configuration for a single page property
 */
export interface PropertyConfiguration {
  fieldName: string;
  displayMode: DisplayMode;
  textStyle: TextStyle;
  hideLabel: boolean;
}
