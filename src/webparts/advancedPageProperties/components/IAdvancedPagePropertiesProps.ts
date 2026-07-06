import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { PropertyConfiguration } from '../models';

export interface IAdvancedPagePropertiesProps {
  context: WebPartContext;
  sp: SPFI;
  title: string;
  propertyConfigurations: PropertyConfiguration[];
  themeVariant: IReadonlyTheme | undefined;
  capsuleLinkUrl: string;
  useFieldNameForCapsuleLinkQSName: boolean;
  capsuleLinkQSFieldName: string;
}
