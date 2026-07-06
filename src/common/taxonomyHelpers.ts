import { SPFI, SPQueryable } from "@pnp/sp";

export interface ITaxonomyFieldValue {
  Label: string;
  TermGuid: string;
  WssId: number;
}

interface ITermStoreTerm {
  labels?: { name: string; languageTag?: string }[];
  name?: string;
}

/**
 * Resolves a single-select taxonomy term label via the SharePoint v2.1 term store REST API.
 */
export async function resolveTaxonomyTermLabel(
  sp: SPFI,
  termGuid: string,
  fallbackLabel: string
): Promise<string> {
  try {
    const term = await SPQueryable(sp.web, `_api/v2.1/termStore/terms/${termGuid}`)() as ITermStoreTerm;
    const labels = term?.labels;
    const defaultLabel =
      labels?.find((l: { name: string; languageTag?: string }) => l.languageTag === "en-US")?.name ??
      labels?.[0]?.name ??
      term?.name;
    return defaultLabel ?? fallbackLabel;
  } catch {
    return fallbackLabel;
  }
}
