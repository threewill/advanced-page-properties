import { WebPartContext } from "@microsoft/sp-webpart-base";

/**
 * Returns the Site Pages library list id from page context when available.
 */
export function getPageListId(context: WebPartContext): string | undefined {
  const listId = context.pageContext.list?.id;
  return listId ? listId.toString() : undefined;
}

export function getPageListItemId(context: WebPartContext): number | undefined {
  return context.pageContext.listItem?.id;
}

export function hasPageListItem(context: WebPartContext): boolean {
  return context.pageContext.listItem !== undefined && context.pageContext.listItem !== null;
}
