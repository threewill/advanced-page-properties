import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { UrlPropertyConfiguration, TileSize } from '../models';

export interface IUrlPagePropertiesProps {
  context: WebPartContext;
  sp: SPFI;
  title: string;
  tileSize: TileSize;
  urlProperties: UrlPropertyConfiguration[];
  /** Height in pixels for embedded iframes (e.g. doc library view) */
  embedHeight: number;
  /** When true, hide border, title, and "Open in new tab" on embeds */
  hideEmbedChrome: boolean;
  themeVariant: IReadonlyTheme | undefined;
}
