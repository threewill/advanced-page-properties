import { IFieldInfo } from "@pnp/sp/fields";

export interface IFieldInfoExtended extends IFieldInfo {
  ShowAsPercentage?: boolean;
  CommaSeparator?: boolean;
  DateFormat?: string;
}

export interface PageProperty {
  info: IFieldInfoExtended;
  values: any[];
}
