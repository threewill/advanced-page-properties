//import { PageProperty } from "../models";

import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAdvancedPagePropertiesProps {
  context: WebPartContext;
  title: string;
  selectedProperties: string[];
}
