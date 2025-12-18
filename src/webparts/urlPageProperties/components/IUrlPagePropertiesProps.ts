import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { UrlPropertyConfiguration, TileSize } from '../models';

export interface IUrlPagePropertiesProps {
  context: WebPartContext;
  title: string;
  tileSize: TileSize;
  urlProperties: UrlPropertyConfiguration[];
  themeVariant: IReadonlyTheme | undefined;
}
