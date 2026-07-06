import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { WebPartContext } from "@microsoft/sp-webpart-base";

let _sp: SPFI | undefined;

export function getSP(context?: WebPartContext): SPFI {
  if (context) {
    _sp = spfi().using(SPFx(context));
  }
  if (!_sp) {
    throw new Error("PnPjs has not been initialized. Call getSP(context) from the web part onInit first.");
  }
  return _sp;
}
